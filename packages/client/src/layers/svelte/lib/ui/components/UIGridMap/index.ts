import { Coord } from "@latticexyz/recs";
import { Entity } from "../../../../stores/entities";
import { TerrainType } from "../../../../utils/space";

export interface GridTile {
  direction: string;
  transformation: Coord;
  coordinates: Coord;
  perlinFactor: number;
  terrain: TerrainType;
  resource: number;
  fire?: Entity | undefined;
  other?: Entity | undefined;
  corpse?: Entity | undefined;
  mined?: Entity | undefined;
}

// In order from low to high
export enum TileOverlays {
  // Gathering
  Empty = "mined",
  Depleted = "mined-3",
  Extracted = "mined-2",
  Dug = "mined-1",
  // Masks
  Thief = "mask-0",
  Scavenger = "mask-1",
  Hunter = "mask-2",
  Mage = "mask-3",
  // Players
  Other = "mask other",
  Player = "mask player",
  CorpseMask = "mask corpse",
  Corpse = "corpse",
  // Fire
  FireOff = "fire-off",
  FireOn = "fire-on",
}
