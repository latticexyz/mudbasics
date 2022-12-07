import {
  crawl,
  stumble,
  gallop,
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
import { collect, dig, drain } from "./gather";
import { nibble, eat, feast } from "./consume";
import { fire } from "./burn";
import { play } from "./play";
import { giveUp } from "./special";
import { hungry, sludgeRich, drained, byTheFire } from "./gates";
import { Narration } from "../stores/narrative";

export interface Operation {
  name: string;
  category: string;
  narration: Narration;
  f: () => boolean;
}

export const operations: Operation[] = [
  //
  // --- MOVE
  {
    name: "east",
    category: "move",
    narration: {
      description: "If you believe in God, believe in death row east",
      cost: "energy: 10",
    },
    f: east,
  },
  {
    name: "west",
    category: "move",
    narration: {
      description: "If you want to go east, don't go west",
      cost: "energy: 10",
    },
    f: west,
  },
  {
    name: "north",
    category: "move",
    narration: {
      description: "Fist of the north star",
      cost: "energy: 10",
    },
    f: north,
  },
  {
    name: "south",
    category: "move",
    narration: {
      description: "Maybe this will head me from the cold.",
      cost: "energy: 10",
    },
    f: south,
  },
  {
    name: "south-east",
    category: "move",
    narration: {
      description: "Move south-east",
      cost: "energy: 10",
    },
    f: southEast,
  },
  {
    name: "south-west",
    category: "move",
    narration: {
      description: "Move south-west",
      cost: "energy: 10",
    },
    f: southWest,
  },
  {
    name: "north-east",
    category: "move",
    narration: {
      description: "Move north-east",
      cost: "energy: 10",
    },
    f: northEast,
  },
  {
    name: "north-west",
    category: "move",
    narration: {
      description: "Move north-west",
      cost: "energy: 10",
    },
    f: northWest,
  },
  {
    name: "crawl",
    category: "move",
    narration: {
      description: "Move 1 step in random direction",
      lore: [
        "The smell is even stronger this close to the ground.",
        "Your cloth is becoming one with the soil.",
        "A brown recluse worm wraps itself around your ankle.",
      ],
      cost: "energy: 10",
    },
    f: crawl,
  },
  {
    name: "stumble",
    category: "move",
    narration: {
      description: "Move 3 steps in random direction",
      lore: ["Are there others out there?", "Better than to stay and be absorbed.", "You still dream of the others."],
      cost: "energy: 30",
    },
    f: stumble,
  },
  {
    name: "gallop",
    category: "move",
    narration: {
      description: "Move 5 steps in random direction",
      lore: [
        "You leave a trail of blood.",
        "Warm hearths for the sullen secret art, a lake of sludge to drown your heart",
        "One day you may touch the happy isles.",
      ],
      cost: "energy: 50",
    },
    f: gallop,
  },
  {
    name: "walk towards fire",
    category: "move",
    narration: {
      description: "Warmth or danger, who knows? does it matter?",
      lore: [
        "I’d rather sleep in the dark, but if the maggots don’t get me, the cold will.",
        "50/50 chance this is a good idea.",
        "Here are creatures who build diligently, but no leader in sight, I might join them.",
      ],
      cost: "energy: 10",
    },
    f: goTowardsFire,
  },
  // --- CONSUME
  {
    name: "nibble",
    category: "consume",
    narration: {
      description: "Treat yourself, wet your tongue with a bit of sludge",
      lore: [
        "That should last you till nightfall.",
        "Your stomach turns, you throw up.",
        "Your tears add a little flavour to it.",
      ],
      cost: "sludge: 10",
    },
    f: nibble,
  },
  {
    name: "eat",
    category: "consume",
    narration: {
      description: "Decent portion, like grandma used to make it.",
      lore: [
        "Why does the soil seem uneasy today?",
        "Your third arm still cradles the small leech",
        "Pray the Arteries will grant you your wish.",
      ],
      cost: "sludge: 25",
    },
    f: eat,
  },
  //
  // --- FEAST
  {
    name: "feast",
    category: "consume",
    narration: {
      description: "Deep gulps, if you throw up, dw, just drink it again <3",
      lore: ["For another day on this earth!", "Weather, walk with me!", "In deep they rest, glory to those who rest!"],
      cost: "sludge: 50",
    },
    f: feast,
  },
  //
  // --- GATHER
  {
    name: "collect",
    category: "gather",
    narration: {
      lore: [
        "fiberoptic shards cut your skin.",
        "you hum the old song as you scoop. ",
        `Frothproxy & twilight “|o|” / 
        He was the Old Wanderer / 
        The Stackdigger / 
        He took my twilight boi away/ 
        (˃̩̩̥ɷ˂̩̩̥)
        Oh, the old Stackdigger!”, you cry; the smog is so thick you cough, you swallow, you throw up. What a waste of sludge.`,
      ],
      description: "All I see are shrubs, leftovers and other bits",
      cost: "energy: 50",
    },
    f: collect,
  },
  {
    name: "dig",
    category: "gather",
    narration: {
      lore: [
        "Is this a tooth? What animal had teeth strong enough to survive the Big Juicification of the Old World?!",
        "A large larvae crawls into your lap and starts purring  <(°^°<0 …You squeeze it too hard. ",
        "The air smells of egg, it burns your nose, you get nostalgic, you once had an egg.",
      ],
      description: "I can make use of this...",
      cost: "energy: 100",
    },
    f: dig,
  },
  {
    name: "drain",
    category: "gather",
    narration: {
      lore: [
        "Your tool hits something hard: some kind of fossilised relic in yellow and black, sth valuable, maybe commemorating sth. It’s covered in tooth marks. You give it a small lick. ",
        "Get sth to eat, dig a hole, find shelter. You feel really fucking lonely",
        "Take half/leave half, cut out one eye, give it a wash, leave it, they demand a sacrifice.",
      ],
      description: "Keep collecting before we run out",
      cost: "energy: 200",
    },
    f: drain,
  },
  // --- BURN
  {
    name: "fire",
    category: "burn",
    narration: {
      description: "This will keep me warm me at night",
      lore: [
        "Let’s hope that tonight’s light attracts the fat moths, not the hungry ones.",
        "There's no smoke without fire, and smoke is just what this flea leather needs. Isn’t that right, Lewis?",
        "From the debris to the stars.",
        "Fire fire, burning bright throughout the night, bless me, bless me for I am your strongest warrior.",
      ],
      insufficient_energy: "You do not have enough energy for this.",
      insufficient_sludge: "You do not have enough sludge to start a fire.",
      cost: "sludge: 500, energy: 50",
    },
    f: fire,
  },
  // --- PLAY
  {
    name: "serenade",
    category: "play",
    narration: {
      description: "(╥﹏╥)",
      lore: [
        "I shall play, till they long for a place far away,- longing will make them soft, and soft pockets are easier to pierce.",
        "This song is for all the owls <3",
        "This song goes out to all of you, and to you big daddy-energy hill of paratrash!",
        "Tonight, it is I who shall play for you, this one is a song from the depths of my fifth chakra, listen to it ring!",
      ],
      cost: "energy: 100",
    },
    f: play,
  },
  // --- SPECIAL
  {
    name: "give up",
    category: "special",
    narration: {
      description: "What is the point to it all, anyways",
      lore: [
        "Shame to lose it all here. Cursed be the one that robs a corpse they haven’t killed themselves!",
        "Tell all the animals.",
        "“!Eternity! ٩(｡•́‿•̀｡)۶",
        "And you shall go down with me!",
      ],
      cost: "energy: all of it",
    },
    f: giveUp,
  },
  // --- GATES
  {
    name: "hungry?",
    category: "gate",
    narration: {
      description: "Are you hungry?",
      cost: "Continue if energy is under 100",
    },
    f: hungry,
  },
  {
    name: "drained?",
    category: "gate",
    narration: {
      description: "Has someone already drained all the sludge in this soil?",
      cost: "Continue if tile has sludge",
    },
    f: drained,
  },
  {
    name: "sludge rich?",
    category: "gate",
    narration: {
      description: "Are you carrying enough sludge to survive for a while?",
      cost: "Continue if resource is over 100",
    },
    f: sludgeRich,
  },
  {
    name: "by the fire?",
    category: "gate",
    narration: {
      description: "Are you by the fire?",
      cost: "Continue if you are by a fire.",
    },
    f: byTheFire,
  },
];

export const getOperation = (name: string) => {
  const result = operations.find((o) => o.name === name);
  if (!result) throw new Error("Operation Not Found");

  return result;
};
