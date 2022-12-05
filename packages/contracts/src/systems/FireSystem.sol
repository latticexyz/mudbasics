// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { QueryFragment, LibQuery, QueryType } from "solecs/LibQuery.sol";
import { entityType } from "../constants.sol";

import { PositionComponent, ID as PositionComponentID, Coord } from "../components/PositionComponent.sol";
import { ResourceComponent, ID as ResourceComponentID } from "../components/ResourceComponent.sol";
import { EnergyComponent, ID as EnergyComponentID } from "../components/EnergyComponent.sol";
import { CoolDownComponent, ID as CoolDownComponentID } from "../components/CoolDownComponent.sol";
import { EntityTypeComponent, ID as EntityTypeComponentID } from "../components/EntityTypeComponent.sol";
import { CreatorComponent, ID as CreatorComponentID } from "../components/CreatorComponent.sol";
import { StatsComponent, ID as StatsComponentID, Stats } from "../components/StatsComponent.sol";

uint256 constant ID = uint256(keccak256("system.Fire"));

contract FireSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function updateStats(uint256 entity, int32 resourceInput) public {
    StatsComponent statsComponent = StatsComponent(getAddressById(components, StatsComponentID));
    Stats memory currentStats = statsComponent.getValue(entity);
    currentStats.burnt += resourceInput;
    statsComponent.set(entity, currentStats);
  }

  function execute(bytes memory arguments) public returns (bytes memory) {
    (uint256 entity, int32 resourceInput) = abi.decode(arguments, (uint256, int32));

    // Initialize components
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    PositionComponent positionComponent = PositionComponent(getAddressById(components, PositionComponentID));
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));
    ResourceComponent resourceComponent = ResourceComponent(getAddressById(components, ResourceComponentID));
    EntityTypeComponent entityTypeComponent = EntityTypeComponent(getAddressById(components, EntityTypeComponentID));
    CreatorComponent creatorComponent = CreatorComponent(getAddressById(components, CreatorComponentID));

    // Require entity to be player
    require(entityTypeComponent.getValue(entity) == uint32(entityType.Player), "only (a living) player can burn.");

    // Require cooldown period to be over
    require(coolDownComponent.getValue(entity) < int32(int256(block.number)), "in cooldown period");

    // Require the player to have enough (50) energy
    int32 currentEnergyLevel = energyComponent.getValue(entity);
    require(currentEnergyLevel >= 50, "not enough energy");

    // Enforce minimum
    require(resourceInput >= 100, "minimum 100 resources to make fire");

    // Require the player to have enough resource
    int32 currentResourceLevel = resourceComponent.getValue(entity);
    require(currentResourceLevel >= resourceInput, "not enough resource");

    // Check if there is a fire at position
    Coord memory playerPosition = positionComponent.getValue(entity);
    QueryFragment[] memory fragments = new QueryFragment[](2);
    fragments[0] = QueryFragment(QueryType.HasValue, positionComponent, abi.encode(playerPosition));
    fragments[1] = QueryFragment(QueryType.HasValue, entityTypeComponent, abi.encode(entityType.Fire));
    uint256[] memory entitiesAtPosition = LibQuery.query(fragments);

    if (entitiesAtPosition.length == 0) {
      // Create new fire at position
      uint256 newFireEntity = world.getUniqueEntityId();
      positionComponent.set(newFireEntity, playerPosition);
      entityTypeComponent.set(newFireEntity, uint32(entityType.Fire));

      // Cooldown = current block + resources to burn * 10
      coolDownComponent.set(newFireEntity, int32(int256(block.number)) + resourceInput * 10);
      // Resources burnt in this fire
      resourceComponent.set(newFireEntity, resourceInput);

      uint256[] memory creatorArray = new uint256[](1);
      creatorArray[0] = entity;
      creatorComponent.set(newFireEntity, creatorArray);
    } else {
      // Add to existing fire at position
      // If cooldown block is passed (fire is burnt out), count up from current block number
      int32 currentCoolDownBlock = coolDownComponent.getValue(entitiesAtPosition[0]) > int32(int256(block.number))
        ? coolDownComponent.getValue(entitiesAtPosition[0])
        : int32(int256(block.number));
      coolDownComponent.set(entitiesAtPosition[0], currentCoolDownBlock + resourceInput * 10);
      // Add to resources burnt in this fire
      resourceComponent.set(entitiesAtPosition[0], resourceComponent.getValue(entitiesAtPosition[0]) + resourceInput);

      // Add player to creator list
      uint256[] memory currentCreatorArray = creatorComponent.getValue(entitiesAtPosition[0]);
      uint256[] memory newCreatorArray = new uint256[](currentCreatorArray.length + 1);
      for (uint256 i = 0; i < currentCreatorArray.length; i++) {
        newCreatorArray[i] = currentCreatorArray[i];
      }
      newCreatorArray[newCreatorArray.length - 1] = entity;
      creatorComponent.set(entitiesAtPosition[0], newCreatorArray);
    }

    // Update values on player entity
    resourceComponent.set(entity, currentResourceLevel - resourceInput);
    energyComponent.set(entity, currentEnergyLevel - 50);
    coolDownComponent.set(entity, int32(int256(block.number)) + 10);
    updateStats(entity, resourceInput);

    // Check if dead
    if (energyComponent.getValue(entity) <= 0) {
      entityTypeComponent.set(entity, uint32(entityType.Corpse));
      resourceComponent.set(entity, 500);
      coolDownComponent.set(entity, 0);
    }
  }

  function executeTyped(uint256 entity, int32 resourceInput) public returns (bytes memory) {
    return execute(abi.encode(entity, resourceInput));
  }
}
