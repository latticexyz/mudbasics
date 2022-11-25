<script lang="ts">
  import { network } from "../../../stores/network";

  function spawn() {
    $network.api?.spawn();
  }
</script>

<div class="ui-spawn">
  <button class="rectangles" on:click={spawn}>
    Spawn<br>
    ***
  </button>
</div>

<style>
  .ui-spawn {
    width: 100%;
    height: 100%;
  }
  button {
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
    color: var(--foreground);
    font-family: var(--font-family);
    font-size: 2rem;
    text-transform: uppercase;
    font-weight: bold;
    position: relative;
  }
</style>
