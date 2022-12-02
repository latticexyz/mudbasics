<script lang="ts">
  import { playSound } from "../../../../howler";
  import { network } from "../../../stores/network";

  let spawning = false;

  function spawn() {
    playSound("eventGood", "ui");
    spawning = true;
    $network.api?.spawn();
  }
</script>

<div class="ui-spawn">
  {#if spawning}
    <div>Spawning...</div>
  {:else}
    <button on:click={spawn}>Spawn</button>
  {/if}
</div>

<style>
  .ui-spawn {
    width: 100%;
    height: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  button {
    display: block;
    cursor: pointer;
    color: var(--foreground);
    font-family: var(--font-family);
    text-transform: uppercase;
    font-weight: bold;
    position: relative;
    padding: 10px;
    background: transparent;
    border: 1px solid white;
  }
</style>
