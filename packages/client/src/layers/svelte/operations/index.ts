import { crawl, walk, run, east, west, north, south } from "./move";
import { gather, hoard, stockpile } from "./gather";
import { nibble, eat, feast } from "./consume";

export interface Operation {
  name: string;
  category: string;
  f: () => boolean;
}

export const operations: Operation[] = [
  { name: "east", category: "move", f: east },
  { name: "west", category: "move", f: west },
  { name: "north", category: "move", f: north },
  { name: "south", category: "move", f: south },
  { name: "crawl", category: "move", f: crawl },
  { name: "walk", category: "move", f: walk },
  { name: "run", category: "move", f: run },
  { name: "nibble", category: "consume", f: nibble },
  { name: "eat", category: "consume", f: eat },
  { name: "feast", category: "consume", f: feast },
  { name: "gather", category: "gather", f: gather },
  { name: "hoard", category: "gather", f: hoard },
  { name: "stockpile", category: "gather", f: stockpile },
];
