// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import "../MudTest.t.sol";
import { WORLD_HEIGHT, WORLD_WIDTH } from "../../constants.sol";
import { SpawnSystem, ID as SpawnSystemID } from "../../systems/SpawnSystem.sol";
import { MoveSystem, ID as MoveSystemID } from "../../systems/MoveSystem.sol";
import { PositionComponent, ID as PositionComponentID, Coord } from "../../components/PositionComponent.sol";

contract MoveSystemTest is MudTest {
  function testExecute() public {
    uint256 entity = 1;
    SpawnSystem(system(SpawnSystemID)).executeTyped(entity);
    PositionComponent positionComponent = PositionComponent(component(PositionComponentID));
    MoveSystem(system(MoveSystemID)).executeTyped(entity, 3);
    Coord memory newPosition = positionComponent.getValue(entity);
    // X between 0 and WORLD_WIDTH
    assertGt(newPosition.x, 0);
    assertLt(newPosition.x, WORLD_WIDTH);
    // Y between 0 and WORLD_HEIGHT
    assertGt(newPosition.y, 0);
    assertLt(newPosition.y, WORLD_HEIGHT);
  }
}
