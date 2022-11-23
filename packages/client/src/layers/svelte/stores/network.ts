import { writable } from "svelte/store";
import { NetworkLayer } from "../../network";

export const network = writable({} as NetworkLayer);
export const blockNumber = writable(0);
