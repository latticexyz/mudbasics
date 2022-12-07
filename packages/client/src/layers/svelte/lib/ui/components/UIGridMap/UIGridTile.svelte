<script lang="ts">
  import { get } from "svelte/store";
  import { GridTile, TileOverlays } from "./index.ts";
  import { TerrainType, terrainTypeToString, directionToString } from "../../../../utils/space";
  import { player } from "../../../../stores/player";
  import { entities, Entity, EntityType } from "../../../../stores/entities";
  import { seedToName, seedToMaskTileOverlay } from "../../../../utils/name";
  import { tooltip } from "../UIToolTip/index";
  import { fireString, fireStatusClass } from "../UIFires/index";

  export let tile: GridTile;

  let overlays = [];

  function tileEntities(tile: GridTile) {
    let str = ''
    if (tile?.fire) {
      str += `${get(fireString(tile.fire))}<br>`;
    }
    if (tile?.other) {
      str += `${seedToName(tile.other.seed)}<br>`;
    }
    if (isPlayerTile(tile)) {
      str += `You: ${seedToName($player.seed || 0)}<br>`;
    }
    return str;
  }

  function backgroundImageClass(tile: GridTile) {
    switch (tile.terrain) {
      case TerrainType.Dust:
        return "dust-" + (((tile.coordinates.x + tile.coordinates.y) % 4) + 1);
      case TerrainType.Debris:
        return "debris-" + (((tile.coordinates.x + tile.coordinates.y) % 4) + 1);
      case TerrainType.Ruins:
        return "ruins-" + (((tile.coordinates.x + tile.coordinates.y) % 4) + 1);
    }
  }

  function isPlayerTile (tile: GridTile) {
    return tile.transformation.x == 0 && tile.transformation.y == 0 && ($player.entityType == EntityType.Player || $player.entityType == EntityType.Corpse)
  }
  

  const conditions = [
    // Mined
    (tile: GridTile) => (tile.resource == 0 ? TileOverlays.Empty : null),
    (tile: GridTile) => (tile.resource < 33 && tile.resource > 0 ? TileOverlays.Depleted : null),
    (tile: GridTile) => (tile.resource < 66 && tile.resource >= 33 ? TileOverlays.Extracted : null),
    (tile: GridTile) => (tile.resource < 100 && tile.resource >= 66 ? TileOverlays.Dug : null),
    // Other player
    (tile: GridTile) =>
    tile.other !== undefined ? `${TileOverlays.Other} ${seedToMaskTileOverlay(tile.other?.seed || 0)}` : null,
    // Player
    (tile: GridTile) => {
      if (isPlayerTile(tile)) {
        return `${TileOverlays.Player} ${seedToMaskTileOverlay($player.seed || 0)} ${$player.entityType == EntityType.Corpse ? TileOverlays.CorpseMask : ''}`;
      }
    },
    // Player corpse
    (tile: GridTile) => {
      if (tile.transformation.x == 0 && tile.transformation.y == 0 && ($player.entityType == EntityType.Corpse)) {
          return TileOverlays.Corpse
      }
    },
    // Corpse
    (tile: GridTile) => (tile.corpse !== undefined ? TileOverlays.Corpse : null),
    // Fire
    (tile: GridTile) => (tile.fire !== undefined ? fireStatusClass(tile.fire) : null),
  ];

  $: overlays = [...conditions.map((c) => c(tile)).filter((o) => !!o)]
</script>

<div
  use:tooltip={{
    class: "fluid", offset: { x: 10, y: 10 }
  }}
  title="
    {terrainTypeToString(tile.terrain)}<br>
    x:{tile.coordinates.x} y:{tile.coordinates.y}<br>
    sludge: {tile.resource}<br>
    extraction speed: {tile.perlinFactor.toFixed(2)}
  "
  data-description={tileEntities(tile)}
  class="grid-tile {tile.direction} {backgroundImageClass(tile)}"
>
  {#each overlays as overlay, i (i)}
    <div class="tile-overlay {overlay}" style:z-index={i} />
  {/each}
</div>

<style>
  .tile-overlay {
    width: 100%;
    height: 100%;
    pointer-events: none;
    background-size: contain;
    background-position: center;
    position: absolute;
  }

  .tile-overlay.empty {
    background-image: url("../../../../../../public/images/tiles/overlays/empty.png");
  }

  .tile-overlay.corpse {
    background-image: url("../../../../../../public/images/tiles/overlays/corpse.png");
  }

  .tile-overlay.mined-1 {
    background-image: url("../../../../../../public/images/tiles/overlays/mined-1.png");
  }

  .tile-overlay.mined-2 {
    background-image: url("../../../../../../public/images/tiles/overlays/mined-2.png");
  }

  .tile-overlay.mined-3 {
    background-image: url("../../../../../../public/images/tiles/overlays/mined-3.png");
  }

  .tile-overlay.map {
    background-image: url("../../../../../../public/images/tiles/overlays/map.png");
    mix-blend-mode: multiply;
  }

  .tile-overlay.mask.corpse {
    filter: grayscale(1);
    /* background-image: url("../../../../../../public/images/masks/0.png"); */
  }
  .tile-overlay.mask.mask-0 {
    background-image: url("../../../../../../public/images/masks/0.png");
  }
  .tile-overlay.mask.mask-1 {
    background-image: url("../../../../../../public/images/masks/1.png");
  }
  .tile-overlay.mask.mask-2 {
    background-image: url("../../../../../../public/images/masks/2.png");
  }
  .tile-overlay.mask.mask-3 {
    background-image: url("../../../../../../public/images/masks/3.png");
  }
  .tile-overlay.fire.fire-on {
    background-image: url("../../../../../../public/images/fire/on.gif");
  }
  .tile-overlay.fire.fire-off {
    background-image: url("../../../../../../public/images/fire/off.png");
  }

  .grid-tile {
    aspect-ratio: 1 / 1;
    max-width: 100%;
    max-height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(255, 255, 255, 1);
    font-size: 9px;
    text-align: center;
    position: relative;
    background-size: cover;
    cursor: pointer;
  }

  .text {
    opacity: 0;
  }

  .dust-1 {
    background-image: url("../../../../../../public/images/tiles/dust/1.png");
  }

  .dust-2 {
    background-image: url("../../../../../../public/images/tiles/dust/2.png");
  }

  .dust-3 {
    background-image: url("../../../../../../public/images/tiles/dust/3.png");
  }

  .dust-4 {
    background-image: url("../../../../../../public/images/tiles/dust/4.png");
  }

  .debris-1 {
    background-image: url("../../../../../../public/images/tiles/debris/1.png");
  }

  .debris-2 {
    background-image: url("../../../../../../public/images/tiles/debris/2.png");
  }

  .debris-3 {
    background-image: url("../../../../../../public/images/tiles/debris/3.png");
  }

  .debris-4 {
    background-image: url("../../../../../../public/images/tiles/debris/4.png");
  }

  .ruins-1 {
    background-image: url("../../../../../../public/images/tiles/ruins/1.png");
  }

  .ruins-2 {
    background-image: url("../../../../../../public/images/tiles/ruins/2.png");
  }

  .ruins-3 {
    background-image: url("../../../../../../public/images/tiles/ruins/3.png");
  }

  .ruins-4 {
    background-image: url("../../../../../../public/images/tiles/ruins/4.png");
  }

  .icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    font-size: 4vw;
    z-index: 100;
  }

  .self {
    z-index: 1000;
  }
</style>
