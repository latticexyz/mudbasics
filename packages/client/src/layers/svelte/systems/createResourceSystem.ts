import { defineComponentSystem } from "@latticexyz/recs";
import { NetworkLayer } from "../../network";
import { entities, indexToID } from "../stores/entities";

export function createResourceSystem(network: NetworkLayer) {
  const {
    world,
    components: { Resource },
  } = network;

  defineComponentSystem(world, Resource, (update) => {
    // console.log("==> Resource system: ", update);
    const resource = update.value[0]?.value;
    entities.update((value) => {
      if (!value[indexToID(update.entity)]) value[indexToID(update.entity)] = {};
      value[indexToID(update.entity)].resource = resource;
      return value;
    });
  });
}
