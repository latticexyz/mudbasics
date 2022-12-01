import { defineComponentSystem } from "@latticexyz/recs";
import { NetworkLayer } from "../../network";
import { entities, indexToID, EntityType as E } from "../stores/entities";
import { addToLog, EventCategory } from "../stores/narrative";

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

    if (entityType == E.Player) {
      addToLog(update, EventCategory.Birth);
    }

    if (entityType == E.Corpse) {
      addToLog(update, EventCategory.Death);
    }
  });
}
