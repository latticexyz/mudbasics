import { get } from "svelte/store";
import { network, blockNumber } from "../../stores/network";
import { player } from "../../stores/player";

export const cost = {
  ids: ["energy"],
  values: [50],
};

export function gather() {
  if ((get(player).energy || 0) >= 50) {
    get(network).api?.gather(50);
    return true;
  } else {
    console.log("Gather: not enough energy");
    return false;
  }
}
