// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import "../MudTest.t.sol";
import { EnergySystem, ID as EnergySystemID } from "../../systems/EnergySystem.sol";
import { EnergyComponent, ID as EnergyComponentID } from "../../components/EnergyComponent.sol";

contract EnergySystemTest is MudTest {
  function testExecute() public {
    uint256 entity = 1;

    EnergyComponent energyComponent = EnergyComponent(component(EnergyComponentID));

    // Increment by 1
    EnergySystem(system(EnergySystemID)).executeTyped(entity);

    int32 newEnergy = energyComponent.getValue(entity);

    assertEq(newEnergy, 101);
  }
}
