// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.0;

import "../MudTest.t.sol";
import { entityType } from "../../constants.sol";
import { QueryFragment, LibQuery, QueryType } from "solecs/LibQuery.sol";
import { SpawnSystem, ID as SpawnSystemID } from "../../systems/SpawnSystem.sol";
import { GatherSystem, ID as GatherSystemID } from "../../systems/GatherSystem.sol";
import { PositionComponent, ID as PositionComponentID, Coord } from "../../components/PositionComponent.sol";
import { ResourceComponent, ID as ResourceComponentID } from "../../components/ResourceComponent.sol";
import { EnergyComponent, ID as EnergyComponentID } from "../../components/EnergyComponent.sol";
import { EntityTypeComponent, ID as EntityTypeComponentID } from "../../components/EntityTypeComponent.sol";

contract GatherSystemTest is MudTest {
  function testExecute() public {
    uint256 entity = 1;

    // Initialize components
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    ResourceComponent resourceComponent = ResourceComponent(getAddressById(components, ResourceComponentID));
    PositionComponent positionComponent = PositionComponent(getAddressById(components, PositionComponentID));
    EntityTypeComponent entityTypeComponent = EntityTypeComponent(getAddressById(components, EntityTypeComponentID));

    // Spawn player
    SpawnSystem(system(SpawnSystemID)).executeTyped(entity);

    // Convert 50 energy => resource
    GatherSystem(system(GatherSystemID)).executeTyped(entity, 50);
    // 0 + 5
    assertEq(resourceComponent.getValue(entity), 5);
    // 1000 - 50
    assertEq(energyComponent.getValue(entity), 950);

    // Check for terrain component in current location
    Coord memory currentPosition = positionComponent.getValue(entity);
    QueryFragment[] memory fragments = new QueryFragment[](2);
    fragments[0] = QueryFragment(QueryType.HasValue, positionComponent, abi.encode(currentPosition));
    fragments[1] = QueryFragment(QueryType.HasValue, entityTypeComponent, abi.encode(uint32(entityType.Terrain)));
    uint256[] memory entitiesAtPosition = LibQuery.query(fragments);
    assertEq(entitiesAtPosition.length, 1);
    // Terrain component should have 20 - 5 resources
    assertEq(resourceComponent.getValue(entitiesAtPosition[0]), 15);
  }
}
