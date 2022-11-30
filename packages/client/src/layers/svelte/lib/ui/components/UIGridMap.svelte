<script lang="ts">
  import { Coord } from "@latticexyz/recs";
  import { onMount } from "svelte";
  import { entities, Entity } from "../../../stores/entities";
  import { Activities, player, playerActivity, playerDirection } from "../../../stores/player";
  import { blockNumber } from "../../../stores/network";
  import { createPerlin, Perlin } from "@latticexyz/noise";
  import { EntityType, TerrainType, directionToString } from "../../../utils/space";
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
      <div
        class="grid-item {item.direction}"
        class:dust={item.terrain === TerrainType.Dust}
        class:debris={item.terrain === TerrainType.Debris}
        class:ruins={item.terrain === TerrainType.Ruins}
      >
        <div>
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
        {#if item.resource < 100}
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
    border: 1px solid black;
    color: rgba(255, 255, 255, 1);
    font-size: 9px;
    text-align: center;
    position: relative;
  }

  .dust {
    background: rgb(205, 209, 176);
    background-image: url("../../../../../public/images/dust.png");
    background-size: cover;
  }

  .debris {
    background: rgb(167, 120, 111);
    background-image: url("../../../../../public/images/debris.png");
    background-size: cover;
  }

  .ruins {
    background: rgb(184, 87, 54);
    background-image: url("../../../../../public/images/ruins.png");
    background-size: cover;
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
