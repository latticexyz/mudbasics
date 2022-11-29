import { get } from "svelte/store";
import { network, blockNumber } from "../../stores/network";
import { player } from "../../stores/player";

export const cost = {
  ids: ["resource"],
  values: [100],
};

export function fire() {
  if ((get(player).resource || 0) >= 100) {
    get(network).api?.burn(100);
    return true;
  } else {
    console.log("Fire: not enough resource");
    return false;
  }
}
