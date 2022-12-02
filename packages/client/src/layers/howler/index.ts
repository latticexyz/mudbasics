import { Howl } from "howler";
import { soundLibrary, Sound } from "./sound-library";
import { sample } from "lodash";

export function playSound(id: string, category: string, loop = false) {
  // console.log(soundLibrary)
  // console.log('category', category)
  // console.log('id', id)
  // console.log(soundLibrary[category][id])
  const sound = new Howl({
    src: [soundLibrary[category][id].src],
    volume: soundLibrary[category][id].volume,
    preload: true,
    loop: loop,
  });
  sound.play();
  return sound;
}

export function startEnvironmentSoundSystem() {
  playSound("workSitePlain", "environment", true);
}

export function startMelodySoundSystem() {
  const melodySound = playSound(sample(Object.keys(soundLibrary.melody)), "melody");
  melodySound.on("end", () => {
    console.log("ended");
    startMelodySoundSystem();
  });
}

export function startHarmonySoundSystem() {
  // sample(Object.keys(soundLibrary.harmony))
  const harmonySound = playSound("organLoop", "harmony");
  harmonySound.fade(0, 0.4, 10000);
  // harmonySound.on("end", () => {
  //   console.log("ended")
  //   startHarmonySoundSystem()
  // })
}
