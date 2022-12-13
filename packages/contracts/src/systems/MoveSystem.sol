// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../constants.sol";
import { entityType } from "../constants.sol";

import { PositionComponent, ID as PositionComponentID, Coord } from "../components/PositionComponent.sol";
import { EnergyComponent, ID as EnergyComponentID } from "../components/EnergyComponent.sol";
import { CoolDownComponent, ID as CoolDownComponentID } from "../components/CoolDownComponent.sol";
import { StatsComponent, ID as StatsComponentID, Stats } from "../components/StatsComponent.sol";
import { EntityTypeComponent, ID as EntityTypeComponentID } from "../components/EntityTypeComponent.sol";

uint256 constant ID = uint256(keccak256("system.Move"));
int32 constant MAX_DISTANCE = 5;

contract MoveSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function updateStats(uint256 entity, int32 steps) private {
    StatsComponent statsComponent = StatsComponent(getAddressById(components, StatsComponentID));
    Stats memory currentStats = statsComponent.getValue(entity);
    currentStats.traveled += uint32(steps);
    statsComponent.set(entity, currentStats);
  }

  function execute(bytes memory arguments) public returns (bytes memory) {
    (uint256 entity, uint32 energyInput, uint32 direction) = abi.decode(arguments, (uint256, uint32, uint32));

    // Initialize components
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    PositionComponent positionComponent = PositionComponent(getAddressById(components, PositionComponentID));
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));
    EntityTypeComponent entityTypeComponent = EntityTypeComponent(getAddressById(components, EntityTypeComponentID));

    // Require entity to be player
    require(entityTypeComponent.getValue(entity) == uint32(entityType.Player), "only (a living) player can move.");

    // Require cooldown period to be over
    require(coolDownComponent.getValue(entity) < block.number, "in cooldown period");

    // Require the player to have enough energy
    uint32 currentEnergyLevel = energyComponent.getValue(entity);
    require(currentEnergyLevel >= energyInput, "not enough energy");

    // 10 energy => 1 step, capped at MAX_DISTANCE
    int32 steps = int32(energyInput) / 10;
    if (steps > MAX_DISTANCE) steps = MAX_DISTANCE;

    Coord memory currentPosition = positionComponent.getValue(entity);
    Coord memory newPosition = Coord(currentPosition.x, currentPosition.y);

    //  | 8 | 1 | 2 |
    //  | 7 | X | 3 |
    //  | 6 | 5 | 4 |

    if (direction == 1) {
      // 1 => N
      if (newPosition.y > 0) newPosition.y -= steps;
    } else if (direction == 2) {
      // 2 => NE
      if (newPosition.y > 0) newPosition.y -= steps;
      if (newPosition.x < WORLD_WIDTH) newPosition.x += steps;
    } else if (direction == 3) {
      // 3 => E
      if (newPosition.x < WORLD_WIDTH) newPosition.x += steps;
    } else if (direction == 4) {
      // 4 => SE
      if (newPosition.y < WORLD_HEIGHT) newPosition.y += steps;
      if (newPosition.x < WORLD_WIDTH) newPosition.x += steps;
    } else if (direction == 5) {
      // 5 => S
      if (newPosition.y < WORLD_HEIGHT) newPosition.y += steps;
    } else if (direction == 6) {
      // 6 => SW
      if (newPosition.y < WORLD_HEIGHT) newPosition.y += steps;
      if (newPosition.x > 0) newPosition.x -= steps;
    } else if (direction == 7) {
      // 7 => W
      if (newPosition.x > 0) newPosition.x -= steps;
    } else if (direction == 8) {
      // 8 => NW
      if (newPosition.y > 0) newPosition.y -= steps;
      if (newPosition.x > 0) newPosition.x -= steps;
    }

    // Update values of player
    positionComponent.set(entity, newPosition);
    coolDownComponent.set(entity, block.number + 10);
    energyComponent.set(entity, currentEnergyLevel - energyInput);
    updateStats(entity, steps);

    // Check if dead
    if (energyComponent.getValue(entity) <= 0) {
      entityTypeComponent.set(entity, uint32(entityType.Corpse));
      coolDownComponent.set(entity, 0);
    }
  }

  function executeTyped(uint256 entity, uint32 energyInput, uint32 direction) public returns (bytes memory) {
    return execute(abi.encode(entity, energyInput, direction));
  }
}
