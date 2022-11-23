import { get } from "svelte/store";
import { network, blockNumber } from "../../stores/network";
import { entities } from "../../stores/entities";
import { playerAddress } from "../../stores/player";

export function run() {
  if (get(entities)[get(playerAddress)].energy >= 50) {
    get(network).api?.move(50, 0);
    return true;
  } else {
    console.log("Run: not enough energy");
    return false;
  }
}
