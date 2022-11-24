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
import { StatsComponent, ID as StatsComponentID, Stats } from "../../components/StatsComponent.sol";

contract EnergySystemTest is MudTest {
  function testExecute() public {
    uint256 entity = 1;

    // Initialize components
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    ResourceComponent resourceComponent = ResourceComponent(getAddressById(components, ResourceComponentID));
    StatsComponent statsComponent = StatsComponent(getAddressById(components, StatsComponentID));

    // Spawn player
    SpawnSystem(system(SpawnSystemID)).executeTyped(entity);

    // Convert 50 resource => 250 energy
    EnergySystem(system(EnergySystemID)).executeTyped(entity, 50);
    // 200 - 50
    assertEq(resourceComponent.getValue(entity), 150);
    // 1000 + 250
    assertEq(energyComponent.getValue(entity), 1250);
    // Check stats are updated
    assertEq(statsComponent.getValue(entity).eaten, 50);
  }
}
