<script lang="ts">
  import { uiState } from "../stores/ui";
  import { entities } from "../stores/entities";
  import { playerAddress } from "../stores/player";
  import UIComponent from "./UIComponent.svelte";
  import UISpawn from "./UISpawn.svelte";

</script>

<div class="ui-container">
  <div class="ui-container-inner">
    {#if !$entities[$playerAddress]}
      <!-- ***** SPAWN -->
      <UIComponent centered={true}>
        <UISpawn />
      </UIComponent>
    {:else}
      {#each $uiState as { title, component, id, active } (id)}
        {#if active}
          <!-- ***** AVATAR -->
          <UIComponent {title}>
            <svelte:component this={component} />
          </UIComponent>
        {/if}
      {/each}
    {/if}
  </div>
</div>

<style>
  .ui-container {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: red;
  }

  .ui-container-inner {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
