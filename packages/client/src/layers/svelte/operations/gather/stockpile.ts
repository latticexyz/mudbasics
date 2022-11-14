import { get } from "svelte/store";
import { network, blockNumber } from "../../stores/network";
import { entities } from "../../stores/entities";
import { playerAddress } from "../../stores/player";

export function stockpile() {
  if (get(entities)[get(playerAddress)].energy >= 200) {
    get(network).api?.gather(200);
    return true;
  } else {
    console.log("Stockpile: not enough energy");
    return false;
  }
}
