import { get } from "svelte/store";
import { network, blockNumber } from "../../stores/network";
import { player } from "../../stores/player";

export function crawl() {
  if ((get(player).energy || 0) >= 10) {
    get(network).api?.move(10, 0);
    return true;
  } else {
    console.log("Crawl: not enough energy");
    return false;
  }
}
