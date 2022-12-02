import { ui } from "./ui";
import { play } from "./play";
import { misc } from "./misc";
import { melody } from "./melody";
import { harmony } from "./harmony";
import { activity } from "./activity";
import { environment } from "./environment";

export interface Sound {
  src: string;
  volume: number;
}

export interface SoundAssets {
  [index: string]: Sound;
}

interface soundLibrary {
  [index: string]: SoundAssets;
}

export const soundLibrary = {
  ui,
  play,
  misc,
  melody,
  harmony,
  activity,
  environment,
};
