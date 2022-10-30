// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById } from "solecs/utils.sol";

import { SoundUriComponent, ID as SoundUriComponentID } from "../components/SoundUriComponent.sol";

uint256 constant ID = uint256(keccak256("system.UploadSound"));

contract UploadSoundSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    (uint256 entity, string memory desiredSoundUri) = abi.decode(arguments, (uint256, string));

    SoundUriComponent soundComponent = SoundUriComponent(getAddressById(components, SoundUriComponentID));
    soundComponent.set(entity, desiredSoundUri);
  }

  function executeTyped(uint256 entity, string memory desiredSound) public returns (bytes memory) {
    return execute(abi.encode(entity, desiredSound));
  }
}
