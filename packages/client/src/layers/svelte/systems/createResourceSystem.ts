import { defineComponentSystem } from "@latticexyz/recs";
import { NetworkLayer } from "../../network";
import { entities, indexToID } from "../stores/entities";
import { narrative } from "../stores/narrative";

export function createResourceSystem(network: NetworkLayer) {
  const {
    world,
    components: { Resource },
  } = network;

  defineComponentSystem(world, Resource, (update) => {
    // console.log("==> Resource system: ", update);
    const oldResource = update.value[1]?.value;
    const resource = update.value[0]?.value;
    entities.update((value) => {
      if (!value[indexToID(update.entity)]) value[indexToID(update.entity)] = {};
      value[indexToID(update.entity)].resource = resource;
      return value;
    });

    if (resource > oldResource) {
      const logEntry = {
        address: indexToID(update.entity),
        message: "is gathering.",
      };
      narrative.update((value) => {
        return [logEntry, ...value];
      });
    }
  });
}
