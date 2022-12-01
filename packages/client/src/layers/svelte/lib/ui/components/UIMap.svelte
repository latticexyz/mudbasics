<script lang="ts">
  import { onMount } from "svelte";
  import { entities, EntityType } from "../../../stores/entities";
  import { player, playerAddress } from "../../../stores/player";
  import { createPerlin, Perlin } from "@latticexyz/noise";

  let canvasEl: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let perlin: Perlin;

  function paintPixel(x: number, y: number, factor: number) {
    // console.log(y, x, factor);
    ctx.fillStyle =
      "rgb(" +
      [255 - Math.round(255 * factor), 255 - Math.round(255 * factor), 255 - Math.round(255 * factor)].join() +
      ")";
    ctx.fillRect(x, y, 1, 1);
  }

  onMount(async () => {
    ctx = canvasEl.getContext("2d");
    perlin = await createPerlin();

    for (let y = 0; y <= 100; y++) {
      for (let x = 0; x <= 100; x++) {
        s;
        paintPixel(x, y, perlin(x, y, 0, 20));
      }
    }
  });
</script>

<div class="ui-map">
  <div class="map-container">
    {#each Object.entries($entities) as [address, value]}
      <div
        class="marker"
        class:self={address === $playerAddress}
        class:terrain={value.entityType == EntityType.Terrain}
        class:fire={value.entityType == EntityType.Fire}
        style={"left: " +
          value.position?.x +
          "px; top: " +
          value.position?.y +
          "px; opacity: " +
          (value.entityType == EntityType.Terrain ? 1 - value.resource / 100 : 1) +
          ";"}
      />
    {/each}
    <canvas width="100" height="100" bind:this={canvasEl} />
  </div>
  {#if perlin}
    <div class="info">
      resource factor:
      <strong>
        {perlin($player.position?.x, $player.position?.y, 0, 20)}
      </strong>
      (50 energy ≈ {Math.floor(perlin($player.position?.x, $player.position?.y, 0, 20) * 50)} resources)
    </div>
  {/if}
</div>

<style>
  .ui-map {
    /* height: 320px; */
    position: relative;
  }

  .map-container {
    width: 100px;
    height: 100px;
    position: relative;
    background: #00ff00;
    transform: scale(3);
    transform-origin: top left;
  }

  .marker {
    position: absolute;
    width: 1px;
    height: 1px;
    background: green;
    z-index: 100;
  }

  .self {
    background: var(--blue);
    z-index: 1000;
  }

  .fire {
    background: orangered;
  }

  .terrain {
    position: absolute;
    width: 1px;
    height: 1px;
    background: var(--foreground);
    z-index: 99;
  }

  canvas {
    width: 100px;
    height: 100px;
    position: absolute;
    top: 0;
    left: 0;
  }

  .info {
    position: absolute;
    bottom: 10px;
    left: 10px;
    background: yellow;
  }
</style>
