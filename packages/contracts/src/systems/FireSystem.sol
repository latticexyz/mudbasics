// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { entityType } from "../constants.sol";

import { PositionComponent, ID as PositionComponentID, Coord } from "../components/PositionComponent.sol";
import { ResourceComponent, ID as ResourceComponentID } from "../components/ResourceComponent.sol";
import { EnergyComponent, ID as EnergyComponentID } from "../components/EnergyComponent.sol";
import { CoolDownComponent, ID as CoolDownComponentID } from "../components/CoolDownComponent.sol";
import { EntityTypeComponent, ID as EntityTypeComponentID } from "../components/EntityTypeComponent.sol";

uint256 constant ID = uint256(keccak256("system.Fire"));

contract FireSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    (uint256 entity, int32 resourceInput) = abi.decode(arguments, (uint256, int32));

    // Initialize components
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    PositionComponent positionComponent = PositionComponent(getAddressById(components, PositionComponentID));
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));
    ResourceComponent resourceComponent = ResourceComponent(getAddressById(components, ResourceComponentID));
    EntityTypeComponent entityTypeComponent = EntityTypeComponent(getAddressById(components, EntityTypeComponentID));

    // Require cooldown period to be over
    require(coolDownComponent.getValue(entity) < int32(int256(block.number)), "in cooldown period");

    // Require the player to have enough (50) energy
    int32 currentEnergyLevel = energyComponent.getValue(entity);
    require(currentEnergyLevel >= 50, "not enough energy");

    // Require the player to have enough resource
    int32 currentResourceLevel = resourceComponent.getValue(entity);
    require(currentResourceLevel >= resourceInput, "not enough resource");

    Coord memory playerPosition = positionComponent.getValue(entity);

    // Create fire at position
    uint256 newFireEntity = world.getUniqueEntityId();
    positionComponent.set(newFireEntity, playerPosition);
    entityTypeComponent.set(newFireEntity, uint32(entityType.Fire));
    resourceComponent.set(newFireEntity, resourceInput);

    // Update values on player entity
    resourceComponent.set(entity, currentResourceLevel - resourceInput);
    energyComponent.set(entity, currentEnergyLevel - 50);
    coolDownComponent.set(entity, int32(int256(block.number)) + 20);
  }

  function executeTyped(uint256 entity, int32 resourceInput) public returns (bytes memory) {
    return execute(abi.encode(entity, resourceInput));
  }
}
