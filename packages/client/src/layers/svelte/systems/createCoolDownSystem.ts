import { defineComponentSystem } from "@latticexyz/recs";
import { NetworkLayer } from "../../network";
import { entities, indexToID } from "../stores/entities";

export function createCoolDownSystem(network: NetworkLayer) {
  const {
    world,
    components: { CoolDown },
  } = network;

  defineComponentSystem(world, CoolDown, (update) => {
    // console.log("==> CoolDown system: ", update);
    const coolDownBlock = update.value[0]?.value;
    entities.update((value) => {
      if (!value[indexToID(update.entity)]) value[indexToID(update.entity)] = {};
      value[indexToID(update.entity)].coolDownBlock = coolDownBlock;
      return value;
    });
  });
}
