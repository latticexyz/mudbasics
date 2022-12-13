import { get } from "svelte/store";
import { ComponentUpdate } from "@latticexyz/recs";
import { seedToName } from "../../utils/name";
import { entities, indexToID } from "../entities";
import { playerAddress } from "../player";

export function fire(update: ComponentUpdate, isSelf: boolean) {
  const entity = get(entities)[indexToID(update.entity)];
  if (entity.creator[entity.creator.length - 1] === playerAddress) {
    return "You made a fire";
  } else {
    console.log(get(entities)[entity.creator[entity.creator.length - 1]]);
    return "A fire was created by " + seedToName(get(entities)[entity.creator[entity.creator.length - 1]].seed);
  }
}
