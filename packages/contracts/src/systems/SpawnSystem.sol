// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";

import { PositionComponent, ID as PositionComponentID, Coord } from "../components/PositionComponent.sol";
import { EnergyComponent, ID as EnergyComponentID } from "../components/EnergyComponent.sol";
import { ResourceComponent, ID as ResourceComponentID } from "../components/ResourceComponent.sol";
import { AgentComponent, ID as AgentComponentID } from "../components/AgentComponent.sol";

uint256 constant ID = uint256(keccak256("system.Spawn"));

contract SpawnSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    uint256 entity = abi.decode(arguments, (uint256));

    PositionComponent positionComponent = PositionComponent(getAddressById(components, PositionComponentID));
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    ResourceComponent resourceComponent = ResourceComponent(getAddressById(components, ResourceComponentID));
    AgentComponent agentComponent = AgentComponent(getAddressById(components, AgentComponentID));

    if (!positionComponent.has(entity)) {
      int32 randomX = int32(
        int256(uint256(keccak256(abi.encodePacked(block.timestamp, block.number, msg.sender))) % 30)
      );
      int32 randomY = int32(
        int256(uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % 30)
      );
      Coord memory startingPosition = Coord(randomX, randomY);
      energyComponent.set(entity, 100);
      resourceComponent.set(entity, 0);
      positionComponent.set(entity, startingPosition);
      agentComponent.set(entity);
    }
  }

  function executeTyped(uint256 entity) public returns (bytes memory) {
    return execute(abi.encode(entity));
  }
}
