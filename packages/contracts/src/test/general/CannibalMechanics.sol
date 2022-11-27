// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import "../MudTest.t.sol";
import { entityType } from "../../constants.sol";
import { SpawnSystem, ID as SpawnSystemID } from "../../systems/SpawnSystem.sol";
import { PlaySystem, ID as PlaySystemID } from "../../systems/PlaySystem.sol";
import { GatherSystem, ID as GatherSystemID } from "../../systems/GatherSystem.sol";
import { PositionComponent, ID as PositionComponentID, Coord } from "../../components/PositionComponent.sol";
import { ResourceComponent, ID as ResourceComponentID } from "../../components/ResourceComponent.sol";
import { EntityTypeComponent, ID as EntityTypeComponentID } from "../../components/EntityTypeComponent.sol";
import { CannibalComponent, ID as CannibalComponentID } from "../../components/CannibalComponent.sol";

contract CannibalMechanicsTest is MudTest {
  function testExecute() public {
    uint256 alice = 1;
    uint256 bob = 2;

    // Initialize components
    ResourceComponent resourceComponent = ResourceComponent(getAddressById(components, ResourceComponentID));
    PositionComponent positionComponent = PositionComponent(getAddressById(components, PositionComponentID));
    EntityTypeComponent entityTypeComponent = EntityTypeComponent(getAddressById(components, EntityTypeComponentID));
    CannibalComponent cannibalComponent = CannibalComponent(getAddressById(components, CannibalComponentID));

    // Spawn Alice
    SpawnSystem(system(SpawnSystemID)).executeTyped(alice);

    // Spawn Bob
    SpawnSystem(system(SpawnSystemID)).executeTyped(bob);

    // Test depends on modified spawn function that sets starting position to (10,10)
    Coord memory alicePosition = positionComponent.getValue(alice);
    Coord memory bobPosition = positionComponent.getValue(bob);
    assertEq(bobPosition.x, alicePosition.x);
    assertEq(bobPosition.y, alicePosition.y);

    // Force Bob to play music until he dies
    PlaySystem(system(PlaySystemID)).executeTyped(bob, 1000);

    // Bob will be playing for 1000 * 2 blocks...
    vm.roll(2100);

    // Bob should be dead
    assertEq(entityTypeComponent.getValue(bob), uint32(entityType.Corpse));
    // ... and converted to 500 resources
    assertEq(resourceComponent.getValue(bob), 500);

    // Alice gathers Bob's corpse
    GatherSystem(system(GatherSystemID)).executeTyped(alice, 50);
    // Bob's resource balance should be 0
    assertEq(resourceComponent.getValue(bob), 0);
    // Alice's resource balance should be 200 + 500
    assertEq(resourceComponent.getValue(alice), 700);
    // Bob should be added to Alice's cannibal list
    assertEq(uint256(cannibalComponent.getValue(alice)[0]), bob);
  }
}
