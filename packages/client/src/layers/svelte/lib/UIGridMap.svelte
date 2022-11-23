<script lang="ts">
  import { Coord } from "@latticexyz/recs";
  import { onMount } from "svelte";
  import { entities } from "../stores/entities";
  import { playerAddress } from "../stores/player";
  import { createPerlin, Perlin } from "@latticexyz/noise";
  import { EntityType } from "../utils/space";

  let perlin: Perlin;

  interface GridItem {
    name: string;
    direction: string;
    transformation: Coord;
    coordinates: Coord;
    perlinFactor: number;
    fire: boolean;
  }

  let grid: GridItem[] = [];

  function initGrid() {
    for (let y = -2; y <= 2; y++) {
      for (let x = -2; x <= 2; x++) {
        let newGridItem: GridItem = {
          name: "-",
          direction: ".",
          transformation: { x: x, y: y },
          coordinates: { x: 0, y: 0 },
          perlinFactor: 0,
          fire: false,
        };
        grid = [...grid, newGridItem];
      }
    }
  }

  function updateGrid(centerPosition: Coord) {
    for (let i = 0; i < grid.length; i++) {
      grid[i].coordinates.x = centerPosition.x + grid[i].transformation.x;
      grid[i].coordinates.y = centerPosition.y + grid[i].transformation.y;
      grid[i].perlinFactor = perlin(grid[i].coordinates.x, grid[i].coordinates.y, 0, 20);
      let fireEntity = Object.values($entities).find(
        (e) =>
          e.position.x == grid[i].coordinates.x &&
          e.position.y == grid[i].coordinates.y &&
          e.entityType == EntityType.Fire
      );
      grid[i].fire = fireEntity;
    }
  }

  entities.subscribe((value) => {
    if (perlin) {
      updateGrid(value[$playerAddress].position);
    }
  });

  onMount(async () => {
    perlin = await createPerlin();
    initGrid();
    updateGrid($entities[$playerAddress].position);
  });
</script>

<div class="ui-grid-map">
  <div class="grid-container">
    {#each grid as item}
      <div
        class="grid-item {item.direction}"
        class:fire={item.fire}
        style={"background-color: rgba(0,0,0," + item.perlinFactor + ");"}
      >
        <div>
          <strong>{item.name}</strong> <br />
          [{item.coordinates.x}:{item.coordinates.y}] <br />
          {item.perlinFactor.toFixed(2)}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .ui-grid-map {
    height: 320px;
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
    border: 1px solid red;
    color: white;
    font-size: 9px;
    text-align: center;
  }

  .fire {
    background-color: orangered !important;
  }
</style>
