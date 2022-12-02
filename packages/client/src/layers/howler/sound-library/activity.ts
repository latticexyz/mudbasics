import { SoundAssets } from ".";

const BASE_VOLUME = 0.7;

export const activity: SoundAssets = {
  digging: {
    src: "/sounds/activity/digging.mp3",
    volume: BASE_VOLUME,
  },
  eating: {
    src: "/sounds/activity/eating.mp3",
    volume: BASE_VOLUME,
  },
  idle: {
    src: "/sounds/activity/idle.mp3",
    volume: 0.3,
  },
  walking: {
    src: "/sounds/activity/walking.mp3",
    volume: BASE_VOLUME,
  },
};
