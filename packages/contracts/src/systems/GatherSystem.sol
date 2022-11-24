// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { QueryFragment, LibQuery, QueryType } from "solecs/LibQuery.sol";
import { Perlin } from "noise/Perlin.sol";
import { ABDKMath64x64 as Math } from "abdk-libraries-solidity/ABDKMath64x64.sol";

import { entityType } from "../constants.sol";
import { PositionComponent, ID as PositionComponentID, Coord } from "../components/PositionComponent.sol";
import { ResourceComponent, ID as ResourceComponentID } from "../components/ResourceComponent.sol";
import { EnergyComponent, ID as EnergyComponentID } from "../components/EnergyComponent.sol";
import { CoolDownComponent, ID as CoolDownComponentID } from "../components/CoolDownComponent.sol";
import { EntityTypeComponent, ID as EntityTypeComponentID } from "../components/EntityTypeComponent.sol";
import { StatsComponent, ID as StatsComponentID, Stats } from "../components/StatsComponent.sol";

uint256 constant ID = uint256(keccak256("system.Gather"));

int32 constant INITIAL_RESOURCE_PER_POSITION = 100;

contract GatherSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function updateStats(uint256 entity, int32 resourceToExtract) public {
    StatsComponent statsComponent = StatsComponent(getAddressById(components, StatsComponentID));
    Stats memory currentStats = statsComponent.getValue(entity);
    currentStats.gathered += resourceToExtract;
    statsComponent.set(entity, currentStats);
  }

  function execute(bytes memory arguments) public returns (bytes memory) {
    (uint256 entity, int32 energyInput) = abi.decode(arguments, (uint256, int32));

    // Initialize components
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    ResourceComponent resourceComponent = ResourceComponent(getAddressById(components, ResourceComponentID));
    PositionComponent positionComponent = PositionComponent(getAddressById(components, PositionComponentID));
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));
    EntityTypeComponent entityTypeComponent = EntityTypeComponent(getAddressById(components, EntityTypeComponentID));

    // Require cooldown period to be over
    require(coolDownComponent.getValue(entity) < int32(int256(block.number)), "in cooldown period");

    // Require the player to have enough energy
    int32 currentEnergyLevel = energyComponent.getValue(entity);
    require(currentEnergyLevel >= energyInput, "not enough energy");

    // Get player position
    Coord memory playerPosition = positionComponent.getValue(entity);

    // Require there to not be a fire in position
    // QueryFragment[] memory fireFragments = new QueryFragment[](2);
    // fireFragments[0] = QueryFragment(QueryType.HasValue, positionComponent, abi.encode(playerPosition));
    // fireFragments[1] = QueryFragment(QueryType.HasValue, entityTypeComponent, abi.encode(entityType.Fire));
    // uint256[] memory fireEntitiesAtPosition = LibQuery.query(fireFragments);
    // require(fireEntitiesAtPosition.length == 0, "can not gather in fire");

    // Get player resource balance
    int32 currentResourceBalance = resourceComponent.getValue(entity);

    // Scale resource allocation by perlin noise value
    // resources = energyInput * (perlin noise / 2**16 <= precision)
    int32 resourceToExtract = int32(
      Math.toInt(
        Math.mul(
          Math.fromInt(energyInput),
          Math.div(Perlin.noise2d(playerPosition.x, playerPosition.y, 20, 16), 2 ** 16)
        )
      )
    );

    // Check for terrain component in current location
    QueryFragment[] memory fragments = new QueryFragment[](2);
    fragments[0] = QueryFragment(QueryType.HasValue, positionComponent, abi.encode(playerPosition));
    fragments[1] = QueryFragment(QueryType.HasValue, entityTypeComponent, abi.encode(uint32(entityType.Terrain)));
    uint256[] memory entitiesAtPosition = LibQuery.query(fragments);

    if (entitiesAtPosition.length == 0) {
      // The position has NOT been gathered before,
      // there are INITIAL_RESOURCE_PER_POSITION resources available

      // Cap resource extraction at INITIAL_RESOURCE_PER_POSITION
      if (resourceToExtract > INITIAL_RESOURCE_PER_POSITION) resourceToExtract = INITIAL_RESOURCE_PER_POSITION;

      // Create new terrain block at position
      uint256 newTerrainEntity = world.getUniqueEntityId();
      positionComponent.set(newTerrainEntity, playerPosition);
      entityTypeComponent.set(newTerrainEntity, uint32(entityType.Terrain));
      resourceComponent.set(newTerrainEntity, INITIAL_RESOURCE_PER_POSITION - resourceToExtract);
    } else {
      // The position HAS been gathered before,
      // there are terrainResourceBalance resources available

      int32 terrainResourceBalance = resourceComponent.getValue(entitiesAtPosition[0]);

      // Require there to be resources in the position
      require(terrainResourceBalance > 0, "no resources in position");

      // Cap resource extraction at available resources
      if (resourceToExtract > terrainResourceBalance) resourceToExtract = terrainResourceBalance;

      // Update value on terrain entity
      resourceComponent.set(entitiesAtPosition[0], terrainResourceBalance - resourceToExtract);
    }

    // Update values on player entity
    resourceComponent.set(entity, currentResourceBalance + resourceToExtract);
    energyComponent.set(entity, currentEnergyLevel - energyInput);
    coolDownComponent.set(entity, int32(int256(block.number)) + energyInput);

    updateStats(entity, resourceToExtract);
  }

  function executeTyped(uint256 entity, int32 energyInput) public returns (bytes memory) {
    return execute(abi.encode(entity, energyInput));
  }
}
