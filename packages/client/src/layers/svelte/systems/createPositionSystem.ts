import { narrative } from "../stores/narrative";
import { defineComponentSystem } from "@latticexyz/recs";
import { NetworkLayer } from "../../network";
import { entities, indexToID } from "../stores/entities";
import { getDirection } from "../utils/space";

export function createPositionSystem(network: NetworkLayer) {
  const {
    world,
    components: { Position },
  } = network;

  defineComponentSystem(world, Position, (update) => {
    console.log("==> Position system: ", update);
    const previousPosition = update.value[1];
    const currentPosition = update.value[0];
    entities.update((value) => {
      if (!value[indexToID(update.entity)]) value[indexToID(update.entity)] = {};
      value[indexToID(update.entity)].position = currentPosition;
      return value;
    });

    if (previousPosition) {
      const logEntry = {
        address: indexToID(update.entity),
        message: "is moving " + getDirection(previousPosition, currentPosition),
      };
      narrative.update((value) => {
        return [logEntry, ...value];
      });
    } else {
      const logEntry = {
        address: indexToID(update.entity),
        message: "spawned",
      };
      narrative.update((value) => {
        return [logEntry, ...value];
      });
    }
  });
}
