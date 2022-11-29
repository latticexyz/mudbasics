import { get } from "svelte/store";
import { network } from "../../stores/network";
import { player } from "../../stores/player";

export const cost = {
  ids: ["energy"],
  values: [10],
};

export function crawl() {
  if ((get(player).energy || 0) >= 10) {
    get(network).api?.move(10, 0);
    return true;
  } else {
    console.log("Crawl: not enough energy");
    return false;
  }
}
