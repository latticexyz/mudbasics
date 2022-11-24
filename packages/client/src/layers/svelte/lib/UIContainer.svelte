<script lang="ts">
  import { uiState } from "../stores/ui";
  import { entities } from "../stores/entities";
  import { playerAddress } from "../stores/player";
  import UITaskBar from "./UITaskBar.svelte";
  import UIComponent from "./UIComponent.svelte";
  import UISpawn from "./UISpawn.svelte";

  const close = (id: string) => {
    // 2
    $uiState[id].active = false
  }
</script>

<div class="ui-container">
  <div class="ui-container-inner">
    {#if !$entities[$playerAddress]}
      <UIComponent
        centered={true}
        fluid={true}
        bare={true}
      >
        <!-- ***** SPAWN -->
        <UISpawn />
      </UIComponent>
    {:else}
      <!-- ***** TASKBAR -->
      <UITaskBar />

      {#each Object.values($uiState) as attrs (attrs.id)}
        {#if attrs.active}
          <UIComponent
            on:close={() => close(attrs.id)}
            {...attrs}
          >
            <svelte:component this={attrs.component} />
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
    padding: 1rem;
  }

  .ui-container-inner {
    position: relative;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-template-rows: min-content repeat(9, 1fr);
    grid-template-areas:
    "taskbar taskbar taskbar"
    "tl tm tr"
    "tl tm tr"
    "tl tm tr"
    "ml mm mr"
    "ml mm mr"
    "ml mm mr"
    "bl bm br"
    "bl bm br"
    "bl bm br";
    align-items: start;
    gap: 0.5rem;
  }
</style>
