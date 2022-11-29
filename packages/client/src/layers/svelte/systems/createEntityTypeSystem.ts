import { blockNumber } from "../stores/network";
import { get } from "svelte/store";
import { narrative, LogEntry } from "../stores/narrative";
import { defineComponentSystem } from "@latticexyz/recs";
import { NetworkLayer } from "../../network";
import { entities, indexToID } from "../stores/entities";
import { EntityType as E } from "../utils/space";

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
      const logEntry: LogEntry = {
        id: self.crypto.randomUUID(),
        blockNumber: get(blockNumber),
        address: indexToID(update.entity),
        message: "spawned",
      };
      narrative.update((value) => {
        return [logEntry, ...value];
      });
    }

    if (entityType == E.Corpse) {
      const logEntry: LogEntry = {
        id: self.crypto.randomUUID(),
        blockNumber: get(blockNumber),
        address: indexToID(update.entity),
        message: "died.",
      };
      narrative.update((value) => {
        return [logEntry, ...value];
      });
    }
  });
}
