import { writable, get } from "svelte/store";
import { network } from "./network";

export const entities = writable({});

export const indexToID = (index: number) => {
  return get(network).world?.entities[index];
};
