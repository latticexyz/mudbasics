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
import { CoolDownComponent, ID as CoolDownComponentID } from "../components/CoolDownComponent.sol";

uint256 constant ID = uint256(keccak256("system.Gather"));
int32 constant MAX_RESOURCE = 20;
int32 constant COOLDOWN_PER_RESOURCE = 3;

contract GatherSystem is System {
  constructor(IWorld _world, address _components) System(_world, _components) {}

  function execute(bytes memory arguments) public returns (bytes memory) {
    (uint256 entity, int32 energyInput) = abi.decode(arguments, (uint256, int32));

    // Initialize components
    EnergyComponent energyComponent = EnergyComponent(getAddressById(components, EnergyComponentID));
    ResourceComponent resourceComponent = ResourceComponent(getAddressById(components, ResourceComponentID));
    PositionComponent positionComponent = PositionComponent(getAddressById(components, PositionComponentID));
    TerrainComponent terrainComponent = TerrainComponent(getAddressById(components, TerrainComponentID));
    CoolDownComponent coolDownComponent = CoolDownComponent(getAddressById(components, CoolDownComponentID));

    // Require cooldown period to be over
    if (coolDownComponent.has(entity)) {
      require(coolDownComponent.getValue(entity) < int32(int256(block.number)), "in cooldown period");
    }

    // Require the player to have enough energy
    int32 currentEnergyLevel = energyComponent.getValue(entity);
    require(currentEnergyLevel >= energyInput, "not enough energy");

    int32 currentResourceBalance = resourceComponent.getValue(entity);
    Coord memory currentEntityPosition = positionComponent.getValue(entity);

    // 1 energy => 1 resource, capped at MAX_RESOURCE
    int32 resourceToExtract = energyInput;
    if (resourceToExtract > MAX_RESOURCE) resourceToExtract = MAX_RESOURCE;

    coolDownComponent.set(entity, int32(int256(block.number)) + (COOLDOWN_PER_RESOURCE * resourceToExtract));

    // Check for terrain component in current location
    QueryFragment[] memory fragments = new QueryFragment[](2);
    fragments[0] = QueryFragment(QueryType.HasValue, positionComponent, abi.encode(currentEntityPosition));
    fragments[1] = QueryFragment(QueryType.Has, terrainComponent, new bytes(0));
    uint256[] memory entitiesAtPosition = LibQuery.query(fragments);

    if (entitiesAtPosition.length == 0) {
      resourceComponent.set(entity, currentResourceBalance + resourceToExtract);
      energyComponent.set(entity, currentEnergyLevel - energyInput);

      // Create new terrain block
      uint256 newTerrainEntity = world.getUniqueEntityId();
      positionComponent.set(newTerrainEntity, currentEntityPosition);
      terrainComponent.set(newTerrainEntity);
      resourceComponent.set(newTerrainEntity, MAX_RESOURCE - resourceToExtract);
    } else {
      // If there is not enough resources, extract all there is
      int32 terrainResourceBalance = resourceComponent.getValue(entitiesAtPosition[0]);
      if (resourceToExtract > terrainResourceBalance) resourceToExtract = terrainResourceBalance;

      resourceComponent.set(entity, currentResourceBalance + resourceToExtract);
      energyComponent.set(entity, currentEnergyLevel - energyInput);

      resourceComponent.set(entitiesAtPosition[0], terrainResourceBalance - resourceToExtract);
    }
  }

  function executeTyped(uint256 entity, int32 energyInput) public returns (bytes memory) {
    return execute(abi.encode(entity, energyInput));
  }
}
