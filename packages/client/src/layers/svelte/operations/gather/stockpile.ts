import { get } from "svelte/store";
import { network, blockNumber } from "../../stores/network";
import { player } from "../../stores/player";

export const cost = {
  ids: ["energy"],
  values: [200],
};

export function stockpile() {
  if ((get(player).energy || 0) >= 200) {
    get(network).api?.gather(200);
    return true;
  } else {
    console.log("Stockpile: not enough energy");
    return false;
  }
}
