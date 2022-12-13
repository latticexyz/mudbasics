// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import "../MudTest.t.sol";
import { EntityType } from "../../types.sol";
import { QueryFragment, LibQuery, QueryType } from "solecs/LibQuery.sol";
import { SpawnSystem, ID as SpawnSystemID } from "../../systems/SpawnSystem.sol";
import { FireSystem, ID as FireSystemID } from "../../systems/FireSystem.sol";
import { PositionComponent, ID as PositionComponentID, Coord } from "../../components/PositionComponent.sol";
import { ResourceComponent, ID as ResourceComponentID } from "../../components/ResourceComponent.sol";
import { EnergyComponent, ID as EnergyComponentID } from "../../components/EnergyComponent.sol";
import { EntityTypeComponent, ID as EntityTypeComponentID } from "../../components/EntityTypeComponent.sol";
import { CreatorComponent, ID as CreatorComponentID } from "../../components/CreatorComponent.sol";
import { CoolDownComponent, ID as CoolDownComponentID } from "../../components/CoolDownComponent.sol";
import { StatsComponent, ID as StatsComponentID, Stats } from "../../components/StatsComponent.sol";
import { ComponentDevSystem, ID as ComponentDevSystemID } from "../../systems/ComponentDevSystem.sol";

contract FireSystemTest is MudTest {
  function testExecute() public {
    uint256 entity = 42;

    // Initialize components
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    ResourceComponent resourceComponent = ResourceComponent(getAddressById(components, ResourceComponentID));
    PositionComponent positionComponent = PositionComponent(getAddressById(components, PositionComponentID));
    EntityTypeComponent entityTypeComponent = EntityTypeComponent(getAddressById(components, EntityTypeComponentID));
    CreatorComponent creatorComponent = CreatorComponent(getAddressById(components, CreatorComponentID));
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));
    StatsComponent statsComponent = StatsComponent(getAddressById(components, StatsComponentID));

    // Spawn player
    SpawnSystem(system(SpawnSystemID)).executeTyped(entity);

    // Give player 1000 resources
    ComponentDevSystem(system(ComponentDevSystemID)).executeTyped(
      ResourceComponentID,
      entity,
      abi.encodePacked(uint32(1000))
    );

    // Create fire
    FireSystem(system(FireSystemID)).executeTyped(entity, 500);
    // 200 - 100
    assertEq(resourceComponent.getValue(entity), 100);
    // 1000 - 50
    assertEq(energyComponent.getValue(entity), 950);

    // Check for fire component in current location
    Coord memory currentPosition = positionComponent.getValue(entity);
    QueryFragment[] memory fragments = new QueryFragment[](2);
    fragments[0] = QueryFragment(QueryType.HasValue, positionComponent, abi.encode(currentPosition));
    fragments[1] = QueryFragment(QueryType.HasValue, entityTypeComponent, abi.encode(EntityType.Fire));
    uint256[] memory entitiesAtPosition = LibQuery.query(fragments);
    assertEq(entitiesAtPosition.length, 1);
    // Cooldown on fire component should be blocknumber + (resources added * 10):
    // 1 + 1000 = 1001
    assertEq(coolDownComponent.getValue(entitiesAtPosition[0]), 1001);
    // 100 resources have been burnt
    assertEq(resourceComponent.getValue(entitiesAtPosition[0]), 100);
    // Creator should be set
    assertEq(uint256(creatorComponent.getValue(entitiesAtPosition[0])[0]), entity);
    // Check stats are updated
    assertEq(statsComponent.getValue(entity).burnt, 100);

    // Fast forward past player cool down block
    vm.roll(66);

    // 66 block later...
    // Add to the existing fire
    FireSystem(system(FireSystemID)).executeTyped(entity, 500);
    // 100 - 100
    assertEq(resourceComponent.getValue(entity), 0);
    // 950 - 50
    assertEq(energyComponent.getValue(entity), 900);
    // Cooldown on fire component should be cooldownblock + (resources added * 10):
    // 1001 + 1000 = 2001
    assertEq(coolDownComponent.getValue(entitiesAtPosition[0]), 2001);
    // 200 resources have been burnt
    assertEq(resourceComponent.getValue(entitiesAtPosition[0]), 200);
    // Creator should be set
    assertEq(int256(creatorComponent.getValue(entitiesAtPosition[0]).length), 2);
    // Check stats are updated
    assertEq(statsComponent.getValue(entity).burnt, 200);
  }
}
