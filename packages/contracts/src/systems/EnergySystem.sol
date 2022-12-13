// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { EntityType } from "../types.sol";
import { RESOURCE_TO_ENERGY_CONVERSION_RATE } from "../config.sol";

import { EnergyComponent, ID as EnergyComponentID } from "../components/EnergyComponent.sol";
import { ResourceComponent, ID as ResourceComponentID } from "../components/ResourceComponent.sol";
import { CoolDownComponent, ID as CoolDownComponentID } from "../components/CoolDownComponent.sol";
import { StatsComponent, ID as StatsComponentID, Stats } from "../components/StatsComponent.sol";
import { EntityTypeComponent, ID as EntityTypeComponentID } from "../components/EntityTypeComponent.sol";
import { DeathComponent, ID as DeathComponentID } from "../components/DeathComponent.sol";

uint256 constant ID = uint256(keccak256("system.Energy"));

contract EnergySystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function checkRequirements(uint256 player, uint32 resourceInput) private view {
    EntityTypeComponent entityTypeComponent = EntityTypeComponent(getAddressById(components, EntityTypeComponentID));
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));
    ResourceComponent resourceComponent = ResourceComponent(getAddressById(components, ResourceComponentID));

    // Require entity to be a player
    require(entityTypeComponent.getValue(player) == uint32(EntityType.Player), "only (a living) player can eat.");

    // Require cooldown period to be over
    require(coolDownComponent.getValue(player) < block.number, "in cooldown period");

    // Require the player to have enough resource
    require(resourceComponent.getValue(player) >= resourceInput, "not enough resources");
  }

  function updatePlayer(uint256 player, uint32 resourceInput) private {
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    ResourceComponent resourceComponent = ResourceComponent(getAddressById(components, ResourceComponentID));
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));
    DeathComponent deathComponent = DeathComponent(getAddressById(components, DeathComponentID));

    uint32 lazyEnergyLoss = uint32(deathComponent.getValue(player) - block.number);
    uint32 currentEnergyLevel = energyComponent.getValue(player) - lazyEnergyLoss;

    // 1 resource => RESOURCE_TO_ENERGY_CONVERSION_RATE energy
    resourceComponent.set(player, resourceComponent.getValue(player) - resourceInput);
    energyComponent.set(player, currentEnergyLevel + resourceInput * RESOURCE_TO_ENERGY_CONVERSION_RATE);

    // Push death block forward
    deathComponent.set(player, block.number + resourceInput * RESOURCE_TO_ENERGY_CONVERSION_RATE);

    // Add 10 cooldown points
    coolDownComponent.set(player, block.number + 10);
  }

  function updateStats(uint256 player, uint32 resourceInput) private {
    StatsComponent statsComponent = StatsComponent(getAddressById(components, StatsComponentID));
    Stats memory currentStats = statsComponent.getValue(player);
    currentStats.eaten += resourceInput;
    statsComponent.set(player, currentStats);
  }

  function execute(bytes memory arguments) public returns (bytes memory) {
    (uint256 entity, uint32 resourceInput) = abi.decode(arguments, (uint256, uint32));
    checkRequirements(entity, resourceInput);
    updatePlayer(entity, resourceInput);
    updateStats(entity, resourceInput);
  }

  function executeTyped(uint256 entity, uint32 resourceInput) public returns (bytes memory) {
    return execute(abi.encode(entity, resourceInput));
  }
}
