import { Coord } from "@latticexyz/utils";
import { writable, get } from "svelte/store";
import { EntityType } from "../utils/space";
import { network } from "./network";

export interface Entity {
  entityType?: EntityType;
  position?: Coord;
  coolDownBlock?: number;
  creator?: string[];
  energy?: number;
  resource?: number;
  seed?: number;
}

interface Entities {
  [index: string]: Entity;
}

export const entities = writable({} as Entities);

export const indexToID = (index: number) => {
  return get(network).world?.entities[index];
};
