<script lang="ts">
  import { onMount } from "svelte";
  import { entities } from "../stores/entities";
  import { playerAddress } from "../stores/player";
  import { createPerlin, Perlin } from "@latticexyz/noise";
  import { EntityType } from "../utils/space";

  let perlin: Perlin;

  interface Coord {
    x: number;
    y: number;
  }

  interface GridItem {
    name: string;
    direction: string;
    transformation: Coord;
    coordinates: Coord;
    perlinFactor: number;
    fire: boolean;
  }

  const grid: GridItem[] = [
    {
      name: "NW",
      direction: "north-west",
      transformation: { x: -1, y: -1 },
      coordinates: { x: 0, y: 0 },
      perlinFactor: 1,
      fire: false,
    },
    {
      name: "N",
      direction: "north",
      transformation: { x: 0, y: -1 },
      coordinates: { x: 0, y: 0 },
      perlinFactor: 1,
      fire: false,
    },
    {
      name: "NE",
      direction: "north-east",
      transformation: { x: 1, y: -1 },
      coordinates: { x: 0, y: 0 },
      perlinFactor: 1,
      fire: false,
    },
    {
      name: "W",
      direction: "west",
      transformation: { x: -1, y: 0 },
      coordinates: { x: 0, y: 0 },
      perlinFactor: 1,
      fire: false,
    },
    {
      name: "👺",
      direction: "player",
      transformation: { x: 0, y: 0 },
      coordinates: { x: 0, y: 0 },
      perlinFactor: 1,
      fire: false,
    },
    {
      name: "E",
      direction: "east",
      transformation: { x: 1, y: 0 },
      coordinates: { x: 0, y: 0 },
      perlinFactor: 1,
      fire: false,
    },
    {
      name: "SW",
      direction: "south-west",
      transformation: { x: -1, y: 1 },
      coordinates: { x: 0, y: 0 },
      perlinFactor: 1,
      fire: false,
    },
    {
      name: "s",
      direction: "south",
      transformation: { x: 0, y: 1 },
      coordinates: { x: 0, y: 0 },
      perlinFactor: 1,
      fire: false,
    },
    {
      name: "SE",
      direction: "south-east",
      transformation: { x: 1, y: 1 },
      coordinates: { x: 0, y: 0 },
      perlinFactor: 1,
      fire: false,
    },
  ];

  function updateGrid(centerPosition) {
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
    console.log(value);
    if (perlin) {
      updateGrid(value[$playerAddress].position);
    }
  });

  onMount(async () => {
    perlin = await createPerlin();
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
    width: 240px;
    height: 240px;
    position: relative;
  }

  .grid-item {
    width: 80px;
    height: 80px;
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid red;
    color: white;
    font-size: 10px;
    text-align: center;
  }

  .fire {
    background-color: orangered !important;
  }
</style>
