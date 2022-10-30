// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById } from "solecs/utils.sol";

import { NameComponent, ID as NameComponentID } from "../components/NameComponent.sol";

uint256 constant ID = uint256(keccak256("system.SetName"));

contract SetNameSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    (uint256 entity, string memory desiredName) = abi.decode(arguments, (uint256, string));

    NameComponent nameComponent = NameComponent(getAddressById(components, NameComponentID));
    nameComponent.set(entity, desiredName);
  }

  function executeTyped(uint256 entity, string memory desiredName) public returns (bytes memory) {
    return execute(abi.encode(entity, desiredName));
  }
}
