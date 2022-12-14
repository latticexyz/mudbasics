// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { WORLD_HEIGHT, WORLD_WIDTH, MAX_DISTANCE } from "../config.sol";
import { EntityType, Direction } from "../types.sol";

import { PositionComponent, ID as PositionComponentID, Coord } from "../components/PositionComponent.sol";
import { EnergyComponent, ID as EnergyComponentID } from "../components/EnergyComponent.sol";
import { CoolDownComponent, ID as CoolDownComponentID } from "../components/CoolDownComponent.sol";
import { StatsComponent, ID as StatsComponentID, Stats } from "../components/StatsComponent.sol";
import { EntityTypeComponent, ID as EntityTypeComponentID } from "../components/EntityTypeComponent.sol";
import { DeathComponent, ID as DeathComponentID } from "../components/DeathComponent.sol";

uint256 constant ID = uint256(keccak256("system.Move"));

contract MoveSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function getLazyUpdateEnergy(uint256 player) private view returns (uint32) {
    DeathComponent deathComponent = DeathComponent(getAddressById(components, DeathComponentID));
    // actualEnergy = deathBlock - currentBlock
    return uint32(deathComponent.getValue(player) - block.number);
  }

  function checkRequirements(uint256 player, uint32 energyInput) private {
    EntityTypeComponent entityTypeComponent = EntityTypeComponent(getAddressById(components, EntityTypeComponentID));
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));
    DeathComponent deathComponent = DeathComponent(getAddressById(components, DeathComponentID));
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));

    // Require entity to be player
    require(entityTypeComponent.getValue(player) == uint32(EntityType.Player), "only (a living) player can move.");
    // Require cooldown period to be over
    require(coolDownComponent.getValue(player) < block.number, "in cooldown period");
    // Require the player to not be past its death block
    if (deathComponent.getValue(player) > block.number) {
      entityTypeComponent.set(player, uint32(EntityType.Corpse));
      coolDownComponent.set(player, 0);
      energyComponent.set(player, 0);
      require(false, "death block past. you are dead");
    }
    // Require the player to have enough energy
    require(energyComponent.getValue(player) >= energyInput, "not enough energy");
  }

  function getNewPosition(
    Coord memory currentPosition,
    Direction direction,
    int32 steps
  ) private pure returns (Coord memory) {
    Coord memory newPosition = Coord(currentPosition.x, currentPosition.y);

    if (direction == Direction.North) {
      if (newPosition.y > 0) newPosition.y -= steps;
    } else if (direction == Direction.NorthEast) {
      if (newPosition.y > 0) newPosition.y -= steps;
      if (newPosition.x < WORLD_WIDTH) newPosition.x += steps;
    } else if (direction == Direction.East) {
      if (newPosition.x < WORLD_WIDTH) newPosition.x += steps;
    } else if (direction == Direction.SouthEast) {
      if (newPosition.y < WORLD_HEIGHT) newPosition.y += steps;
      if (newPosition.x < WORLD_WIDTH) newPosition.x += steps;
    } else if (direction == Direction.South) {
      if (newPosition.y < WORLD_HEIGHT) newPosition.y += steps;
    } else if (direction == Direction.SouthWest) {
      if (newPosition.y < WORLD_HEIGHT) newPosition.y += steps;
      if (newPosition.x > 0) newPosition.x -= steps;
    } else if (direction == Direction.West) {
      if (newPosition.x > 0) newPosition.x -= steps;
    } else if (direction == Direction.NorthWest) {
      if (newPosition.y > 0) newPosition.y -= steps;
      if (newPosition.x > 0) newPosition.x -= steps;
    }

    return newPosition;
  }

  function updatePlayer(uint256 player, uint32 energyInput) private {
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    DeathComponent deathComponent = DeathComponent(getAddressById(components, DeathComponentID));

    deathComponent.set(player, deathComponent.getValue(player) - energyInput);
    energyComponent.set(player, getLazyUpdateEnergy(player) - energyInput);
    coolDownComponent.set(player, block.number + 10);
  }

  function updateStats(uint256 entity, int32 steps) private {
    StatsComponent statsComponent = StatsComponent(getAddressById(components, StatsComponentID));
    Stats memory currentStats = statsComponent.getValue(entity);
    currentStats.traveled += uint32(steps);
    statsComponent.set(entity, currentStats);
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
    (uint256 entity, uint32 energyInput, uint32 direction) = abi.decode(arguments, (uint256, uint32, uint32));

    PositionComponent positionComponent = PositionComponent(getAddressById(components, PositionComponentID));

    checkRequirements(entity, energyInput);

    // 10 energy => 1 step, capped at MAX_DISTANCE
    int32 steps = int32(energyInput) / 10;
    if (steps > MAX_DISTANCE) steps = MAX_DISTANCE;

    // Set new position
    positionComponent.set(entity, getNewPosition(positionComponent.getValue(entity), Direction(direction), steps));

    updatePlayer(entity, energyInput);
    updateStats(entity, steps);
    checkIfDead(entity);
  }

  function executeTyped(uint256 entity, uint32 energyInput, uint32 direction) public returns (bytes memory) {
    return execute(abi.encode(entity, energyInput, direction));
  }
}
