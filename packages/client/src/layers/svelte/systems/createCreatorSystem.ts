import { defineComponentSystem } from "@latticexyz/recs";
import { NetworkLayer } from "../../network";
import { entities, indexToID } from "../stores/entities";
import { narrative } from "../stores/narrative";

export function createCreatorSystem(network: NetworkLayer) {
  const {
    world,
    components: { Creator },
  } = network;

  defineComponentSystem(world, Creator, (update) => {
    console.log("==> Creator system: ", update);
    const creator = update.value[0]?.value;
    entities.update((value) => {
      if (!value[indexToID(update.entity)]) value[indexToID(update.entity)] = {};
      value[indexToID(update.entity)].creator = String(creator);
      return value;
    });

    const logEntry = {
      address: creator,
      message: "made a fire",
    };
    narrative.update((value) => {
      return [logEntry, ...value];
    });
  });
}
