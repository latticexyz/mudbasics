// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById } from "solecs/utils.sol";
import { entityType } from "../constants.sol";

import { EnergyComponent, ID as EnergyComponentID } from "../components/EnergyComponent.sol";
import { CoolDownComponent, ID as CoolDownComponentID } from "../components/CoolDownComponent.sol";
import { PlayingComponent, ID as PlayingComponentID } from "../components/PlayingComponent.sol";
import { EntityTypeComponent, ID as EntityTypeComponentID } from "../components/EntityTypeComponent.sol";
import { StatsComponent, ID as StatsComponentID, Stats } from "../components/StatsComponent.sol";

uint256 constant ID = uint256(keccak256("system.Play"));

contract PlaySystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function updateStats(uint256 entity, uint32 energyInput) private {
    StatsComponent statsComponent = StatsComponent(getAddressById(components, StatsComponentID));
    Stats memory currentStats = statsComponent.getValue(entity);
    currentStats.played += energyInput;
    statsComponent.set(entity, currentStats);
  }

  function execute(bytes memory arguments) public returns (bytes memory) {
    (uint256 entity, uint32 energyInput) = abi.decode(arguments, (uint256, uint32));

    // Initialize components
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));
    EntityTypeComponent entityTypeComponent = EntityTypeComponent(getAddressById(components, EntityTypeComponentID));
    PlayingComponent playingComponent = PlayingComponent(getAddressById(components, PlayingComponentID));

    // Require entity to be player
    require(entityTypeComponent.getValue(entity) == uint32(entityType.Player), "only (a living) player can play.");

    // Require cooldown period to be over
    require(coolDownComponent.getValue(entity) < block.number, "in cooldown period");

    // Require the player to have enough energy
    uint32 currentEnergyLevel = energyComponent.getValue(entity);
    require(currentEnergyLevel >= energyInput, "not enough energy");

    // Update values on player entity
    energyComponent.set(entity, currentEnergyLevel - energyInput);
    coolDownComponent.set(entity, block.number + 20);
    playingComponent.set(entity, block.number + 20);
    updateStats(entity, energyInput);

    // Check if dead
    if (energyComponent.getValue(entity) <= 0) {
      entityTypeComponent.set(entity, uint32(entityType.Corpse));
      coolDownComponent.set(entity, 0);
    }
  }

  function executeTyped(uint256 entity, uint32 energyInput) public returns (bytes memory) {
    return execute(abi.encode(entity, energyInput));
  }
}
