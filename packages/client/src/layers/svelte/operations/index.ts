import {
  crawl,
  crawlCost,
  walk,
  walkCost,
  run,
  runCost,
  east,
  eastCost,
  west,
  westCost,
  north,
  northCost,
  south,
  southCost,
  southEast,
  southEastCost,
  southWest,
  southWestCost,
  northEast,
  northEastCost,
  northWest,
  northWestCost,
} from "./move";
import { gather, gatherCost, hoard, hoardCost, stockpile, stockpileCost } from "./gather";
import { nibble, nibbleCost, eat, eatCost, feast, feastCost } from "./consume";
import { fire, fireCost, bonfire, bonfireCost } from "./burn";
import { play, playCost } from "./play";
import { suicide, goTowardsFire } from "./special";
import { hungry, rich } from "./gates";

export interface Operation {
  name: string;
  category: string;
  description: string;
  c?: string;
  f: () => boolean;
}
export interface Cost {
  ids: [];
  values: [];
}

function costString(cost: Cost) {
  console.log(cost);
  let result = "";
  for (let i = 0; i < cost.ids.length; i++) {
    result += `${cost.ids[i]}: ${cost.values[i]} ${i < cost.ids.length - 1 ? ", " : ""}`;
  }
  console.log(result);
  return result;
}

export const operations: Operation[] = [
  // --- MOVE
  {
    name: "east",
    category: "move",
    description: "If you believe in God, believe in Death Row East",
    f: east,
    c: costString(eastCost),
  },
  {
    name: "west",
    category: "move",
    description: "If you want to go east, don't go west",
    f: west,
    c: costString(westCost),
  },
  {
    name: "north",
    category: "move",
    description: "Fist of the north star",
    f: north,
    c: costString(northCost),
  },
  {
    name: "south",
    category: "move",
    description: "The south will rise again",
    f: south,
    c: costString(southCost),
  },
  {
    name: "south-east",
    category: "move",
    description: "Move south-east",
    f: southEast,
    c: costString(southEastCost),
  },
  {
    name: "south-west",
    category: "move",
    description: "Move south-west",
    f: southWest,
    c: costString(southWestCost),
  },
  {
    name: "north-east",
    category: "move",
    description: "Move north-east",
    f: northEast,
    c: costString(northEastCost),
  },
  {
    name: "north-west",
    category: "move",
    description: "Move north-west",
    f: northWest,
    c: costString(northWestCost),
  },
  {
    name: "crawl",
    category: "move",
    description: "Use your hands while you walk",
    f: crawl,
    c: costString(crawlCost),
  },
  {
    name: "walk",
    category: "move",
    description: "Pedestrial locomotion for those with two feet attached",
    f: walk,
    c: costString(walkCost),
  },
  {
    name: "run",
    category: "move",
    description: "Go... run with the wind",
    f: run,
    c: costString(runCost),
  },
  // --- CONSUME
  {
    name: "nibble",
    category: "consume",
    description: "Have yourself a little something",
    f: nibble,
    c: costString(nibbleCost),
  },
  {
    name: "eat",
    category: "consume",
    description: "Time for a meal",
    f: eat,
    c: costString(eatCost),
  },
  {
    name: "feast",
    category: "consume",
    description: "Tonight, we feast!",
    f: feast,
    c: costString(feastCost),
  },
  {
    name: "gather",
    category: "gather",
    description: "All I see are shrubs, leftovers and other bits",
    f: gather,
    c: costString(gatherCost),
  },
  {
    name: "hoard",
    category: "gather",
    description: "I can make use of this...",
    f: hoard,
    c: costString(hoardCost),
  },
  {
    name: "stockpile",
    category: "gather",
    description: "Keep collecting before we run out",
    f: stockpile,
    c: costString(stockpileCost),
  },
  // --- BURN
  {
    name: "fire",
    category: "burn",
    description: "This will keep me warm me at night",
    f: fire,
    c: costString(fireCost),
  },
  {
    name: "bonfire",
    category: "burn",
    description: "Let ashes blow over the fields for days on end",
    f: bonfire,
    c: costString(bonfireCost),
  },
  // --- PLAY
  {
    name: "play",
    category: "play",
    description: "(╯°Д°)╯︵/(.□ . \\)",
    f: play,
    c: costString(playCost),
  },
  // --- SPECIAL
  {
    name: "suicide",
    category: "special",
    description: "What is the point to it all, anyways",
    f: suicide,
  },
  { name: "go-to-fire", category: "special", description: "", f: goTowardsFire },
  // --- GATES
  {
    name: "hungry?",
    category: "gate",
    description: "I could use a little more... (!) ",
    f: hungry,
    c: "Reruns sequence if energy is under 900",
  },
  {
    name: "rich?",
    category: "gate",
    description: "More... more... more...",
    f: rich,
    c: "Reruns sequence if resource is over 200",
  },
];
