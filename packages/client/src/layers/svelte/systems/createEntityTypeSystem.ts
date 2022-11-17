import { defineComponentSystem } from "@latticexyz/recs";
import { NetworkLayer } from "../../network";
import { entities, indexToID } from "../stores/entities";

export function createEntityTypeSystem(network: NetworkLayer) {
  const {
    world,
    components: { EntityType },
  } = network;

  defineComponentSystem(world, EntityType, (update) => {
    console.log("==> EntityType system: ", update);
    const entityType = update.value[0]?.value;
    entities.update((value) => {
      if (!value[indexToID(update.entity)]) value[indexToID(update.entity)] = {};
      value[indexToID(update.entity)].entityType = entityType;
      return value;
    });
  });
}
