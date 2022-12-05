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
import { BirthComponent, ID as BirthComponentID } from "../components/BirthComponent.sol";
import { CannibalComponent, ID as CannibalComponentID } from "../components/CannibalComponent.sol";

uint256 constant ID = uint256(keccak256("system.Spawn"));

contract SpawnSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function makeSeedValue() public view returns (int32) {
    int32 seed = int32(int256(uint256(keccak256(abi.encodePacked(msg.sender, block.timestamp, block.number)))));
    if (seed < 0) seed *= -1;
    return seed;
  }

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
    BirthComponent birthComponent = BirthComponent(getAddressById(components, BirthComponentID));
    CannibalComponent cannibalComponent = CannibalComponent(getAddressById(components, CannibalComponentID));

    // Require user to be un-spawned
    require(!birthComponent.has(entity), "already spawned");

    // --- Seed (Number used for naming the character etc...)
    seedComponent.set(entity, makeSeedValue());

    // --- Energy
    energyComponent.set(entity, 100);

    // --- Resource
    resourceComponent.set(entity, 80);

    // --- Entity type
    entityTypeComponent.set(entity, uint32(entityType.Player));

    // --- Cooldown
    coolDownComponent.set(entity, 0);

    // --- Birth block
    birthComponent.set(entity, int32(int256(block.number)));

    // --- Stats
    Stats memory initialStats;
    initialStats.traveled = 0;
    initialStats.gathered = 0;
    initialStats.burnt = 0;
    initialStats.eaten = 0;
    initialStats.played = 0;
    statsComponent.set(entity, initialStats);

    // --- Cannibal list
    uint256[] memory initialCannibalArray = new uint256[](0);
    cannibalComponent.set(entity, initialCannibalArray);

    // --- Position
    int32 randomX = int32(int256(uint256(keccak256(abi.encodePacked(block.timestamp, block.number, msg.sender)))) % 10);
    int32 randomY = int32(
      int256(uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender)))) % 10
    );

    // Make sure the values are positive
    if (randomX < 0) randomX *= -1;
    if (randomY < 0) randomY *= -1;

    randomX += 45;
    randomY += 45;

    positionComponent.set(entity, Coord(randomX, randomY));
  }

  function executeTyped(uint256 entity) public returns (bytes memory) {
    return execute(abi.encode(entity));
  }
}
