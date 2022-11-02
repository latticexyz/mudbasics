// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import "../MudTest.t.sol";
import { SpawnSystem, ID as SpawnSystemID } from "../../systems/SpawnSystem.sol";
import { PositionComponent, ID as PositionComponentID, Coord } from "../../components/PositionComponent.sol";

contract SpawnSystemTest is MudTest {
  function testExecute() public {
    uint256 entity = 1;
    SpawnSystem(system(SpawnSystemID)).executeTyped(entity);
    PositionComponent positionComponent = PositionComponent(component(PositionComponentID));
    Coord memory position = positionComponent.getValue(entity);
    assertEq(position.x, 10);
    assertEq(position.y, 10);
  }
}
