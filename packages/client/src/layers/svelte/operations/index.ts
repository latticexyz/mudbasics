import {
  crawl,
  walk,
  run,
  east,
  west,
  north,
  south,
  southEast,
  southWest,
  northEast,
  northWest,
  goTowardsFire,
} from "./move";
import { gather, hoard, stockpile } from "./gather";
import { nibble, eat, feast } from "./consume";
import { fire, bonfire } from "./burn";
import { play } from "./play";
import { suicide } from "./special";
import { hungry, rich } from "./gates";

export interface Operation {
  name: string;
  category: string;
  description: string;
  cost: string;
  f: () => boolean;
}

export const operations: Operation[] = [
  // --- MOVE
  {
    name: "east",
    category: "move",
    description: "If you believe in God, believe in Death Row East",
    cost: "energy: 10",
    f: east,
  },
  {
    name: "west",
    category: "move",
    description: "If you want to go east, don't go west",
    cost: "energy: 10",
    f: west,
  },
  {
    name: "north",
    category: "move",
    description: "Fist of the north star",
    cost: "energy: 10",
    f: north,
  },
  {
    name: "south",
    category: "move",
    description: "The south will rise again",
    cost: "energy: 10",
    f: south,
  },
  {
    name: "south-east",
    category: "move",
    description: "Move south-east",
    cost: "energy: 10",
    f: southEast,
  },
  {
    name: "south-west",
    category: "move",
    description: "Move south-west",
    cost: "energy: 10",
    f: southWest,
  },
  {
    name: "north-east",
    category: "move",
    description: "Move north-east",
    cost: "energy: 10",
    f: northEast,
  },
  {
    name: "north-west",
    category: "move",
    description: "Move north-west",
    cost: "energy: 10",
    f: northWest,
  },
  {
    name: "crawl",
    category: "move",
    description: "Move 1 step in random direction",
    cost: "energy: 10",
    f: crawl,
  },
  {
    name: "walk",
    category: "move",
    description: "Move 3 steps in random direction",
    cost: "energy: 30",
    f: walk,
  },
  {
    name: "run",
    category: "move",
    description: "Move 5 steps in random direction",
    cost: "energy: 50",
    f: run,
  },
  {
    name: "go-to-fire",
    category: "move",
    description: "Walk towards closest fire",
    cost: "energy: 10",
    f: goTowardsFire,
  },
  // --- CONSUME
  {
    name: "nibble",
    category: "consume",
    description: "Have yourself a little something",
    cost: "resource: 5",
    f: nibble,
  },
  {
    name: "eat",
    category: "consume",
    description: "Time for a meal",
    cost: "resource: 10",
    f: eat,
  },
  {
    name: "feast",
    category: "consume",
    description: "Tonight, we feast!",
    cost: "resource: 20",
    f: feast,
  },
  {
    name: "gather",
    category: "gather",
    description: "All I see are shrubs, leftovers and other bits",
    cost: "energy: 50",
    f: gather,
  },
  {
    name: "hoard",
    category: "gather",
    description: "I can make use of this...",
    cost: "energy: 100",
    f: hoard,
  },
  {
    name: "stockpile",
    category: "gather",
    description: "Keep collecting before we run out",
    cost: "energy: 200",
    f: stockpile,
  },
  // --- BURN
  {
    name: "fire",
    category: "burn",
    description: "This will keep me warm me at night",
    cost: "resource: 100, energy: 50",
    f: fire,
  },
  {
    name: "bonfire",
    category: "burn",
    description: "Let ashes blow over the fields for days on end",
    cost: "resource: 500, energy: 50",
    f: bonfire,
  },
  // --- PLAY
  {
    name: "play",
    category: "play",
    description: "(╯°Д°)╯︵/(.□ . \\)",
    cost: "energy: 100",
    f: play,
  },
  // --- SPECIAL
  {
    name: "suicide",
    category: "special",
    description: "What is the point to it all, anyways",
    cost: "energy: all of it",
    f: suicide,
  },
  // --- GATES
  {
    name: "hungry?",
    category: "gate",
    description: "I could use a little more... (!) ",
    cost: "Continue if energy is under 900",
    f: hungry,
  },
  {
    name: "rich?",
    category: "gate",
    description: "More... more... more...",
    cost: "Continue if resource is over 200",
    f: rich,
  },
];
