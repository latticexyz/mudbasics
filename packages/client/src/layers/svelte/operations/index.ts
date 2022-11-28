import { crawl, walk, run, east, west, north, south, southEast, southWest, northEast, northWest } from "./move";
import { gather, hoard, stockpile } from "./gather";
import { nibble, eat, feast } from "./consume";
import { fire } from "./burn";
import { play } from "./play";
import { suicide } from "./special";
import { hungry } from "./gates";

export interface Operation {
  name: string;
  category: string;
  description: string;
  f: () => boolean;
}

export const operations: Operation[] = [
  // --- MOVE
  { name: "east", category: "move", description: "", f: east },
  { name: "west", category: "move", description: "", f: west },
  { name: "north", category: "move", description: "", f: north },
  { name: "south", category: "move", description: "", f: south },
  { name: "south-east", category: "move", description: "", f: southEast },
  { name: "south-west", category: "move", description: "", f: southWest },
  { name: "north-east", category: "move", description: "", f: northEast },
  { name: "north-west", category: "move", description: "", f: northWest },
  { name: "crawl", category: "move", description: "", f: crawl },
  { name: "walk", category: "move", description: "", f: walk },
  { name: "run", category: "move", description: "", f: run },
  // --- CONSUME
  { name: "nibble", category: "consume", description: "", f: nibble },
  { name: "eat", category: "consume", description: "", f: eat },
  { name: "feast", category: "consume", description: "", f: feast },
  { name: "gather", category: "gather", description: "", f: gather },
  { name: "hoard", category: "gather", description: "", f: hoard },
  { name: "stockpile", category: "gather", description: "", f: stockpile },
  // --- BURN
  { name: "fire", category: "burn", description: "", f: fire },
  // --- PLAY
  { name: "play", category: "play", description: "", f: play },
  // --- SPECIAL
  { name: "suicide", category: "special", description: "", f: suicide },
  // --- GATES
  { name: "hungry?", category: "gate", description: "", f: hungry },
];
