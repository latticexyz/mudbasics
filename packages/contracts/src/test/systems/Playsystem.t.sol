// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import "../MudTest.t.sol";
import { entityType } from "../../constants.sol";
import { QueryFragment, LibQuery, QueryType } from "solecs/LibQuery.sol";
import { SpawnSystem, ID as SpawnSystemID } from "../../systems/SpawnSystem.sol";
import { PlaySystem, ID as PlaySystemID } from "../../systems/PlaySystem.sol";
import { EnergyComponent, ID as EnergyComponentID } from "../../components/EnergyComponent.sol";
import { EntityTypeComponent, ID as EntityTypeComponentID } from "../../components/EntityTypeComponent.sol";
import { CoolDownComponent, ID as CoolDownComponentID } from "../../components/CoolDownComponent.sol";
import { PlayingComponent, ID as PlayingComponentID } from "../../components/PlayingComponent.sol";
import { StatsComponent, ID as StatsComponentID, Stats } from "../../components/StatsComponent.sol";

contract PlaySystemTest is MudTest {
  function testExecute() public {
    uint256 entity = 42;

    // Initialize components
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    EntityTypeComponent entityTypeComponent = EntityTypeComponent(getAddressById(components, EntityTypeComponentID));
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));
    StatsComponent statsComponent = StatsComponent(getAddressById(components, StatsComponentID));
    PlayingComponent playingComponent = PlayingComponent(getAddressById(components, PlayingComponentID));

    // Spawn player
    SpawnSystem(system(SpawnSystemID)).executeTyped(entity);

    // Play
    PlaySystem(system(PlaySystemID)).executeTyped(entity, 100);
    // 1000 - 100
    assertEq(energyComponent.getValue(entity), 900);
    // 1 + (100 * 2)
    assertEq(coolDownComponent.getValue(entity), 201);
    // 1 + (100 * 2)
    assertEq(playingComponent.getValue(entity), 201);
  }
}
