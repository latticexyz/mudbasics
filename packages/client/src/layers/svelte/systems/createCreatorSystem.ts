import { defineComponentSystem } from "@latticexyz/recs";
import { NetworkLayer } from "../../network";
import { entities, indexToID } from "../stores/entities";
import { addToLog, EventCategory } from "../stores/narrative";

export function createCreatorSystem(network: NetworkLayer) {
  const {
    world,
    components: { Creator },
  } = network;

  defineComponentSystem(world, Creator, (update) => {
    console.log("==> Creator system: ", update);
    const creator: string[] = update.value[0]?.value;
    entities.update((value) => {
      if (!value[indexToID(update.entity)]) value[indexToID(update.entity)] = {};
      value[indexToID(update.entity)].creator = creator;
      return value;
    });

    addToLog(update, EventCategory.Fire);
  });
}
