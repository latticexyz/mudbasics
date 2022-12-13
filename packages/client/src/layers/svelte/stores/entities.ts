import { Coord } from "@latticexyz/utils";
import { writable, get, derived } from "svelte/store";
import { network } from "./network";

export enum EntityType {
  Player,
  Terrain,
  Fire,
  Corpse,
  Ghost,
}

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
  death?: number;
  cannibal?: string[];
  playing?: number;
}

export interface Entities {
  [index: string]: Entity;
}

export const entities = writable({} as Entities);

export const indexToID = (index: number) => {
  return get(network).world?.entities[index];
};

// Arrays
export const players = derived(
  entities,
  ($entities) =>
    Object.values($entities).filter(
      (e) => e.entityType == EntityType.Player || e.entityType == EntityType.Corpse
    ) as ArrayLike<Entity>
);
export const fires = derived(entities, ($entities) =>
  Object.values($entities).filter((e) => {
    return e.entityType == EntityType.Fire;
  })
);
export const terrains = derived(
  entities,
  ($entities) => Object.values($entities).filter((e) => e.entityType == EntityType.Terrain) as ArrayLike<Entity>
);
export const corpses = derived(
  entities,
  ($entities) => Object.values($entities).filter((e) => e.entityType == EntityType.Corpse) as ArrayLike<Entity>
);

// Objects
export const playersV2 = derived(entities, ($entities) =>
  Object.fromEntries(Object.entries($entities).filter(([v, e]) => e.entityType == EntityType.Player))
);
export const firesV2 = derived(entities, ($entities) =>
  Object.fromEntries(Object.entries($entities).filter(([v, e]) => e.entityType == EntityType.Fire))
);
export const terrainsV2 = derived(entities, ($entities) =>
  Object.fromEntries(Object.entries($entities).filter(([v, e]) => e.entityType == EntityType.Terrain))
);
export const corpsesV2 = derived(entities, ($entities) =>
  Object.fromEntries(Object.entries($entities).filter(([v, e]) => e.entityType == EntityType.Corpse))
);
