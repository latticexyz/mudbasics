import { get } from "svelte/store";
import { network, blockNumber } from "../../stores/network";
import { entities } from "../../stores/entities";
import { playerAddress } from "../../stores/player";

export function eat() {
  if (get(entities)[get(playerAddress)].resource >= 10) {
    get(network).api?.consume(10);
    return true;
  } else {
    console.log("Eat: not enough resource");
    return false;
  }
}
