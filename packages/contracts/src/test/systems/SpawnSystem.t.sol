// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import "../MudTest.t.sol";
import { SpawnSystem, ID as SpawnSystemID } from "../../systems/SpawnSystem.sol";
import { NameComponent, ID as NameComponentID } from "../../components/NameComponent.sol";
import { EnergyComponent, ID as EnergyComponentID } from "../../components/EnergyComponent.sol";
import { PositionComponent, ID as PositionComponentID, Coord } from "../../components/PositionComponent.sol";
import { ResourceComponent, ID as ResourceComponentID } from "../../components/ResourceComponent.sol";
import { AgentComponent, ID as AgentComponentID } from "../../components/AgentComponent.sol";

contract SpawnSystemTest is MudTest {
  function testExecute() public {
    uint256 entity = 1;
    SpawnSystem(system(SpawnSystemID)).executeTyped(entity, "Rasmus");
    // --- Name
    NameComponent nameComponent = NameComponent(component(NameComponentID));
    string memory name = nameComponent.getValue(entity);
    assertEq(name, "Rasmus");
    // --- Energy
    EnergyComponent energyComponent = EnergyComponent(component(EnergyComponentID));
    int32 initialEnergy = energyComponent.getValue(entity);
    assertEq(initialEnergy, 100);
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
  }
}