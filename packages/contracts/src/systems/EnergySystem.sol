// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";

import { EnergyComponent, ID as EnergyComponentID } from "../components/EnergyComponent.sol";

uint256 constant ID = uint256(keccak256("system.Energy"));

contract EnergySystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    uint256 entity = abi.decode(arguments, (uint256));
    int32 currentEnergyLevel;

    EnergyComponent energy = EnergyComponent(getAddressById(components, EnergyComponentID));

    if (energy.has(entity)) {
      currentEnergyLevel = energy.getValue(entity);
    } else {
      currentEnergyLevel = 100;
    }

    energy.set(entity, currentEnergyLevel + 1);
  }

  function executeTyped(uint256 entity) public returns (bytes memory) {
    return execute(abi.encode(entity));
  }
}
