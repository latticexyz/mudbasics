// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { WORLD_HEIGHT, WORLD_WIDTH, entityType } from "../constants.sol";

import { PositionComponent, ID as PositionComponentID, Coord } from "../components/PositionComponent.sol";
import { EnergyComponent, ID as EnergyComponentID } from "../components/EnergyComponent.sol";
import { ResourceComponent, ID as ResourceComponentID } from "../components/ResourceComponent.sol";
import { EntityTypeComponent, ID as EntityTypeComponentID } from "../components/EntityTypeComponent.sol";
import { CoolDownComponent, ID as CoolDownComponentID } from "../components/CoolDownComponent.sol";
import { SeedComponent, ID as SeedComponentID } from "../components/SeedComponent.sol";
import { StatsComponent, ID as StatsComponentID, Stats } from "../components/StatsComponent.sol";

uint256 constant ID = uint256(keccak256("system.Spawn"));

contract SpawnSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    uint256 entity = abi.decode(arguments, (uint256));

    // Initialize components
    PositionComponent positionComponent = PositionComponent(getAddressById(components, PositionComponentID));
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    ResourceComponent resourceComponent = ResourceComponent(getAddressById(components, ResourceComponentID));
    EntityTypeComponent entityTypeComponent = EntityTypeComponent(getAddressById(components, EntityTypeComponentID));
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));
    SeedComponent seedComponent = SeedComponent(getAddressById(components, SeedComponentID));
    StatsComponent statsComponent = StatsComponent(getAddressById(components, StatsComponentID));

    // Require user to be un-spawned
    require(!positionComponent.has(entity), "already spawned");

    // Number used for naming the character etc...
    seedComponent.set(entity, int32(int256(uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))))));
    energyComponent.set(entity, 1000);
    resourceComponent.set(entity, 200);
    entityTypeComponent.set(entity, uint32(entityType.Player));
    coolDownComponent.set(entity, 0);
    Stats memory initialStats;
    initialStats.traveled = 0;
    initialStats.gathered = 0;
    initialStats.burnt = 0;
    initialStats.eaten = 0;
    statsComponent.set(entity, initialStats);

    int32 randomX = int32(
      int256(uint256(keccak256(abi.encodePacked(block.timestamp, block.number, msg.sender)))) % WORLD_WIDTH
    );
    int32 randomY = int32(
      int256(uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender)))) % WORLD_HEIGHT
    );

    // Make sure the values are positive
    if (randomX < 0) randomX *= -1;
    if (randomY < 0) randomY *= -1;

    Coord memory startingPosition = Coord(randomX, randomY);
    positionComponent.set(entity, startingPosition);
  }

  function executeTyped(uint256 entity) public returns (bytes memory) {
    return execute(abi.encode(entity));
  }
}
