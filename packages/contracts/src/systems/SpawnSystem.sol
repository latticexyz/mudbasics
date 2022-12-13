// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { EntityType } from "../types.sol";
import { WORLD_HEIGHT, WORLD_WIDTH, INITIAL_ENERGY, INITIAL_RESOURCE } from "../config.sol";

import { PositionComponent, ID as PositionComponentID, Coord } from "../components/PositionComponent.sol";
import { EnergyComponent, ID as EnergyComponentID } from "../components/EnergyComponent.sol";
import { ResourceComponent, ID as ResourceComponentID } from "../components/ResourceComponent.sol";
import { EntityTypeComponent, ID as EntityTypeComponentID } from "../components/EntityTypeComponent.sol";
import { CoolDownComponent, ID as CoolDownComponentID } from "../components/CoolDownComponent.sol";
import { SeedComponent, ID as SeedComponentID } from "../components/SeedComponent.sol";
import { StatsComponent, ID as StatsComponentID, Stats } from "../components/StatsComponent.sol";
import { BirthComponent, ID as BirthComponentID } from "../components/BirthComponent.sol";
import { DeathComponent, ID as DeathComponentID } from "../components/DeathComponent.sol";
import { CannibalComponent, ID as CannibalComponentID } from "../components/CannibalComponent.sol";

uint256 constant ID = uint256(keccak256("system.Spawn"));

contract SpawnSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function setSeedValue(uint256 entity) private {
    SeedComponent seedComponent = SeedComponent(getAddressById(components, SeedComponentID));
    seedComponent.set(entity, uint32(uint256(keccak256(abi.encodePacked(msg.sender, block.timestamp, block.number)))));
  }

  function setEnergy(uint256 entity) private {
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    energyComponent.set(entity, INITIAL_ENERGY);
  }

  function setResources(uint256 entity) private {
    ResourceComponent resourceComponent = ResourceComponent(getAddressById(components, ResourceComponentID));
    resourceComponent.set(entity, INITIAL_RESOURCE);
  }

  function setEntityType(uint256 entity) private {
    EntityTypeComponent entityTypeComponent = EntityTypeComponent(getAddressById(components, EntityTypeComponentID));
    entityTypeComponent.set(entity, uint32(EntityType.Player));
  }

  function setCoolDown(uint256 entity) private {
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));
    coolDownComponent.set(entity, 0);
  }

  function setBirth(uint256 entity) private {
    BirthComponent birthComponent = BirthComponent(getAddressById(components, BirthComponentID));
    birthComponent.set(entity, block.number);
  }

  function setDeath(uint256 entity) private {
    DeathComponent deathComponent = DeathComponent(getAddressById(components, DeathComponentID));
    deathComponent.set(entity, block.number + INITIAL_ENERGY);
  }

  function setStats(uint256 entity) private {
    StatsComponent statsComponent = StatsComponent(getAddressById(components, StatsComponentID));
    Stats memory initialStats;
    initialStats.traveled = 0;
    initialStats.gathered = 0;
    initialStats.burnt = 0;
    initialStats.eaten = 0;
    initialStats.played = 0;
    statsComponent.set(entity, initialStats);
  }

  function setCannibalList(uint256 entity) private {
    CannibalComponent cannibalComponent = CannibalComponent(getAddressById(components, CannibalComponentID));
    uint256[] memory initialCannibalArray = new uint256[](0);
    cannibalComponent.set(entity, initialCannibalArray);
  }

  function setPosition(uint256 entity) private {
    PositionComponent positionComponent = PositionComponent(getAddressById(components, PositionComponentID));
    int32 randomX = int32(int256(uint256(keccak256(abi.encodePacked(block.timestamp, block.number, msg.sender)))) % 10);
    int32 randomY = int32(
      int256(uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, msg.sender)))) % 10
    );
    // Make sure the values are positive
    if (randomX < 0) randomX *= -1;
    if (randomY < 0) randomY *= -1;
    randomX += 25;
    randomY += 25;
    positionComponent.set(entity, Coord(randomX, randomY));
  }

  function execute(bytes memory arguments) public returns (bytes memory) {
    uint256 entity = abi.decode(arguments, (uint256));

    // Require user to be un-spawned
    // require(!birthComponent.has(entity), "already spawned");

    setSeedValue(entity);
    setEnergy(entity);
    setResources(entity);
    setEntityType(entity);
    setCoolDown(entity);
    setBirth(entity);
    setDeath(entity);
    setStats(entity);
    setCannibalList(entity);
    setPosition(entity);
  }

  function executeTyped(uint256 entity) public returns (bytes memory) {
    return execute(abi.encode(entity));
  }
}
