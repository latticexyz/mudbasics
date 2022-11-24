import { createWorld } from "@latticexyz/recs";
import { setupDevSystems } from "./setup";
import {
  createActionSystem,
  setupMUDNetwork,
  defineCoordComponent,
  defineNumberComponent,
  defineStringComponent,
} from "@latticexyz/std-client";
import { defineLoadingStateComponent, defineStatsComponent } from "./components";
import { SystemTypes } from "contracts/types/SystemTypes";
import { SystemAbis } from "contracts/types/SystemAbis.mjs";
import { GameConfig, getNetworkConfig } from "./config";
import { BigNumber } from "ethers";

/**
 * The Network layer is the lowest layer in the client architecture.
 * Its purpose is to synchronize the client components with the contract components.
 */
export async function createNetworkLayer(config: GameConfig) {
  console.log("Network config", config);

  // --- WORLD ----------------------------------------------------------------------
  const world = createWorld();

  // --- COMPONENTS -----------------------------------------------------------------
  const components = {
    LoadingState: defineLoadingStateComponent(world),
    Position: defineCoordComponent(world, { id: "Position", metadata: { contractId: "component.Position" } }),
    Energy: defineNumberComponent(world, { id: "Energy", metadata: { contractId: "component.Energy" } }),
    Resource: defineNumberComponent(world, { id: "Resource", metadata: { contractId: "component.Resource" } }),
    Name: defineStringComponent(world, { id: "Name", metadata: { contractId: "component.Name" } }),
    CoolDown: defineNumberComponent(world, { id: "CoolDown", metadata: { contractId: "component.CoolDown" } }),
    Seed: defineNumberComponent(world, { id: "Seed", metadata: { contractId: "component.Seed" } }),
    EntityType: defineNumberComponent(world, { id: "EntityType", metadata: { contractId: "component.EntityType" } }),
    Creator: defineNumberComponent(world, { id: "Creator", metadata: { contractId: "component.Creator" } }),
    Stats: defineStatsComponent(world),
  };

  // --- SETUP ----------------------------------------------------------------------
  const { txQueue, systems, txReduced$, network, startSync, encoders } = await setupMUDNetwork<
    typeof components,
    SystemTypes
  >(getNetworkConfig(config), world, components, SystemAbis);

  // --- ACTION SYSTEM --------------------------------------------------------------
  const actions = createActionSystem(world, txReduced$);

  // --- API ------------------------------------------------------------------------
  function spawn() {
    systems["system.Spawn"].executeTyped(BigNumber.from(network.connectedAddress.get()));
  }

  function move(energyInput: number, direction: number) {
    systems["system.Move"].executeTyped(BigNumber.from(network.connectedAddress.get()), energyInput, direction);
  }

  function gather(energyInput: number) {
    systems["system.Gather"].executeTyped(BigNumber.from(network.connectedAddress.get()), energyInput);
  }

  function consume(resourceInput: number) {
    systems["system.Energy"].executeTyped(BigNumber.from(network.connectedAddress.get()), resourceInput);
  }

  function burn(resourceInput: number) {
    systems["system.Fire"].executeTyped(BigNumber.from(network.connectedAddress.get()), resourceInput);
  }

  // --- CONTEXT --------------------------------------------------------------------
  const context = {
    world,
    components,
    txQueue,
    systems,
    txReduced$,
    startSync,
    network,
    actions,
    api: { spawn, move, gather, consume, burn },
    dev: setupDevSystems(world, encoders, systems),
  };

  return context;
}
