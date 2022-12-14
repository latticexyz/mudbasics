// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import "../MudTest.t.sol";
import { EntityType } from "../../types.sol";
import { INITIAL_ENERGY, INITIAL_RESOURCE } from "../../config.sol";
import { SpawnSystem, ID as SpawnSystemID } from "../../systems/SpawnSystem.sol";
import { PlaySystem, ID as PlaySystemID } from "../../systems/PlaySystem.sol";
import { GatherSystem, ID as GatherSystemID } from "../../systems/GatherSystem.sol";
import { PositionComponent, ID as PositionComponentID, Coord } from "../../components/PositionComponent.sol";
import { ResourceComponent, ID as ResourceComponentID } from "../../components/ResourceComponent.sol";
import { EntityTypeComponent, ID as EntityTypeComponentID } from "../../components/EntityTypeComponent.sol";
import { CannibalComponent, ID as CannibalComponentID } from "../../components/CannibalComponent.sol";
import { EnergyComponent, ID as EnergyComponentID } from "../../components/EnergyComponent.sol";

contract CannibalMechanicsTest is MudTest {
  function testExecute() public {
    uint256 alice = 1;
    uint256 bob = 2;

    // Initialize components
    ResourceComponent resourceComponent = ResourceComponent(getAddressById(components, ResourceComponentID));
    PositionComponent positionComponent = PositionComponent(getAddressById(components, PositionComponentID));
    EntityTypeComponent entityTypeComponent = EntityTypeComponent(getAddressById(components, EntityTypeComponentID));
    CannibalComponent cannibalComponent = CannibalComponent(getAddressById(components, CannibalComponentID));
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));

    // Spawn Alice
    SpawnSystem(system(SpawnSystemID)).executeTyped(alice);

    // Spawn Bob
    SpawnSystem(system(SpawnSystemID)).executeTyped(bob);

    // Test depends on modified spawn function that sets starting position to (10,10)
    Coord memory alicePosition = positionComponent.getValue(alice);
    Coord memory bobPosition = positionComponent.getValue(bob);
    assertEq(bobPosition.x, alicePosition.x);
    assertEq(bobPosition.y, alicePosition.y);

    // Get bob some resources
    GatherSystem(system(GatherSystemID)).executeTyped(bob, 50);
    uint32 bobsResourceBalance = resourceComponent.getValue(bob);

    // ...
    vm.roll(20);

    // Force Bob to play music until he dies
    PlaySystem(system(PlaySystemID)).executeTyped(bob, energyComponent.getValue(bob));

    // ...
    vm.roll(2000);

    // Bob should be dead
    assertEq(entityTypeComponent.getValue(bob), uint32(EntityType.Corpse));

    // Alice gathers Bob's corpse
    GatherSystem(system(GatherSystemID)).executeTyped(alice, 50);
    // Bob's resource balance should be 0
    assertEq(resourceComponent.getValue(bob), 0);
    // Alice's resource balance should be INITIAL_RESOURCE + Bob's resources
    assertEq(resourceComponent.getValue(alice), INITIAL_RESOURCE + bobsResourceBalance);
    // Bob should be added to Alice's cannibal list
    assertEq(uint256(cannibalComponent.getValue(alice)[0]), bob);
  }
}
