import { defineComponentSystem } from "@latticexyz/recs";
import { NetworkLayer } from "../../network";
import { entities, indexToID } from "../stores/entities";

export function createEnergySystem(network: NetworkLayer) {
  const {
    world,
    components: { Energy },
  } = network;

  defineComponentSystem(world, Energy, (update) => {
    // console.log("==> Energy system: ", update);
    const energy = update.value[0]?.value;
    entities.update((value) => {
      if (!value[indexToID(update.entity)]) value[indexToID(update.entity)] = {};
      value[indexToID(update.entity)].energy = energy;
      return value;
    });
  });
}
