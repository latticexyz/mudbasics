// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";

import { PositionComponent, ID as PositionComponentID, Coord } from "../components/PositionComponent.sol";
import { EnergyComponent, ID as EnergyComponentID } from "../components/EnergyComponent.sol";
import { ResourceComponent, ID as ResourceComponentID } from "../components/ResourceComponent.sol";
import { AgentComponent, ID as AgentComponentID } from "../components/AgentComponent.sol";
import { NameComponent, ID as NameComponentID } from "../components/NameComponent.sol";
import { CoolDownComponent, ID as CoolDownComponentID } from "../components/CoolDownComponent.sol";

uint256 constant ID = uint256(keccak256("system.Spawn"));

contract SpawnSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    (uint256 entity, string memory name) = abi.decode(arguments, (uint256, string));

    // Initialize components
    PositionComponent positionComponent = PositionComponent(getAddressById(components, PositionComponentID));
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    ResourceComponent resourceComponent = ResourceComponent(getAddressById(components, ResourceComponentID));
    AgentComponent agentComponent = AgentComponent(getAddressById(components, AgentComponentID));
    NameComponent nameComponent = NameComponent(getAddressById(components, NameComponentID));
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));

    if (!positionComponent.has(entity)) {
      int32 randomX = int32(
        int256(uint256(keccak256(abi.encodePacked(block.timestamp, block.number, msg.sender))) % 2500)
      ) + 2500;
      int32 randomY = int32(
        int256(uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender))) % 2500)
      ) + 2500;
      Coord memory startingPosition = Coord(randomX, randomY);
      nameComponent.set(entity, name);
      energyComponent.set(entity, 100);
      resourceComponent.set(entity, 0);
      positionComponent.set(entity, startingPosition);
      agentComponent.set(entity);
      coolDownComponent.set(entity, 0);
    }
  }

  function executeTyped(uint256 entity, string memory name) public returns (bytes memory) {
    return execute(abi.encode(entity, name));
  }
}
