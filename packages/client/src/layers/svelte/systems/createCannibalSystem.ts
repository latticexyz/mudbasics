import { defineComponentSystem } from "@latticexyz/recs";
import { NetworkLayer } from "../../network";
import { entities, indexToID } from "../stores/entities";

export function createCannibalSystem(network: NetworkLayer) {
  const {
    world,
    components: { Cannibal },
  } = network;

  defineComponentSystem(world, Cannibal, (update) => {
    console.log("==> Cannibal system: ", update);
    const cannibal: string[] = update.value[0]?.value;
    entities.update((value) => {
      if (!value[indexToID(update.entity)]) value[indexToID(update.entity)] = {};
      value[indexToID(update.entity)].cannibal = cannibal;
      return value;
    });
  });
}
