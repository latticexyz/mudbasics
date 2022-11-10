// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";

import { PositionComponent, ID as PositionComponentID, Coord } from "../components/PositionComponent.sol";
import { EnergyComponent, ID as EnergyComponentID } from "../components/EnergyComponent.sol";
import { CoolDownComponent, ID as CoolDownComponentID } from "../components/CoolDownComponent.sol";

uint256 constant ID = uint256(keccak256("system.Move"));
int32 constant MAX_DISTANCE = 5;

contract MoveSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    (uint256 entity, int32 energyInput) = abi.decode(arguments, (uint256, int32));

    // Initialize components
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    PositionComponent positionComponent = PositionComponent(getAddressById(components, PositionComponentID));
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));

    // Require cooldown period to be over
    if (coolDownComponent.has(entity)) {
      require(coolDownComponent.getValue(entity) < int32(int256(block.number)), "in cooldown period");
    }

    // Require the player to have enough energy
    int32 currentEnergyLevel = energyComponent.getValue(entity);
    require(currentEnergyLevel >= energyInput, "not enough energy");

    // 1 energy => 1 step, capped at MAX_DISTANCE
    int32 steps = energyInput;
    if (steps > MAX_DISTANCE) steps = MAX_DISTANCE;
    coolDownComponent.set(entity, int32(int256(block.number)) + 20);

    energyComponent.set(entity, currentEnergyLevel - energyInput);

    Coord memory currentPosition = positionComponent.getValue(entity);
    Coord memory newPosition = Coord(currentPosition.x + steps, currentPosition.y + steps);

    positionComponent.set(entity, newPosition);

    // Move either horizontally, vertically or diagonally
    // uint256 randomMovementPattern = uint256(
    //   keccak256(
    //     abi.encodePacked(
    //       block.timestamp,
    //       block.number,
    //       block.difficulty,
    //       msg.sender,
    //       currentPosition.x,
    //       currentPosition.y
    //     )
    //   )
    // ) % 3;

    // uint256 randomX = uint256(
    //   keccak256(abi.encodePacked(block.timestamp, block.number, msg.sender, currentPosition.x))
    // ) % 2;
    // uint256 randomY = uint256(
    //   keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender, currentPosition.y))
    // ) % 2;

    // if (randomMovementPattern == 0) {
    //   newPosition.y = currentPosition.y;
    //   // New random X position
    //   if (randomX == 0) {
    //     newPosition.x = currentPosition.x - steps;
    //   } else {
    //     newPosition.x = currentPosition.x + steps;
    //   }
    // } else if (randomMovementPattern == 1) {
    //   // New random Y position
    //   newPosition.x = currentPosition.x;
    //   if (randomY == 0) {
    //     newPosition.y = currentPosition.y - steps;
    //   } else {
    //     newPosition.y = currentPosition.y + steps;
    //   }
    // } else {
    //   // New random Y position
    //   if (randomY == 0) {
    //     newPosition.y = currentPosition.y - steps;
    //   } else {
    //     newPosition.y = currentPosition.y + steps;
    //   }
    //   if (randomX == 0) {
    //     newPosition.x = currentPosition.x - steps;
    //   } else {
    //     newPosition.x = currentPosition.x + steps;
    //   }
    // }
  }

  function executeTyped(uint256 entity, int32 energyInput) public returns (bytes memory) {
    return execute(abi.encode(entity, energyInput));
  }
}
