// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById } from "solecs/utils.sol";
import { EntityType } from "../types.sol";
import { PLAYING_DURATION } from "../config.sol";

import { EnergyComponent, ID as EnergyComponentID } from "../components/EnergyComponent.sol";
import { CoolDownComponent, ID as CoolDownComponentID } from "../components/CoolDownComponent.sol";
import { PlayingComponent, ID as PlayingComponentID } from "../components/PlayingComponent.sol";
import { EntityTypeComponent, ID as EntityTypeComponentID } from "../components/EntityTypeComponent.sol";
import { StatsComponent, ID as StatsComponentID, Stats } from "../components/StatsComponent.sol";

uint256 constant ID = uint256(keccak256("system.Play"));

contract PlaySystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function checkRequirements(uint256 player, uint32 energyInput) private view {
    EntityTypeComponent entityTypeComponent = EntityTypeComponent(getAddressById(components, EntityTypeComponentID));
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    // Require entity to be player
    require(entityTypeComponent.getValue(player) == uint32(EntityType.Player), "only (a living) player can play.");
    // Require cooldown period to be over
    require(coolDownComponent.getValue(player) < block.number, "in cooldown period");
    // Require the player to have enough energy
    require(energyComponent.getValue(player) >= energyInput, "not enough energy");
  }

  function updatePlayer(uint256 player, uint32 energyInput) private {
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));
    PlayingComponent playingComponent = PlayingComponent(getAddressById(components, PlayingComponentID));

    energyComponent.set(player, energyComponent.getValue(player) - energyInput);
    coolDownComponent.set(player, block.number + PLAYING_DURATION);
    playingComponent.set(player, block.number + PLAYING_DURATION);
  }

  function updateStats(uint256 player, uint32 energyInput) private {
    StatsComponent statsComponent = StatsComponent(getAddressById(components, StatsComponentID));
    Stats memory currentStats = statsComponent.getValue(player);
    currentStats.played += energyInput;
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
    (uint256 entity, uint32 energyInput) = abi.decode(arguments, (uint256, uint32));
    checkRequirements(entity, energyInput);
    updatePlayer(entity, energyInput);
    updateStats(entity, energyInput);
    checkIfDead(entity);
  }

  function executeTyped(uint256 entity, uint32 energyInput) public returns (bytes memory) {
    return execute(abi.encode(entity, energyInput));
  }
}
