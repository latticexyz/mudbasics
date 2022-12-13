// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import "../MudTest.t.sol";
import { EntityType } from "../../types.sol";
import { INITIAL_ENERGY } from "../../config.sol";
import { QueryFragment, LibQuery, QueryType } from "solecs/LibQuery.sol";
import { SpawnSystem, ID as SpawnSystemID } from "../../systems/SpawnSystem.sol";
import { PlaySystem, ID as PlaySystemID } from "../../systems/PlaySystem.sol";
import { EnergyComponent, ID as EnergyComponentID } from "../../components/EnergyComponent.sol";
import { CoolDownComponent, ID as CoolDownComponentID } from "../../components/CoolDownComponent.sol";
import { PlayingComponent, ID as PlayingComponentID } from "../../components/PlayingComponent.sol";

contract PlaySystemTest is MudTest {
  function testExecute() public {
    uint256 entity = 42;

    // Initialize components
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));
    PlayingComponent playingComponent = PlayingComponent(getAddressById(components, PlayingComponentID));

    // Spawn player
    SpawnSystem(system(SpawnSystemID)).executeTyped(entity);

    // Play
    PlaySystem(system(PlaySystemID)).executeTyped(entity, 50);
    // 100 - 50
    assertEq(energyComponent.getValue(entity), INITIAL_ENERGY - 50);
    // 1 + 10
    assertEq(coolDownComponent.getValue(entity), 21);
    // 1 + 20
    assertEq(playingComponent.getValue(entity), 21);
  }
}
