// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { QueryFragment, LibQuery, QueryType } from "solecs/LibQuery.sol";
import { EntityType } from "../types.sol";
import { MINIMUM_FIRE_SIZE, FIRE_BURNTIME_MULTIPLIER, COST_TO_MAKE_FIRE } from "../config.sol";

import { PositionComponent, ID as PositionComponentID, Coord } from "../components/PositionComponent.sol";
import { ResourceComponent, ID as ResourceComponentID } from "../components/ResourceComponent.sol";
import { EnergyComponent, ID as EnergyComponentID } from "../components/EnergyComponent.sol";
import { CoolDownComponent, ID as CoolDownComponentID } from "../components/CoolDownComponent.sol";
import { EntityTypeComponent, ID as EntityTypeComponentID } from "../components/EntityTypeComponent.sol";
import { CreatorComponent, ID as CreatorComponentID } from "../components/CreatorComponent.sol";
import { StatsComponent, ID as StatsComponentID, Stats } from "../components/StatsComponent.sol";
import { SeedComponent, ID as SeedComponentID } from "../components/SeedComponent.sol";
import { DeathComponent, ID as DeathComponentID } from "../components/DeathComponent.sol";

uint256 constant ID = uint256(keccak256("system.Fire"));

contract FireSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function getLazyUpdateEnergy(uint256 player) private view returns (uint32) {
    DeathComponent deathComponent = DeathComponent(getAddressById(components, DeathComponentID));
    // actualEnergy = deathBlock - currentBlock
    return uint32(deathComponent.getValue(player) - block.number);
  }

  function checkRequirements(uint256 player, uint32 resourceInput) private {
    EntityTypeComponent entityTypeComponent = EntityTypeComponent(getAddressById(components, EntityTypeComponentID));
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    ResourceComponent resourceComponent = ResourceComponent(getAddressById(components, ResourceComponentID));
    DeathComponent deathComponent = DeathComponent(getAddressById(components, DeathComponentID));

    // Require entity to be a player
    require(entityTypeComponent.getValue(player) == uint32(EntityType.Player), "only (a living) player can burn.");
    // Require cooldown period to be over
    require(coolDownComponent.getValue(player) < block.number, "in cooldown period");
    // Require the player to not be past its death block
    if (deathComponent.getValue(player) > block.number) {
      entityTypeComponent.set(player, uint32(EntityType.Corpse));
      coolDownComponent.set(player, 0);
      energyComponent.set(player, 0);
      require(false, "death block past. you are dead");
    }
    // Require the player to have COST_TO_MAKE_FIRE energy
    require(energyComponent.getValue(player) >= COST_TO_MAKE_FIRE, "not enough energy");
    // Enforce minimum fire size
    require(resourceInput >= MINIMUM_FIRE_SIZE, "minimum resource amount not reached");
    // Require the player to have enough resource
    require(resourceComponent.getValue(player) >= resourceInput, "not enough resource");
  }

  function makeSeedValue(uint256 fireId) private view returns (uint32) {
    return uint32(uint256(keccak256(abi.encodePacked(fireId, block.timestamp, block.number))));
  }

  function checkForFire(Coord memory position) private view returns (uint256[] memory) {
    PositionComponent positionComponent = PositionComponent(getAddressById(components, PositionComponentID));
    EntityTypeComponent entityTypeComponent = EntityTypeComponent(getAddressById(components, EntityTypeComponentID));

    QueryFragment[] memory fragments = new QueryFragment[](2);
    fragments[0] = QueryFragment(QueryType.HasValue, positionComponent, abi.encode(position));
    fragments[1] = QueryFragment(QueryType.HasValue, entityTypeComponent, abi.encode(EntityType.Fire));
    uint256[] memory entitiesAtPosition = LibQuery.query(fragments);
    return entitiesAtPosition;
  }

  function createNewFire(uint256 player, Coord memory position, uint32 resourceInput) private {
    PositionComponent positionComponent = PositionComponent(getAddressById(components, PositionComponentID));
    EntityTypeComponent entityTypeComponent = EntityTypeComponent(getAddressById(components, EntityTypeComponentID));
    SeedComponent seedComponent = SeedComponent(getAddressById(components, SeedComponentID));
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));
    ResourceComponent resourceComponent = ResourceComponent(getAddressById(components, ResourceComponentID));
    CreatorComponent creatorComponent = CreatorComponent(getAddressById(components, CreatorComponentID));

    uint256 newFire = world.getUniqueEntityId();
    positionComponent.set(newFire, position);
    entityTypeComponent.set(newFire, uint32(EntityType.Fire));
    seedComponent.set(newFire, makeSeedValue(newFire));
    // Cooldown = current block + resources to burn * FIRE_BURNTIME_MULTIPLIER
    coolDownComponent.set(newFire, block.number + resourceInput * FIRE_BURNTIME_MULTIPLIER);
    // Resources burnt in this fire
    resourceComponent.set(newFire, resourceInput);
    uint256[] memory creatorArray = new uint256[](1);
    creatorArray[0] = player;
    creatorComponent.set(newFire, creatorArray);
  }

  function addToFire(uint256 fire, uint256 player, uint32 resourceInput) private {
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));
    ResourceComponent resourceComponent = ResourceComponent(getAddressById(components, ResourceComponentID));
    CreatorComponent creatorComponent = CreatorComponent(getAddressById(components, CreatorComponentID));

    // If cooldown block is passed (fire is burnt out), count up from current block number
    uint256 currentCoolDownBlock = coolDownComponent.getValue(fire) > block.number
      ? coolDownComponent.getValue(fire)
      : block.number;
    // Cooldown = current block + resources to burn * FIRE_BURNTIME_MULTIPLIER
    coolDownComponent.set(fire, currentCoolDownBlock + resourceInput * FIRE_BURNTIME_MULTIPLIER);
    // Add to resources burnt in this fire
    resourceComponent.set(fire, resourceComponent.getValue(fire) + resourceInput);

    // Add player to creator list
    uint256[] memory currentCreatorArray = creatorComponent.getValue(fire);
    uint256[] memory newCreatorArray = new uint256[](currentCreatorArray.length + 1);
    for (uint256 i = 0; i < currentCreatorArray.length; i++) {
      newCreatorArray[i] = currentCreatorArray[i];
    }
    newCreatorArray[newCreatorArray.length - 1] = player;
    creatorComponent.set(fire, newCreatorArray);
  }

  function updatePlayer(uint256 player, uint32 resourceInput) private {
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    ResourceComponent resourceComponent = ResourceComponent(getAddressById(components, ResourceComponentID));
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));
    DeathComponent deathComponent = DeathComponent(getAddressById(components, DeathComponentID));

    deathComponent.set(player, deathComponent.getValue(player) - COST_TO_MAKE_FIRE);
    resourceComponent.set(player, resourceComponent.getValue(player) - resourceInput);
    energyComponent.set(player, energyComponent.getValue(player) - COST_TO_MAKE_FIRE);
    coolDownComponent.set(player, block.number + 10);
  }

  function updateStats(uint256 player, uint32 resourceInput) private {
    StatsComponent statsComponent = StatsComponent(getAddressById(components, StatsComponentID));
    Stats memory currentStats = statsComponent.getValue(player);
    currentStats.burnt += resourceInput;
    statsComponent.set(player, currentStats);
  }

  function checkIfDead(uint256 player) private {
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    EntityTypeComponent entityTypeComponent = EntityTypeComponent(getAddressById(components, EntityTypeComponentID));
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));

    if (energyComponent.getValue(player) <= 0) {
      entityTypeComponent.set(player, uint32(EntityType.Corpse));
      coolDownComponent.set(player, 0);
    }
  }

  function execute(bytes memory arguments) public returns (bytes memory) {
    (uint256 entity, uint32 resourceInput) = abi.decode(arguments, (uint256, uint32));

    checkRequirements(entity, resourceInput);

    PositionComponent positionComponent = PositionComponent(getAddressById(components, PositionComponentID));
    Coord memory playerPosition = positionComponent.getValue(entity);

    uint256[] memory firesAtPosition = checkForFire(playerPosition);
    if (firesAtPosition.length == 0) {
      createNewFire(entity, playerPosition, resourceInput);
    } else {
      addToFire(firesAtPosition[0], entity, resourceInput);
    }

    updatePlayer(entity, resourceInput);
    updateStats(entity, resourceInput);
    checkIfDead(entity);
  }

  function executeTyped(uint256 entity, uint32 resourceInput) public returns (bytes memory) {
    return execute(abi.encode(entity, resourceInput));
  }
}
