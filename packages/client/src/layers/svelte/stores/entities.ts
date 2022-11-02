import { writable, get } from "svelte/store";
import { layers } from "./layers";

export const entities = writable({});

export const indexToID = (index: number) => {
  console.log("index", index);
  return get(layers).network?.world.entities[index];
};
