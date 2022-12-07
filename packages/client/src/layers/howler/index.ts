import { Howl } from "howler";
import { soundLibrary, Sound } from "./sound-library";
import { sample } from "lodash";
import { writable, get } from "svelte/store";
import { userSettings } from "../svelte/stores/ui";

export const music = writable(null);
export const fx = writable(null);

export function playSound(id: string, category: string, loop = false, fade = false) {
  const settings = get(userSettings);

  let timeout;

  const sound = new Howl({
    src: [soundLibrary[category][id].src],
    volume: soundLibrary[category][id].volumetrue,
    preload: true,
    loop: loop,
  });
  if (fade) {
    // Fade on begin and end
    const FADE_TIME = 2000;

    // Init
    sound.play();
    sound.fade(0, 0.4, FADE_TIME);
    sound.on("load", function () {
      const FADE_OUT_TIME = sound.duration() * 1000 - sound.seek() - FADE_TIME;
      timeout = setTimeout(function () {
        sound.fade(0.4, 0, FADE_TIME);
      }, FADE_OUT_TIME);
    });
  } else {
    sound.play();
  }
  return sound;
}

export function startEnvironmentSoundSystem() {
  const settings = get(userSettings);
  if (settings.fx.value === true) {
    music.set(playSound("workSitePlain", "environment", true));
  }
}

export function startMelodySoundSystem(timeout = 0) {
  const settings = get(userSettings);

  if (settings.music.value == true) {
    music.set(playSound(sample(Object.keys(soundLibrary.melody)), "melody"));
    get(music).on("end", () => {
      setTimeout(() => {
        startMelodySoundSystem(timeout);
      }, timeout);
    });
  }
}

export function startHarmonySoundSystem() {
  const settings = get(userSettings);

  if (settings.music.value == true) {
    music.set(playSound("organLoop", "harmony", false, true));
    get(music).on("end", () => {
      startMelodySoundSystem(30000);
    });
  }
}
