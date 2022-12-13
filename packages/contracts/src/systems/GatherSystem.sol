// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { QueryFragment, LibQuery, QueryType } from "solecs/LibQuery.sol";
import { Perlin } from "noise/Perlin.sol";
import { ABDKMath64x64 as Math } from "abdk-libraries-solidity/ABDKMath64x64.sol";
import { SPAWN_RESOURCE_PER_POSITION } from "../config.sol";
import { EntityType } from "../types.sol";
import { PositionComponent, ID as PositionComponentID, Coord } from "../components/PositionComponent.sol";
import { ResourceComponent, ID as ResourceComponentID } from "../components/ResourceComponent.sol";
import { EnergyComponent, ID as EnergyComponentID } from "../components/EnergyComponent.sol";
import { CoolDownComponent, ID as CoolDownComponentID } from "../components/CoolDownComponent.sol";
import { EntityTypeComponent, ID as EntityTypeComponentID } from "../components/EntityTypeComponent.sol";
import { StatsComponent, ID as StatsComponentID, Stats } from "../components/StatsComponent.sol";
import { CannibalComponent, ID as CannibalComponentID } from "../components/CannibalComponent.sol";

uint256 constant ID = uint256(keccak256("system.Gather"));

contract GatherSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function updateStats(uint256 entity, uint32 resourceToExtract) private {
    StatsComponent statsComponent = StatsComponent(getAddressById(components, StatsComponentID));
    Stats memory currentStats = statsComponent.getValue(entity);
    currentStats.gathered += resourceToExtract;
    statsComponent.set(entity, currentStats);
  }

  function checkForEntity(Coord memory position, uint256 t) private view returns (uint256[] memory) {
    PositionComponent positionComponent = PositionComponent(getAddressById(components, PositionComponentID));
    EntityTypeComponent entityTypeComponent = EntityTypeComponent(getAddressById(components, EntityTypeComponentID));

    QueryFragment[] memory fragments = new QueryFragment[](2);
    fragments[0] = QueryFragment(QueryType.HasValue, positionComponent, abi.encode(position));
    fragments[1] = QueryFragment(QueryType.HasValue, entityTypeComponent, abi.encode(t));
    return LibQuery.query(fragments);
  }

  function cannabalize(uint256 entity, uint256 corpse) private {
    CannibalComponent cannibalComponent = CannibalComponent(getAddressById(components, CannibalComponentID));
    ResourceComponent resourceComponent = ResourceComponent(getAddressById(components, ResourceComponentID));
    EntityTypeComponent entityTypeComponent = EntityTypeComponent(getAddressById(components, EntityTypeComponentID));

    // Transfer all resources from corpse to player
    resourceComponent.set(entity, resourceComponent.getValue(entity) + resourceComponent.getValue(corpse));
    resourceComponent.set(corpse, 0);
    // Turn corpse into ghost
    entityTypeComponent.set(corpse, uint32(EntityType.Ghost));

    // Add corpse to player's cannibal list
    uint256[] memory currentCannibalArray = cannibalComponent.getValue(entity);
    uint256[] memory newCannibalArray = new uint256[](currentCannibalArray.length + 1);
    for (uint32 i = 0; i < currentCannibalArray.length; i++) {
      newCannibalArray[i] = currentCannibalArray[i];
    }
    newCannibalArray[newCannibalArray.length - 1] = corpse;
    cannibalComponent.set(entity, newCannibalArray);
  }

  function execute(bytes memory arguments) public returns (bytes memory) {
    (uint256 entity, uint32 energyInput) = abi.decode(arguments, (uint256, uint32));

    // Initialize components
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));
    PositionComponent positionComponent = PositionComponent(getAddressById(components, PositionComponentID));
    EntityTypeComponent entityTypeComponent = EntityTypeComponent(getAddressById(components, EntityTypeComponentID));
    ResourceComponent resourceComponent = ResourceComponent(getAddressById(components, ResourceComponentID));

    // Require entity to be player
    require(entityTypeComponent.getValue(entity) == uint32(EntityType.Player), "only (a living) player can gather.");

    // Require cooldown period to be over
    require(coolDownComponent.getValue(entity) < block.number, "in cooldown period");

    // Require the player to have enough energy
    uint32 currentEnergyLevel = energyComponent.getValue(entity);
    require(currentEnergyLevel >= energyInput, "not enough energy");

    // Get player position
    Coord memory playerPosition = positionComponent.getValue(entity);

    // Require there to not be a fire in position
    require(checkForEntity(playerPosition, uint32(EntityType.Fire)).length == 0, "can not gather in fire");

    // Get player resource balance
    uint32 currentResourceBalance = resourceComponent.getValue(entity);

    // Scale resource allocation by perlin noise value
    // resources = energyInput * (perlin noise / 2**16 <= precision)
    uint32 resourceToExtract = uint32(
      uint64(
        Math.toInt(
          Math.mul(
            Math.fromUInt(energyInput),
            Math.div(Perlin.noise2d(playerPosition.x, playerPosition.y, 20, 16), 2 ** 16)
          )
        )
      )
    );

    // Check for corpses in current location
    uint256[] memory corpsesAtPosition = checkForEntity(playerPosition, uint32(EntityType.Corpse));

    if (corpsesAtPosition.length > 0) {
      cannabalize(entity, corpsesAtPosition[0]);
    } else {
      // Check for terrain component in current location
      uint256[] memory terrainAtPosition = checkForEntity(playerPosition, uint32(EntityType.Terrain));

      if (terrainAtPosition.length == 0) {
        // The position HAS NOT been gathered before,
        // there are INITIAL_RESOURCE_PER_POSITION resources available

        // Cap resource extraction at INITIAL_RESOURCE_PER_POSITION
        if (resourceToExtract > SPAWN_RESOURCE_PER_POSITION) resourceToExtract = SPAWN_RESOURCE_PER_POSITION;

        // Create new terrain block at position
        uint256 newTerrainEntity = world.getUniqueEntityId();
        positionComponent.set(newTerrainEntity, playerPosition);
        entityTypeComponent.set(newTerrainEntity, uint32(EntityType.Terrain));
        resourceComponent.set(newTerrainEntity, SPAWN_RESOURCE_PER_POSITION - resourceToExtract);
      } else {
        // The position HAS been gathered before,
        // there are terrainResourceBalance resources available

        uint32 terrainResourceBalance = resourceComponent.getValue(terrainAtPosition[0]);

        // Require there to be resources in the position
        require(terrainResourceBalance > 0, "no resources in position");

        // Cap resource extraction at available resources
        if (resourceToExtract > terrainResourceBalance) resourceToExtract = terrainResourceBalance;

        // Update value on terrain entity
        resourceComponent.set(terrainAtPosition[0], terrainResourceBalance - resourceToExtract);
      }

      // Update resource related values on player entity
      resourceComponent.set(entity, currentResourceBalance + resourceToExtract);
      updateStats(entity, resourceToExtract);
    }

    energyComponent.set(entity, currentEnergyLevel - energyInput);
    coolDownComponent.set(entity, block.number + 10);

    // Check if dead
    if (currentEnergyLevel - energyInput <= 0) {
      entityTypeComponent.set(entity, uint32(EntityType.Corpse));
      coolDownComponent.set(entity, 0);
    }
  }

  function executeTyped(uint256 entity, uint32 energyInput) public returns (bytes memory) {
    return execute(abi.encode(entity, energyInput));
  }
}
