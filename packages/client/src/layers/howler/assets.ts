export interface Sound {
  src: string;
  volume: number;
}

interface SoundAssets {
  [index: string]: Sound;
}

export const UI: SoundAssets = {
  bell: {
    src: "/sounds/test.wav",
    volume: 0.5,
  },
};
