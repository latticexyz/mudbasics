import { writable, derived, get } from "svelte/store";
import { playerList } from "../../../../stores/player";
import { blockNumber } from "../../../../stores/network";

const fireZerothNames = [
  "The Fire of",
  "The Star of",
  "The Blaze of",
  "The Great Recyler of",
  "The Semaphor of",
  "The Calling of",
  "The Warmth of",
  "The Light of",
  "The Comforter of",
  "The Sign of",
];

const fireFirstNames = [
  "Tereris",
  "Juffo",
  "Justyz",
  "Kano",
  "Barchtel",
  "Barkins",
  "The Hound",
  "The Fool",
  "Syn",
  "Violette",
  "Noon",
  "Joliboye",
  "Jogeler",
  "Camphor",
  "Stalk",
  "Dawnse",
  "Gord",
  "Foly",
  "Kardu",
  "Bolka",
];

export function addressToFireName(address: string) {
  const zerothNameIndex = Math.round(Number(address)) % 10;
  const firstNameIndex = Math.round(Number(address)) % 20;

  return fireZerothNames[zerothNameIndex] + " " + fireFirstNames[firstNameIndex];
}

export const fireString = (v) => {
  const valueStore = writable(v);

  return derived([valueStore, blockNumber], ([$value, $blockNumber]) => {
    let str = "";

    if (Math.max($value.coolDownBlock - $blockNumber, 0) > 0) {
      str += "🔥 ";
    } else {
      str += "🕳 ";
    }

    if ($value.coolDownBlock) {
      str += `/ burntime: ${Math.max($value.coolDownBlock - $blockNumber, 0)}`;
    }
    if ($value.resource) {
      str += ` / resources: ${$value.resource}`;
    }
    if ($value.creator) {
      str += ` / creators: ${playerList($value.creator)}`;
    }

    return str;
  });
};

export function fireStatusString(v) {
  if (Math.max(v.coolDownBlock - get(blockNumber), 0) > 0) {
    return "🔥";
  } else {
    return "🕳";
  }
}

export function fireStatusClass(v) {
  if (Math.max(v.coolDownBlock - get(blockNumber), 0) > 0) {
    return "fire fire-on";
  } else {
    return "fire fire-off";
  }
}
