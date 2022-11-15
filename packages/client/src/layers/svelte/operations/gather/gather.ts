import { get } from "svelte/store";
import { network, blockNumber } from "../../stores/network";
import { entities } from "../../stores/entities";
import { playerAddress } from "../../stores/player";

export function gather() {
  if (get(entities)[get(playerAddress)].energy >= 50) {
    get(network).api?.gather(50);
    return true;
  } else {
    console.log("Gather: not enough energy");
    return false;
  }
}
