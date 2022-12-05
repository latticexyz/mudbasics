import { ComponentUpdate } from "@latticexyz/recs";
import { sample } from "lodash";

const secondPersonActions = ["You absorbed ", "You ate "];

export function eat(update: ComponentUpdate, isSelf: boolean) {
  const oldValue = Number(update.value[1]?.value || 0);
  const newValue = Number(update.value[0]?.value || 0);
  return sample(secondPersonActions) + (newValue - oldValue) / 5 + " sludge";
}
