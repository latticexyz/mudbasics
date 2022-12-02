import { writable } from "svelte/store";
import { NetworkLayer } from "../../network";

export const network = writable({} as NetworkLayer);
export const ready = writable(false);
export const loadingMessage = writable("Loading");
export const blockNumber = writable(0);
export const startBlock = writable(0);
