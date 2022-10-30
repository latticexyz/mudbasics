// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;
import "std-contracts/components/StringArrayComponent.sol";

uint256 constant ID = uint256(keccak256("component.Authors"));

contract AuthorsComponent is StringArrayComponent {
  constructor(address world) StringArrayComponent(world, ID) {}
}
