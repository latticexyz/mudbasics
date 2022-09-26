// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import "../MudTest.t.sol";
import { MoveSystem, ID as MoveSystemID } from "../../systems/MoveSystem.sol";
import { PositionComponent, ID as PositionComponentID, Coord } from "../../components/PositionComponent.sol";

contract MoveSystemTest is MudTest {
  function testExecute() public {
    uint256 entity = 1;
    Coord memory coord = Coord(12, 34);
    MoveSystem(system(MoveSystemID)).executeTyped(entity, coord);
    PositionComponent positionComponent = PositionComponent(component(PositionComponentID));
    Coord memory position = positionComponent.getValue(entity);
    assertEq(position.x, coord.x);
    assertEq(position.y, coord.y);
  }
}
