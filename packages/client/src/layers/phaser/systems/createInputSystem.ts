import { pixelCoordToTileCoord } from "@latticexyz/phaserx";
import { runQuery, HasValue } from "@latticexyz/recs";
import { NetworkLayer } from "../../network";
import { PhaserLayer } from "../types";

export function createInputSystem(network: NetworkLayer, phaser: PhaserLayer) {
  const {
    world,
    scenes: {
      Main: {
        input,
        maps: {
          Main: { tileWidth, tileHeight },
        },
      },
    },
  } = phaser;

  const {
    components: { Position },
  } = network;

  const clickSub = input.click$.subscribe((p) => {
    const pointer = p as Phaser.Input.Pointer;
    const tilePos = pixelCoordToTileCoord({ x: pointer.worldX, y: pointer.worldY }, tileWidth, tileHeight);

    if (runQuery([HasValue(Position, tilePos)]).size > 0) {
      // Pick up if there is something to pick up
      network.api.pickup(tilePos);
    } else {
      // otherwise move
      network.api.move(tilePos);
    }
  });

  world.registerDisposer(() => clickSub?.unsubscribe());
}
