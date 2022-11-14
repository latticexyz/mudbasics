// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import "../MudTest.t.sol";
import { console } from "forge-std/console.sol";
import { SpawnSystem, ID as SpawnSystemID } from "../../systems/SpawnSystem.sol";
import { SeedComponent, ID as SeedComponentID } from "../../components/SeedComponent.sol";
import { EnergyComponent, ID as EnergyComponentID } from "../../components/EnergyComponent.sol";
import { PositionComponent, ID as PositionComponentID, Coord } from "../../components/PositionComponent.sol";
import { ResourceComponent, ID as ResourceComponentID } from "../../components/ResourceComponent.sol";
import { AgentComponent, ID as AgentComponentID } from "../../components/AgentComponent.sol";
import { CoolDownComponent, ID as CoolDownComponentID } from "../../components/CoolDownComponent.sol";

contract SpawnSystemTest is MudTest {
  function testExecute() public {
    uint256 entity = 1;
    SpawnSystem(system(SpawnSystemID)).executeTyped(entity);
    // --- Seed
    SeedComponent seedComponent = SeedComponent(component(SeedComponentID));
    int32 seed = seedComponent.getValue(entity);
    console.logInt(seed);
    assertEq(seed, 1747333387);
    // --- Energy
    EnergyComponent energyComponent = EnergyComponent(component(EnergyComponentID));
    int32 initialEnergy = energyComponent.getValue(entity);
    assertEq(initialEnergy, 1000);
    // --- Position
    PositionComponent positionComponent = PositionComponent(component(PositionComponentID));
    Coord memory newPosition = positionComponent.getValue(entity);
    // X between 1 and 30
    assertGt(newPosition.x, 2500);
    assertLt(newPosition.x, 5000);
    // Y between 1 and 30
    assertGt(newPosition.y, 2500);
    assertLt(newPosition.y, 5000);
    // --- Resource
    ResourceComponent resourceComponent = ResourceComponent(getAddressById(components, ResourceComponentID));
    int32 initialResourceBalance = resourceComponent.getValue(entity);
    assertEq(initialResourceBalance, 0);
    // --- Agent
    AgentComponent agentComponent = AgentComponent(getAddressById(components, AgentComponentID));
    bool isAgent = agentComponent.getValue(entity);
    assertTrue(isAgent);
    // --- Cooldown
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));
    int32 initialCoolDownBlock = coolDownComponent.getValue(entity);
    assertEq(initialCoolDownBlock, 0);
  }
}
