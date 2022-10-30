// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById } from "solecs/utils.sol";

import { AuthorsComponent, ID as AuthorsComponentID } from "../components/AuthorsComponent.sol";

uint256 constant ID = uint256(keccak256("system.SetAuthors"));

contract SetAuthorsSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    (uint256 entity, string memory desiredAuthors) = abi.decode(arguments, (uint256, string));

    AuthorsComponent AuthorsComponent = AuthorsComponent(getAddressById(components, AuthorsComponentID));
    AuthorsComponent.set(entity, desiredAuthors);
  }

  function executeTyped(uint256 entity, string memory desiredAuthors) public returns (bytes memory) {
    return execute(abi.encode(entity, desiredAuthors));
  }
}
