import { defineComponentSystem } from "@latticexyz/recs";
import { NetworkLayer } from "../../network";
import { entities, indexToID, StatsType } from "../stores/entities";

export function createStatsSystem(network: NetworkLayer) {
  const {
    world,
    components: { Stats },
  } = network;

  defineComponentSystem(world, Stats, (update) => {
    console.log("==> Stats system: ", update);
    const stats: StatsType = update.value[0]?.value;
    entities.update((value) => {
      if (!value[indexToID(update.entity)]) value[indexToID(update.entity)] = {};
      value[indexToID(update.entity)].stats = stats;
      return value;
    });
  });
}
