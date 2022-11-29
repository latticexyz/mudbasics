import { get } from "svelte/store";
import { network, blockNumber } from "../../stores/network";
import { player } from "../../stores/player";

export const cost = {
  ids: ["energy"],
  values: [100],
};

export function hoard() {
  if ((get(player).energy || 0) >= 100) {
    get(network).api?.gather(100);
    return true;
  } else {
    console.log("Hoard: not enough energy");
    return false;
  }
}
