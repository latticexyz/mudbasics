<script lang="ts">
  import { Coord } from "@latticexyz/recs";
  import { onMount } from "svelte";
  import { entities, Entity, EntityType } from "../../../stores/entities";
  import { Activities, player, playerActivity, playerDirection } from "../../../stores/player";
  import { blockNumber } from "../../../stores/network";
  import { createPerlin, Perlin } from "@latticexyz/noise";
  import { TerrainType, directionToString } from "../../../utils/space";
  import { seedToName } from "../../../utils/name";

  let perlin: Perlin;

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

  // Dust
  // 0.2
  // 0.20 - 0.25  => 1
  // 0.25 - 0.30  => 2
  // 0.30 - 0.35  => 3
  // 0.35 - 0.40  => 4

  // Debris
  // 0.4
  // 0.40 - 0.45
  // 0.45 - 0.50
  // 0.50 - 0.55
  // 0.55 - 0.60

  // Ruins
  // 0.6
  // 0.60 - 0.65
  // 0.65 - 0.70
  // 0.70 - 0.75
  // 0.75 - 0.80

  // function terrainVariation(perlinFactor: number, minValue: number) {
  //   let normalized = perlinFactor - minValue;
  //   if (normalized < 0.05) return 1;
  //   if (normalized < 0.1) return 2;
  //   if (normalized < 0.15) return 3;
  //   return 4;
  // }

  // function backgroundImageClass(tile: GridItem) {
  //   switch (tile.terrain) {
  //     case TerrainType.Dust:
  //       return "dust-" + terrainVariation(tile.perlinFactor, 0.2);
  //     case TerrainType.Debris:
  //       return "debris-" + terrainVariation(tile.perlinFactor, 0.4);
  //     case TerrainType.Ruins:
  //       return "ruins-" + terrainVariation(tile.perlinFactor, 0.6);
  //   }
  // }

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

  blockNumber.subscribe(() => {
    updateGrid($player.position);
  });

  onMount(async () => {
    perlin = await createPerlin();
    initGrid();
    updateGrid($player.position);
  });
</script>

<div class="ui-grid-map">
  <div class="grid-container">
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

    {#each grid as item}
      <div class="grid-item {item.direction} {backgroundImageClass(item)}">
        <div class="text">
          [{item.coordinates.x}:{item.coordinates.y}]<br />
          {item.resource}<br />
          {item.perlinFactor.toFixed(2)}<br />
        </div>

        <!-- SELF -->
        {#if item.transformation.x == 0 && item.transformation.y == 0}
          <div class="icon self">
            {#if $player.entityType == EntityType.Player}
              👺
            {/if}
            {#if $player.entityType == EntityType.Corpse}
              💀
            {/if}
          </div>
        {/if}

        <!-- FIRE -->
        {#if item.fire !== undefined}
          <div class="icon fire">🔥</div>
        {/if}

        <!-- OTHER -->
        {#if item.other !== undefined}
          <div class="icon other">😈</div>
        {/if}

        <!-- CORPSE -->
        {#if item.corpse !== undefined}
          <div class="icon corpse">💀</div>
        {/if}

        <!-- MINED -->
        {#if item.resource < 100 && item.resource > 0}
          <div class="icon mined">🪨</div>
        {/if}

        <!-- EMPTY -->
        {#if item.resource == 0}
          <div class="icon empty">🥡</div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .ui-grid-map {
    height: 320px;
    display: flex;
    justify-content: center;
    position: relative;
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
  }

  .grid-container {
    width: 300px;
    height: 300px;
    position: relative;
  }

  .grid-item {
    width: 60px;
    height: 60px;
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(255, 255, 255, 1);
    font-size: 9px;
    text-align: center;
    position: relative;
    background-size: cover;
  }

  .text {
    opacity: 0;
  }

  .grid-item:hover .text {
    opacity: 1;
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
    font-size: 40px;
    z-index: 100;
  }

  .self {
    z-index: 1000;
  }
</style>
