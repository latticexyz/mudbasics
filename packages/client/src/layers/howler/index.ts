import { Howl } from "howler";
import { soundLibrary, Sound } from "./sound-library";
import { sample } from "lodash";

export function playSound(id: string, category: string, loop = false, fade = false) {
  let timeout;
  // console.log(soundLibrary)
  // console.log('category', category)
  // console.log('id', id)
  // console.log(soundLibrary[category][id])
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
  playSound("workSitePlain", "environment", true);
}

export function startMelodySoundSystem(timeout = 0) {
  const melodySound = playSound(sample(Object.keys(soundLibrary.melody)), "melody");
  melodySound.on("end", () => {
    setTimeout(startMelodySoundSystem, timeout);
  });
}

export function startHarmonySoundSystem() {
  const harmonySound = playSound("organLoop", "harmony", false, true);
  harmonySound.on("end", () => {
    startMelodySoundSystem(30000);
  });
}
