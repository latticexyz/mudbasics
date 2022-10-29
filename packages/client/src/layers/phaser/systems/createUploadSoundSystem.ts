import { defineComponentSystem } from "@latticexyz/recs";
import { NetworkLayer } from "../../network";

export function createUploadSoundSystem(network: NetworkLayer, context) {
  const {
    world,
  } = context;

  const {
    components: { SoundUri },
  } = network;

  defineComponentSystem(world, SoundUri, (update) => {
    const soundUri = update.value[0];
    // TODO: Set flag to delete a sound

    // if (!position) {
    //   objectPool.remove(update.entity);
    //   // Position got removed
    //   return;
    // }

    // const object = objectPool.get(update.entity, "Sprite");
    // const { x, y } = tileCoordToPixelCoord(position, tileWidth, tileHeight);
    // const sprite = config.sprites[Sprites.Donkey];

    // object.setComponent({
    //   id: Position.id,
    //   once: (gameObject) => {
    //     gameObject.setTexture(sprite.assetKey, sprite.frame);
    //     gameObject.setPosition(x, y);
    //   },
    // });
  });
}
