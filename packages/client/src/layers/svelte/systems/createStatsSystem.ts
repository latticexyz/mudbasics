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
    console.log(update);
    const stats: StatsType = update.value[0];

    entities.update((value) => {
      console.log("are we updating");
      if (!value[indexToID(update.entity)]) value[indexToID(update.entity)] = {};
      value[indexToID(update.entity)].stats = stats;

      console.log("we are updating");
      console.log(value);
      return value;
    });
  });
}
