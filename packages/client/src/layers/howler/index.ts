import { Howl } from "howler";
import { UI } from "./assets";

export function playSound(id: string) {
  const sound = new Howl({
    src: [UI[id].src],
    volume: UI[id].volume,
    preload: true,
  });
  sound.play();
}
