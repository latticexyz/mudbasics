import { createWorld } from "@latticexyz/recs";
import { setupDevSystems } from "./setup";
import {
  createActionSystem,
  setupMUDNetwork,
  defineCoordComponent,
  defineStringComponent,
} from "@latticexyz/std-client";
import { defineLoadingStateComponent } from "./components";
import { SystemTypes } from "contracts/types/SystemTypes";
import { SystemAbis } from "contracts/types/SystemAbis.mjs";
import { GameConfig, getNetworkConfig } from "./config";
import { BigNumber } from "ethers";
import { Coord } from "@latticexyz/utils";

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
    CarriedBy: defineStringComponent(world, { id: "CarriedBy", metadata: { contractId: "component.CarriedBy" } }),
    Name: defineStringComponent(world, { id: "Name", metadata: { contractId: "component.Name" } }),
    Authors: defineStringComponent(world, { id: "Authors", metadata: { contractId: "component.Authors" } }),
    SoundUri: defineStringComponent(world, { id: "SoundUri", metadata: { contractId: "component.SoundUri" } }),
  };

  // --- SETUP ----------------------------------------------------------------------
  const { txQueue, systems, txReduced$, network, startSync, encoders } = await setupMUDNetwork<
    typeof components,
    SystemTypes
  >(getNetworkConfig(config), world, components, SystemAbis);

  // --- ACTION SYSTEM --------------------------------------------------------------
  const actions = createActionSystem(world, txReduced$);

  // --- API ------------------------------------------------------------------------
  function move(coord: Coord) {
    systems["system.Move"].executeTyped(BigNumber.from(network.connectedAddress.get()), coord);
  }

  function pickup(coord: Coord) {
    systems["system.Catch"].executeTyped(coord);
  }

  function uploadSound(soundUri: string) {
    systems["system.UploadSound"].executeTyped(BigNumber.from(network.connectedAddress.get()), soundUri);
  }

  function setName(name: string) {
    systems["system.SetName"].executeTyped(BigNumber.from(network.connectedAddress.get()), name);
  }

  function setAuthors(authors: string) {
    systems["system.SetAuthors"].executeTyped(BigNumber.from(network.connectedAddress.get()), authors);
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
    api: { move, pickup, uploadSound, setName, setAuthors },
    dev: setupDevSystems(world, encoders, systems),
  };

  return context;
}
