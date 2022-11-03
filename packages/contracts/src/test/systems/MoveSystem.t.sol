// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import "../MudTest.t.sol";
import { SpawnSystem, ID as SpawnSystemID } from "../../systems/SpawnSystem.sol";
import { MoveSystem, ID as MoveSystemID } from "../../systems/MoveSystem.sol";
import { PositionComponent, ID as PositionComponentID, Coord } from "../../components/PositionComponent.sol";

contract MoveSystemTest is MudTest {
  function testExecute() public {
    uint256 entity = 1;
    SpawnSystem(system(SpawnSystemID)).executeTyped(entity);
    PositionComponent positionComponent = PositionComponent(component(PositionComponentID));
    Coord memory initialPosition = positionComponent.getValue(entity);
    MoveSystem(system(MoveSystemID)).executeTyped(entity);
    Coord memory newPosition = positionComponent.getValue(entity);
    assertEq(newPosition.x, initialPosition.x + 1);
    assertEq(newPosition.y, initialPosition.y + 1);
  }
}
