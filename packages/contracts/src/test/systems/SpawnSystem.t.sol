// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import "../MudTest.t.sol";
import { console } from "forge-std/console.sol";
import { WORLD_HEIGHT, WORLD_WIDTH, entityType } from "../../constants.sol";
import { SpawnSystem, ID as SpawnSystemID } from "../../systems/SpawnSystem.sol";
import { SeedComponent, ID as SeedComponentID } from "../../components/SeedComponent.sol";
import { EnergyComponent, ID as EnergyComponentID } from "../../components/EnergyComponent.sol";
import { PositionComponent, ID as PositionComponentID, Coord } from "../../components/PositionComponent.sol";
import { ResourceComponent, ID as ResourceComponentID } from "../../components/ResourceComponent.sol";
import { CoolDownComponent, ID as CoolDownComponentID } from "../../components/CoolDownComponent.sol";
import { EntityTypeComponent, ID as EntityTypeComponentID } from "../../components/EntityTypeComponent.sol";
import { StatsComponent, ID as StatsComponentID, Stats } from "../../components/StatsComponent.sol";

contract SpawnSystemTest is MudTest {
  function testExecute() public {
    uint256 entity = 1;

    // Initialize components
    SeedComponent seedComponent = SeedComponent(component(SeedComponentID));
    EnergyComponent energyComponent = EnergyComponent(component(EnergyComponentID));
    PositionComponent positionComponent = PositionComponent(component(PositionComponentID));
    ResourceComponent resourceComponent = ResourceComponent(getAddressById(components, ResourceComponentID));
    EntityTypeComponent entityTypeComponent = EntityTypeComponent(getAddressById(components, EntityTypeComponentID));
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));
    StatsComponent statsComponent = StatsComponent(getAddressById(components, StatsComponentID));

    // Spawn player
    SpawnSystem(system(SpawnSystemID)).executeTyped(entity);

    // --- Seed
    int32 seed = seedComponent.getValue(entity);
    console.logInt(seed);

    // --- Energy
    int32 initialEnergy = energyComponent.getValue(entity);
    assertEq(initialEnergy, 1000);

    // --- Position
    Coord memory newPosition = positionComponent.getValue(entity);
    // X between 0 and WORLD_WIDTH
    console.logInt(newPosition.x);
    assertGt(newPosition.x, 0);
    assertLt(newPosition.x, WORLD_WIDTH);
    // Y between 0 and WORLD_HEIGHT
    console.logInt(newPosition.y);
    assertGt(newPosition.y, 0);
    assertLt(newPosition.y, WORLD_HEIGHT);

    // --- Resource
    int32 initialResourceBalance = resourceComponent.getValue(entity);
    assertEq(initialResourceBalance, 200);

    // --- Player entity type
    assertEq(entityTypeComponent.getValue(entity), uint32(entityType.Player));

    // --- Cooldown
    int32 initialCoolDownBlock = coolDownComponent.getValue(entity);
    assertEq(initialCoolDownBlock, 0);

    // --- Stats
    Stats memory initialStats = statsComponent.getValue(entity);
    assertEq(initialStats.traveled, 0);
    assertEq(initialStats.gathered, 0);
    assertEq(initialStats.burnt, 0);
    assertEq(initialStats.eaten, 0);
  }
}
