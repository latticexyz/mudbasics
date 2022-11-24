<script lang="ts">
  import { network } from "../stores/network";

  function spawn() {
    $network.api?.spawn();
  }
</script>

<div class="ui-spawn">
  <button on:click={spawn}>Spawn</button>
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
  }
</style>
