import { createWorld } from "@latticexyz/recs";
import { setupDevSystems } from "./setup";
import {
  createActionSystem,
  setupMUDNetwork,
  defineCoordComponent,
  defineNumberComponent,
  defineBoolComponent,
  defineStringComponent,
} from "@latticexyz/std-client";
import { defineLoadingStateComponent } from "./components";
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
    Agent: defineBoolComponent(world, { id: "Agent", metadata: { contractId: "component.Agent" } }),
    Terrain: defineBoolComponent(world, { id: "Terrain", metadata: { contractId: "component.Terrain" } }),
    Name: defineStringComponent(world, { id: "Name", metadata: { contractId: "component.Name" } }),
  };

  // --- SETUP ----------------------------------------------------------------------
  const { txQueue, systems, txReduced$, network, startSync, encoders } = await setupMUDNetwork<
    typeof components,
    SystemTypes
  >(getNetworkConfig(config), world, components, SystemAbis);

  // --- ACTION SYSTEM --------------------------------------------------------------
  const actions = createActionSystem(world, txReduced$);

  // --- API ------------------------------------------------------------------------
  function move() {
    systems["system.Move"].executeTyped(BigNumber.from(network.connectedAddress.get()));
  }

  function eat() {
    systems["system.Energy"].executeTyped(BigNumber.from(network.connectedAddress.get()));
  }

  function spawn(name: string) {
    console.log("===> name", name);
    systems["system.Spawn"].executeTyped(BigNumber.from(network.connectedAddress.get()), name);
  }

  function gather() {
    systems["system.Gather"].executeTyped(BigNumber.from(network.connectedAddress.get()));
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
    api: { move, eat, spawn, gather },
    dev: setupDevSystems(world, encoders, systems),
  };

  return context;
}
