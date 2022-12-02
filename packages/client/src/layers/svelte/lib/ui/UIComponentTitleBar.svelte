<script lang="ts">
  import { playSound } from "../../../howler";
  import { uiState } from "../../stores/ui";
  export let id;
  export let title = "";
  export let options: UIComponentOptions;
</script>

{#if !options?.bare}
  <div class="titlebar border">
    {title}

    <div>
      <button class="close" on:click={() => uiState.toggle(id, "muted")}>
        {#if options?.muted}
          {!options.muted ? "[mut]" : "[unm]"}
        {/if}
      </button>

      {#if !options?.persistent}
        <button
          class="close"
          on:click={() => {
            playSound("error", "ui");
            uiState.close(id);
          }}
        >
          [×]
        </button>
      {/if}
    </div>
  </div>
{/if}

<style>
  .titlebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: var(--padding-button);
    font-size: var(--font-size);
    color: var(--foreground);
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    backdrop-filter: var(--backdrop);
    z-index: 99;
  }

  .titlebar.border {
    border-bottom: 1px solid var(--foreground);
  }

  .close {
    all: unset;
    color: var(--foreground);
    background: var(--background);
    cursor: pointer;
  }
</style>
