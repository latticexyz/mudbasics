import { get } from "svelte/store";
import { network, blockNumber } from "../../stores/network";
import { entities } from "../../stores/entities";
import { playerAddress } from "../../stores/player";

export function crawl() {
  if (get(entities)[get(playerAddress)].energy >= 1) {
    get(network).api?.move(1);
    return true;
  } else {
    console.log("Crawl: not enough energy");
    return false;
  }
}
