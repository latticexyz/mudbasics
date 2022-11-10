// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import "../MudTest.t.sol";
import { console } from "forge-std/console.sol";
import { Cheats } from "../utils/Cheats.sol";
import { SpawnSystem, ID as SpawnSystemID } from "../../systems/SpawnSystem.sol";
import { GatherSystem, ID as GatherSystemID } from "../../systems/GatherSystem.sol";
import { ResourceComponent, ID as ResourceComponentID } from "../../components/ResourceComponent.sol";
import { EnergySystem, ID as EnergySystemID } from "../../systems/EnergySystem.sol";
import { EnergyComponent, ID as EnergyComponentID } from "../../components/EnergyComponent.sol";

contract EnergySystemTest is MudTest {
  function testExecute() public {
    uint256 entity = 1;

    // Initialize components
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    ResourceComponent resourceComponent = ResourceComponent(getAddressById(components, ResourceComponentID));

    SpawnSystem(system(SpawnSystemID)).executeTyped(entity, "tester");

    GatherSystem(system(GatherSystemID)).executeTyped(entity, 5);

    assertEq(resourceComponent.getValue(entity), 5);
    assertEq(energyComponent.getValue(entity), 95);

    console.log(block.number);

    vm.roll(666);

    console.log(block.number);

    EnergySystem(system(EnergySystemID)).executeTyped(entity, 5);

    assertEq(resourceComponent.getValue(entity), 0);
    assertEq(energyComponent.getValue(entity), 100);
  }
}
