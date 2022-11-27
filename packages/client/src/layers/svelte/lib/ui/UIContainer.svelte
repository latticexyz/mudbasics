<script lang="ts">
  import { uiState } from "../../stores/ui";
  import { entities } from "../../stores/entities";
  import { ready } from "../../stores/network";
  import { playerAddress } from "../../stores/player";
  import UITaskBar from "./UITaskBar.svelte";
  import UIComponent from "./UIComponent.svelte";
  import UISpawn from "./components/UISpawn.svelte";
  import UILoading from "./components/UILoading.svelte";
</script>

<div class="ui-container">
  {#if !$entities[$playerAddress]}
    <span />
  {:else}
    <UITaskBar />
  {/if}
  <div class="ui-container-inner">
    {#if !$ready}
      <UIComponent id="ui-loading" active={true} centered={true} fluid={true} bare={true}>
        <UILoading />
      </UIComponent>
    {:else if !$entities[$playerAddress]}
      <UIComponent id="ui-spawn" active={true} centered={true} fluid={true} bare={true}>
        <UISpawn />
      </UIComponent>
    {:else}
      {#each Object.values($uiState) as attrs (attrs.id)}
        {#if attrs.active}
          <UIComponent {...attrs}>
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
    background: var(--background);
    color: var(--foreground);
    padding: 24px;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: min-content 93%;
    box-sizing: border-box;
    align-items: stretch;
    gap: var(--row-gap);
  }

  .ui-container-inner {
    position: relative;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-template-rows: repeat(9, minmax(0, 1fr));
    grid-template-areas:
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
    column-gap: var(--col-gap);
    row-gap: var(--row-gap);
  }
</style>
