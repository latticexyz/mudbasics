import { get } from "svelte/store";
import { network, blockNumber } from "../../stores/network";
import { player } from "../../stores/player";
import { Directions } from "../../utils/space";

export const cost = {
  ids: ["energy"],
  values: [10],
};

export function south() {
  if ((get(player).energy || 0) >= 10) {
    get(network).api?.move(10, Directions.South);
    return true;
  } else {
    console.log("Walk: not enough energy");
    return false;
  }
}
