<script lang="ts">
  import { network } from "../stores/network";

  let userName = "";

  function spawn() {
    $network.api?.spawn(userName);
  }
</script>

<div class="ui-spawn">
  <div class="spawn">
    <input type="text" bind:value={userName} />
    <button on:click={spawn}>Spawn</button>
  </div>
</div>

<style>
  button {
    margin-bottom: 10px;
    display: block;
    margin-right: 5px;
  }

  input[type="text"] {
    margin-bottom: 10px;
  }
</style>
