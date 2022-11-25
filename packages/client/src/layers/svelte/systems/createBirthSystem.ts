import { defineComponentSystem } from "@latticexyz/recs";
import { NetworkLayer } from "../../network";
import { entities, indexToID } from "../stores/entities";

export function createBirthSystem(network: NetworkLayer) {
  const {
    world,
    components: { Birth },
  } = network;

  defineComponentSystem(world, Birth, (update) => {
    console.log("==> Birth system: ", update);
    const birth = update.value[0]?.value;
    entities.update((value) => {
      if (!value[indexToID(update.entity)]) value[indexToID(update.entity)] = {};
      value[indexToID(update.entity)].birth = birth;
      return value;
    });
  });
}
