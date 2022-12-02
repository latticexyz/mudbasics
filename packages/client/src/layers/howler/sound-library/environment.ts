import { SoundAssets } from ".";

const BASE_VOLUME = 0.3;

export const environment: SoundAssets = {
  drone: {
    src: "/sounds/environment/drone.mp3",
    volume: BASE_VOLUME,
  },
  fire: {
    src: "/sounds/environment/fire.mp3",
    volume: BASE_VOLUME,
  },
  quiet: {
    src: "/sounds/environment/quiet.mp3",
    volume: BASE_VOLUME,
  },
  stormy: {
    src: "/sounds/environment/stormy.mp3",
    volume: BASE_VOLUME,
  },
  workSiteFire: {
    src: "/sounds/environment/work-site-fire.mp3",
    volume: BASE_VOLUME,
  },
  workSitePlain: {
    src: "/sounds/environment/work-site-plain.mp3",
    volume: BASE_VOLUME,
  },
  workSiteRain: {
    src: "/sounds/environment/work-site-rain.mp3",
    volume: BASE_VOLUME,
  },
};
