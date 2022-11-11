import { defineComponentSystem } from "@latticexyz/recs";
import { NetworkLayer } from "../../network";
import { entities, indexToID } from "../stores/entities";

export function createNameSystem(network: NetworkLayer) {
  const {
    world,
    components: { Name },
  } = network;

  defineComponentSystem(world, Name, (update) => {
    // console.log("==> Name system: ", update);
    const name = update.value[0]?.value;
    entities.update((value) => {
      if (!value[indexToID(update.entity)]) value[indexToID(update.entity)] = {};
      value[indexToID(update.entity)].name = name;
      return value;
    });
  });
}
