import { get } from "svelte/store";
import { network, blockNumber } from "../../stores/network";
import { player } from "../../stores/player";

export const cost = {
  ids: ["resource"],
  values: [5],
};

export function nibble() {
  if ((get(player).resource || 0) >= 5) {
    get(network).api?.consume(5);
    return true;
  } else {
    console.log("Nibble: not enough resource");
    return false;
  }
}
