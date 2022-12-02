<script lang="ts">
  import { get } from "svelte/store";
  import { Coord } from "@latticexyz/recs";
  import { onMount } from "svelte";
  import { entities, Entity, EntityType } from "../../../stores/entities";
  import { Activities, player, playerActivity, playerDirection } from "../../../stores/player";
  import { blockNumber } from "../../../stores/network";
  import { createPerlin, Perlin } from "@latticexyz/noise";
  import { TerrainType, directionToString } from "../../../utils/space";
  import { seedToName, seedToMask } from "../../../utils/name";
  import { tooltip } from "./UIToolTip/index"
  import { fireString, fireStatusClass } from "./UIFires/index"

  let perlin: Perlin;
  let w: Number;
  let h: Number;
  let shortest: Number;

  function checkForType(gridPosition: Coord, type: EntityType) {
    let entity = Object.values($entities).find(
      (e) =>
        e.seed !== $player.seed &&
        (e.position?.x || 0) == gridPosition.x &&
        (e.position?.y || 0) == gridPosition.y &&
        e.entityType == type
    );
    return entity;
  }

  function perlinToTerrainType(p: number) {
    if (p < 0.4) return TerrainType.Dust;
    if (p < 0.6) return TerrainType.Debris;
    return TerrainType.Ruins;
  }

  interface GridItem {
    direction: string;
    transformation: Coord;
    coordinates: Coord;
    perlinFactor: number;
    terrain: TerrainType;
    resource: number;
    fire?: Entity | undefined;
    other?: Entity | undefined;
    corpse?: Entity | undefined;
    mined?: Entity | undefined;
  }

  let grid: GridItem[] = [];

  function initGrid() {
    for (let y = -2; y <= 2; y++) {
      for (let x = -2; x <= 2; x++) {
        let newGridItem: GridItem = {
          direction: ".",
          transformation: { x: x, y: y },
          coordinates: { x: 0, y: 0 },
          perlinFactor: 0,
          terrain: TerrainType.Dust,
          resource: 100,
        };
        grid = [...grid, newGridItem];
      }
    }
  }

  function updateGrid(centerPosition: Coord) {
    for (let i = 0; i < grid.length; i++) {
      grid[i].coordinates.x = (centerPosition?.x || 0) + grid[i].transformation.x;
      grid[i].coordinates.y = (centerPosition?.y || 0) + grid[i].transformation.y;
      grid[i].perlinFactor = perlin(grid[i].coordinates.x, grid[i].coordinates.y, 0, 20);
      grid[i].terrain = perlinToTerrainType(grid[i].perlinFactor);
      grid[i].fire = checkForType(grid[i].coordinates, EntityType.Fire);
      grid[i].other = checkForType(grid[i].coordinates, EntityType.Player);
      grid[i].corpse = checkForType(grid[i].coordinates, EntityType.Corpse);
      grid[i].mined = checkForType(grid[i].coordinates, EntityType.Terrain);
      grid[i].resource = grid[i].mined == undefined ? 100 : grid[i].mined.resource;
    }
  }

  function tileEntities(item) {
    if (item?.fire) {
      return get(fireString(item.fire));
    }

    return "";
  }

  function backgroundImageClass(tile: GridItem) {
    switch (tile.terrain) {
      case TerrainType.Dust:
        return "dust-" + (((tile.coordinates.x + tile.coordinates.y) % 4) + 1);
      case TerrainType.Debris:
        return "debris-" + (((tile.coordinates.x + tile.coordinates.y) % 4) + 1);
      case TerrainType.Ruins:
        return "ruins-" + (((tile.coordinates.x + tile.coordinates.y) % 4) + 1);
    }
  }

  function overlayClass (tile: GridItem) {
    let str = ''
    // VACANT
    if (tile.resource == 0) {
      str += "empty ";
    }
    // MINED
    if (tile.resource < 100 && tile.resource > 0) {
      str += "mined ";
    }
    // DED
    if (tile.corpse !== undefined) {
      str += "corpse ";
    }
    // FIYA
    if (tile.fire !== undefined) {
      str += `${fireStatusClass(tile.fire)} `
    }

    // SELF
    if (tile.transformation.x == 0 && tile.transformation.y == 0) {
      if ($player.entityType == EntityType.Player || $player.entityType == EntityType.Corpse) {
        str += `mask mask-${seedToMask($player.seed) } `
      }
      if ($player.entityType == EntityType.Corpse) {
        str += 'corpse '
      }
    }

    if (str !== "") {
      str += "overlay";
    }

    return str;
  }

  blockNumber.subscribe(() => {
    updateGrid($player.position);
  });

  onMount(async () => {
    perlin = await createPerlin();
    initGrid();
    updateGrid($player.position);
  });

  $: shortest = Math.min(w, h);
