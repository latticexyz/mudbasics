import { Coord } from "@latticexyz/utils";
import { writable, get } from "svelte/store";
import { EntityType } from "../utils/space";
import { network } from "./network";

export interface StatsType {
  traveled: number;
  gathered: number;
  burnt: number;
  eaten: number;
}

export interface Entity {
  entityType?: EntityType;
  position?: Coord;
  coolDownBlock?: number;
  creator?: string[];
  energy?: number;
  resource?: number;
  seed?: number;
  stats?: StatsType;
  birth?: number;
  cannibal: string[];
}

export interface Entities {
  [index: string]: Entity;
}

export const entities = writable({} as Entities);

export const indexToID = (index: number) => {
  return get(network).world?.entities[index];
};
