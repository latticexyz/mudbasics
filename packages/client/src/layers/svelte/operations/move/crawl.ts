import { get } from "svelte/store";
import { network, blockNumber } from "../../stores/network";
import { entities } from "../../stores/entities";
import { playerAddress } from "../../stores/player";

export function crawl() {
  if (get(entities)[get(playerAddress)].energy >= 10) {
    get(network).api?.move(10, 0);
    return true;
  } else {
    console.log("Crawl: not enough energy");
    return false;
  }
}
