// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";

import { PositionComponent, ID as PositionComponentID, Coord } from "../components/PositionComponent.sol";
import { EnergyComponent, ID as EnergyComponentID } from "../components/EnergyComponent.sol";

uint256 constant ID = uint256(keccak256("system.Move"));

contract MoveSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    uint256 entity = abi.decode(arguments, (uint256));

    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    PositionComponent positionComponent = PositionComponent(getAddressById(components, PositionComponentID));

    if (energyComponent.has(entity) && positionComponent.has(entity)) {
      int32 currentEnergyLevel = energyComponent.getValue(entity);

      if (currentEnergyLevel > 1) {
        Coord memory currentPosition = positionComponent.getValue(entity);
        Coord memory newPosition = Coord(currentPosition.x + 1, currentPosition.y + 1);

        // New random X position
        if (currentPosition.x == 0) {
          newPosition.x = currentPosition.x + 1;
        } else if (currentPosition.x == 100) {
          newPosition.x = currentPosition.x - 1;
        } else {
          uint256 randomX = uint256(
            keccak256(abi.encodePacked(block.timestamp, block.number, msg.sender, currentPosition.x))
          ) % 2;
          if (randomX == 0) {
            newPosition.x = currentPosition.x - 1;
          } else {
            newPosition.x = currentPosition.x + 1;
          }
        }

        // New random Y position
        if (currentPosition.y == 0) {
          newPosition.y = currentPosition.y + 1;
        } else if (currentPosition.y == 100) {
          newPosition.y = currentPosition.y - 1;
        } else {
          uint256 randomY = uint256(
            keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender, currentPosition.y))
          ) % 2;
          if (randomY == 0) {
            newPosition.y = currentPosition.y - 1;
          } else {
            newPosition.y = currentPosition.y + 1;
          }
        }

        positionComponent.set(entity, newPosition);
        energyComponent.set(entity, currentEnergyLevel - 1);
      }
    }
  }

  function executeTyped(uint256 entity) public returns (bytes memory) {
    return execute(abi.encode(entity));
  }
}
