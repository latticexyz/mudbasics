// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "solecs/System.sol";
import { IWorld } from "solecs/interfaces/IWorld.sol";
import { getAddressById, addressToEntity } from "solecs/utils.sol";
import { QueryFragment, LibQuery, QueryType } from "solecs/LibQuery.sol";

import { PositionComponent, ID as PositionComponentID, Coord } from "../components/PositionComponent.sol";
import { ResourceComponent, ID as ResourceComponentID } from "../components/ResourceComponent.sol";
import { EnergyComponent, ID as EnergyComponentID } from "../components/EnergyComponent.sol";
import { TerrainComponent, ID as TerrainComponentID } from "../components/TerrainComponent.sol";

uint256 constant ID = uint256(keccak256("system.Gather"));

contract GatherSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    uint256 entity = abi.decode(arguments, (uint256));

    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    ResourceComponent resourceComponent = ResourceComponent(getAddressById(components, ResourceComponentID));
    PositionComponent positionComponent = PositionComponent(getAddressById(components, PositionComponentID));
    TerrainComponent terrainComponent = TerrainComponent(getAddressById(components, TerrainComponentID));

    int32 currentEnergyLevel = energyComponent.getValue(entity);
    int32 currentResourceBalance = resourceComponent.getValue(entity);
    Coord memory currentEntityPosition = positionComponent.getValue(entity);

    if (currentEnergyLevel > 2) {
      // Check if there is a terrain component in this location
      QueryFragment[] memory fragments = new QueryFragment[](2);
      fragments[0] = QueryFragment(QueryType.HasValue, positionComponent, abi.encode(currentEntityPosition));
      fragments[1] = QueryFragment(QueryType.Has, terrainComponent, new bytes(0));
      uint256[] memory entities = LibQuery.query(fragments);

      if (entities.length == 0) {
        resourceComponent.set(entity, currentResourceBalance + 5);
        energyComponent.set(entity, currentEnergyLevel - 2);

        // Create new empty terraion component
        uint256 newTerrainEntity = world.getUniqueEntityId();
        positionComponent.set(newTerrainEntity, currentEntityPosition);
        terrainComponent.set(newTerrainEntity);
      }
    }
  }

  function executeTyped(uint256 entity) public returns (bytes memory) {
    return execute(abi.encode(entity));
  }
}
