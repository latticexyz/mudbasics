import { Coord } from "@latticexyz/utils";
import { writable, get, derived } from "svelte/store";
import { EntityType } from "../utils/space";
import { network } from "./network";
import { category } from "./ui";
import { playerAddress } from "../stores/player";

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
  playing?: number;
}

export interface Entities {
  [index: string]: Entity;
}

export const entities = writable({} as Entities);

export const indexToID = (index: number) => {
  return get(network).world?.entities[index];
};

export const players = derived(
  entities,
  ($entities) => Object.values($entities).filter((e) => e.entityType == EntityType.Player) as ArrayLike<Entity>
);
export const fires = derived(
  entities,
  ($entities) =>
    Object.values($entities).filter((e) => {
      return e.entityType == EntityType.Fire;
    }) as ArrayLike<Entity>
);
export const terrains = derived(
  entities,
  ($entities) => Object.values($entities).filter((e) => e.entityType == EntityType.Terrain) as ArrayLike<Entity>
);
export const corpses = derived(
  entities,
  ($entities) => Object.values($entities).filter((e) => e.entityType == EntityType.Corpse) as ArrayLike<Entity>
);