</script>

<div class="ui-grid-map" bind:clientWidth={w} bind:clientHeight={h}>
  <div class="grid-container overlay map" style:max-width="{shortest}px" style:max-height="{shortest}px">
    <!-- Shown if player is moving -->
    {#if $playerActivity == Activities.Moving && ($player.coolDownBlock || 0) > $blockNumber}
      <div class="cooldown-overlay">
        <div>
          <strong>{seedToName($player.seed || 0)}</strong> is moving
          <strong>{directionToString($playerDirection)}</strong>.<br />
          Some flavour text possibly.<br />
          Arriving in <strong>{($player.coolDownBlock || 0) - $blockNumber}</strong> seconds
        </div>
      </div>
    {/if}

    {#each grid as tile}
      <div
        use:tooltip={{ class: "fluid", offset: { x: 10, y: 10 } }}
        title="x:{tile.coordinates.x} y:{tile.coordinates
          .y}<br>resource: {tile.resource}<br>extraction speed: {tile.perlinFactor.toFixed(2)}"
        data-description={tileEntities(tile)}
        class="grid-tile {tile.direction} {backgroundImageClass(tile)} {overlayClass(tile)}"
      >
        <!-- OTHER -->
        {#if tile.other !== undefined}
          <div class="icon other">😈</div>
        {/if}

        <!-- MINED -->
        {#if tile.resource < 100 && tile.resource > 0}
          <div class="icon mined"></div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .ui-grid-map {
    height: 100%;
    display: flex;
    flex-wrap: column;
    justify-content: center;
    align-items: center;
  }
  .cooldown-overlay {
    position: absolute;
    width: 100%;
    background: rgba(127, 127, 127, 0.7);
    backdrop-filter: blur(5px);
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1001;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    text-align: center;
    padding: var(--font-size);
  }

  .grid-container {
    aspect-ratio: 1 / 1;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
  }

  .grid-container {
    position: relative;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    grid-template-rows: repeat(5, minmax(0, 1fr));
    height: 100%;
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
    background-image: url("../../../../../public/images/tiles/dust/1.png");
  }

  .dust-2 {
    background-image: url("../../../../../public/images/tiles/dust/2.png");
  }

  .dust-3 {
    background-image: url("../../../../../public/images/tiles/dust/3.png");
  }

  .dust-4 {
    background-image: url("../../../../../public/images/tiles/dust/4.png");
  }

  .debris-1 {
    background-image: url("../../../../../public/images/tiles/debris/1.png");
  }

  .debris-2 {
    background-image: url("../../../../../public/images/tiles/debris/2.png");
  }

  .debris-3 {
    background-image: url("../../../../../public/images/tiles/debris/3.png");
  }

  .debris-4 {
    background-image: url("../../../../../public/images/tiles/debris/4.png");
  }

  .ruins-1 {
    background-image: url("../../../../../public/images/tiles/ruins/1.png");
  }

  .ruins-2 {
    background-image: url("../../../../../public/images/tiles/ruins/2.png");
  }

  .ruins-3 {
    background-image: url("../../../../../public/images/tiles/ruins/3.png");
  }

  .ruins-4 {
    background-image: url("../../../../../public/images/tiles/ruins/4.png");
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
