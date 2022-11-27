<script lang="ts">
  import { network } from "../../../stores/network";

  function spawn() {
    $network.api?.spawn();
  }
</script>

<div class="ui-spawn">
  <button on:click={spawn}> Spawn </button>
</div>

<style>
  .ui-spawn {
    width: 100%;
    height: 100%;
    text-align: center;
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
  }
</style>
