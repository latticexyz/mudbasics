import { defineComponentSystem } from "@latticexyz/recs";
import { NetworkLayer } from "../../network";
import { entities, indexToID } from "../stores/entities";

export function createSeedSystem(network: NetworkLayer) {
  const {
    world,
    components: { Seed },
  } = network;

  defineComponentSystem(world, Seed, (update) => {
    console.log("==> Seed system: ", update);
    const seed = update.value[0]?.value;
    entities.update((value) => {
      if (!value[indexToID(update.entity)]) value[indexToID(update.entity)] = {};
      value[indexToID(update.entity)].seed = seed;
      return value;
    });
  });
}
