// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../constants.sol";

import { PositionComponent, ID as PositionComponentID, Coord } from "../components/PositionComponent.sol";
import { EnergyComponent, ID as EnergyComponentID } from "../components/EnergyComponent.sol";
import { CoolDownComponent, ID as CoolDownComponentID } from "../components/CoolDownComponent.sol";
import { StatsComponent, ID as StatsComponentID, Stats } from "../components/StatsComponent.sol";

uint256 constant ID = uint256(keccak256("system.Move"));
int32 constant MAX_DISTANCE = 5;

contract MoveSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function updateStats(uint256 entity, int32 steps) public {
    StatsComponent statsComponent = StatsComponent(getAddressById(components, StatsComponentID));
    Stats memory currentStats = statsComponent.getValue(entity);
    currentStats.traveled += steps;
    statsComponent.set(entity, currentStats);
  }

  function execute(bytes memory arguments) public returns (bytes memory) {
    (uint256 entity, int32 energyInput, int32 direction) = abi.decode(arguments, (uint256, int32, int32));

    // Initialize components
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    PositionComponent positionComponent = PositionComponent(getAddressById(components, PositionComponentID));
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));

    // Require cooldown period to be over
    require(coolDownComponent.getValue(entity) < int32(int256(block.number)), "in cooldown period");

    // Require the player to have enough energy
    int32 currentEnergyLevel = energyComponent.getValue(entity);
    require(currentEnergyLevel >= energyInput, "not enough energy");

    // 10 energy => 1 step, capped at MAX_DISTANCE
    int32 steps = energyInput / 10;
    if (steps > MAX_DISTANCE) steps = MAX_DISTANCE;

    coolDownComponent.set(entity, int32(int256(block.number)) + 20);

    energyComponent.set(entity, currentEnergyLevel - energyInput);

    Coord memory currentPosition = positionComponent.getValue(entity);
    Coord memory newPosition = Coord(currentPosition.x, currentPosition.y);

    //  | 8 | 1 | 2 |
    //  | 7 | 0 | 3 |
    //  | 6 | 5 | 4 |

    if (direction == 1) {
      // 1 => N
      if (newPosition.y > 0) newPosition.y -= steps;
    } else if (direction == 2) {
      // 2 => NE
      if (newPosition.y > 0) newPosition.y -= steps;
      if (newPosition.x < WORLD_WIDTH) newPosition.x += steps;
    } else if (direction == 3) {
      // 3 => E
      if (newPosition.x < WORLD_WIDTH) newPosition.x += steps;
    } else if (direction == 4) {
      // 4 => SE
      if (newPosition.y < WORLD_HEIGHT) newPosition.y += steps;
      if (newPosition.x < WORLD_WIDTH) newPosition.x += steps;
    } else if (direction == 5) {
      // 5 => S
      if (newPosition.y < WORLD_HEIGHT) newPosition.y += steps;
    } else if (direction == 6) {
      // 6 => SW
      if (newPosition.y < WORLD_HEIGHT) newPosition.y += steps;
      if (newPosition.x > 0) newPosition.x -= steps;
    } else if (direction == 7) {
      // 7 => W
      if (newPosition.x > 0) newPosition.x -= steps;
    } else if (direction == 8) {
      // 8 => NW
      if (newPosition.y > 0) newPosition.y -= steps;
      if (newPosition.x > 0) newPosition.x -= steps;
    } else if (direction == 0) {
      // 0 => random
      // Move either along the X (0) or Y (1) axis
      uint256 randomAxis = uint256(
        keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender, currentPosition.y))
      ) % 2;

      // Either decrement (0) or increment (1) along the selected axis
      uint256 randomDirection = uint256(
        keccak256(abi.encodePacked(block.timestamp, block.number, msg.sender, currentPosition.x))
      ) % 2;

      // At eastern edge – move west
      if (randomAxis == 0 && currentPosition.x == 0) randomDirection = 1;
      // At western edge – move east
      if (randomAxis == 0 && currentPosition.x == WORLD_WIDTH) randomDirection = 0;
      // At northern edge – move south
      if (randomAxis == 1 && currentPosition.y == 0) randomDirection = 1;
      // At southern edge –  move north
      if (randomAxis == 1 && currentPosition.y == WORLD_HEIGHT) randomDirection = 0;

      // X-axis
      if (randomAxis == 0) {
        // Decrement
        if (randomDirection == 0) {
          newPosition.x = currentPosition.x - steps;
        }
        //Increment
        if (randomDirection == 1) {
          newPosition.x = currentPosition.x + steps;
        }
      }

      // Y-axis
      if (randomAxis == 1) {
        // Decrement
        if (randomDirection == 0) {
          newPosition.y = currentPosition.y - steps;
        }
        //Increment
        if (randomDirection == 1) {
          newPosition.y = currentPosition.y + steps;
        }
      }
    }

    positionComponent.set(entity, newPosition);

    updateStats(entity, steps);
  }

  function executeTyped(uint256 entity, int32 energyInput, int32 direction) public returns (bytes memory) {
    return execute(abi.encode(entity, energyInput, direction));
  }
}
