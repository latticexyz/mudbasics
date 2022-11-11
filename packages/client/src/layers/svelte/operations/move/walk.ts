import { get } from "svelte/store";
import { network, blockNumber } from "../../stores/network";
import { entities } from "../../stores/entities";
import { playerAddress } from "../../stores/player";

export function walk() {
  if (get(entities)[get(playerAddress)].energy >= 3) {
    get(network).api?.move(3);
    return true;
  } else {
    console.log("Walk: not enough energy");
    return false;
  }
}
