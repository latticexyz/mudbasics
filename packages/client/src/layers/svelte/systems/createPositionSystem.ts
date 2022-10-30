import { defineComponentSystem } from "@latticexyz/recs";
import { NetworkLayer } from "../../network";
import { entities } from "../stores/entities";

export function createPositionSystem(network: NetworkLayer) {
  const {
    world,
    components: { Position },
  } = network;

  defineComponentSystem(world, Position, (update) => {
    const position = update.value[0];
    entities.update((value) => {
      if (!value[update.entity]) value[update.entity] = {};
      value[update.entity].position = position;
      return value;
    });
  });
}
