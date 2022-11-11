import { defineComponentSystem } from "@latticexyz/recs";
import { NetworkLayer } from "../../network";
import { entities, indexToID } from "../stores/entities";

export function createPositionSystem(network: NetworkLayer) {
  const {
    world,
    components: { Position },
  } = network;

  defineComponentSystem(world, Position, (update) => {
    // console.log("==> Position system: ", update);
    const position = update.value[0];
    entities.update((value) => {
      if (!value[indexToID(update.entity)]) value[indexToID(update.entity)] = {};
      value[indexToID(update.entity)].position = position;
      return value;
    });
  });
}
