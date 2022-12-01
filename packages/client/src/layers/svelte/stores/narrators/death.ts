import { get } from "svelte/store";
import { ComponentUpdate } from "@latticexyz/recs";
import { seedToName } from "../../utils/name";
import { indexToID, entities } from "../entities";
import { sample } from "lodash";

const secondPersonActions = ["You died.", "You left the world."];

const thirdPersonActions = [
  " cries out in the darkness and is no more.",
  " ran out of juice.",
  " died.",
  " left the world.",
];

export function death(update: ComponentUpdate, isSelf: boolean) {
  if (isSelf) {
    return sample(secondPersonActions);
  } else {
    const entity = get(entities)[indexToID(update.entity)];
    return seedToName(entity.seed) + sample(thirdPersonActions);
  }
}
