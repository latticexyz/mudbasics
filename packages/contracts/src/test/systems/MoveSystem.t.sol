// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import "../MudTest.t.sol";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../../config.sol";
import { SpawnSystem, ID as SpawnSystemID } from "../../systems/SpawnSystem.sol";
import { MoveSystem, ID as MoveSystemID } from "../../systems/MoveSystem.sol";
import { PositionComponent, ID as PositionComponentID, Coord } from "../../components/PositionComponent.sol";
import { StatsComponent, ID as StatsComponentID, Stats } from "../../components/StatsComponent.sol";

contract MoveSystemTest is MudTest {
  function testExecute() public {
    uint256 entity = 1;

    // Initialize components
    PositionComponent positionComponent = PositionComponent(component(PositionComponentID));
    StatsComponent statsComponent = StatsComponent(getAddressById(components, StatsComponentID));

    // Spawn player
    SpawnSystem(system(SpawnSystemID)).executeTyped(entity);

    // Check that stats are initialized
    assertEq(statsComponent.getValue(entity).traveled, 0);

    Coord memory initialPosition = positionComponent.getValue(entity);

    // X between 0 and WORLD_WIDTH
    assertGt(initialPosition.x, 0);
    assertLt(initialPosition.x, WORLD_WIDTH);

    // Y between 0 and WORLD_HEIGHT
    assertGt(initialPosition.y, 0);
    assertLt(initialPosition.y, WORLD_HEIGHT);

    // Move 2 step to the east
    MoveSystem(system(MoveSystemID)).executeTyped(entity, 20, 3);
    Coord memory newPosition = positionComponent.getValue(entity);
    assertEq(newPosition.x, initialPosition.x + 2);
    assertEq(statsComponent.getValue(entity).traveled, 2);
  }
}
