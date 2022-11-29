import { blockNumber } from "../stores/network";
import { get } from "svelte/store";
import { narrative } from "../stores/narrative";
import { defineComponentSystem } from "@latticexyz/recs";
import { NetworkLayer } from "../../network";
import { entities, indexToID } from "../stores/entities";

export function createEnergySystem(network: NetworkLayer) {
  const {
    world,
    components: { Energy },
  } = network;

  defineComponentSystem(world, Energy, (update) => {
    console.log("==> Energy system: ", update);
    const oldEnergy = update.value[1]?.value;
    const energy = update.value[0]?.value;
    entities.update((value) => {
      if (!value[indexToID(update.entity)]) value[indexToID(update.entity)] = {};
      value[indexToID(update.entity)].energy = energy;
      return value;
    });

    if (energy > oldEnergy) {
      const logEntry = {
        id: self.crypto.randomUUID(),
        blockNumber: get(blockNumber),
        address: indexToID(update.entity),
        message: "is eating.",
      };
      narrative.update((value) => {
        return [logEntry, ...value];
      });
    }
  });
}
