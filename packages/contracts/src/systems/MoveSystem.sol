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
    (uint256 entity, Coord memory targetPosition) = abi.decode(arguments, (uint256, Coord));

    EnergyComponent energy = EnergyComponent(getAddressById(components, EnergyComponentID));

    if (energy.has(entity)) {
      int32 currentEnergyLevel = energy.getValue(entity);

      if (currentEnergyLevel > 1) {
        PositionComponent position = PositionComponent(getAddressById(components, PositionComponentID));
        position.set(entity, targetPosition);
        energy.set(entity, currentEnergyLevel - 1);
      }
    }
  }

  function executeTyped(uint256 entity, Coord memory targetPosition) public returns (bytes memory) {
    return execute(abi.encode(entity, targetPosition));
  }
}
