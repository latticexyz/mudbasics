import { defineComponentSystem } from "@latticexyz/recs";
import { NetworkLayer } from "../../network";
import { entities, indexToID, StatsType } from "../stores/entities";
import { addToLog, EventCategory } from "../stores/narrative";

export function createStatsSystem(network: NetworkLayer) {
  const {
    world,
    components: { Stats },
  } = network;

  defineComponentSystem(world, Stats, (update) => {
    console.log("==> Stats system: ", update);
    const stats: StatsType = update.value[0];
    entities.update((value) => {
      if (!value[indexToID(update.entity)]) value[indexToID(update.entity)] = {};
      value[indexToID(update.entity)].stats = stats;
      return value;
    });
  });
}
