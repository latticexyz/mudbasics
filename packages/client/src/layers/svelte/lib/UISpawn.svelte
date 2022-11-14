<script lang="ts">
  import { network } from "../stores/network";

  function spawn() {
    $network.api?.spawn();
  }
</script>

<div class="ui-spawn">
  <div class="spawn">
    <button on:click={spawn}>Spawn</button>
  </div>
</div>

<style>
  button {
    display: block;
    width: 100%;
    height: 200px;
    cursor: pointer;
  }
</style>
