<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fade } from "svelte/transition";

  export let title: string;
  export let description: string;
  export let x: number;
  export let y: number;

  let timeout = null;
  let show = false;

  onMount(() => {
    show = true;
    // timeout = setTimeout(() => {
    //   show = true;
    // }, 0);
  });

  // onDestroy(() => clearTimeout(timeout));
</script>

{#if show}
  <div transition:fade={{ duration: 150 }} class="ui-tooltip" style:top="{y + 5}px" style:left="{x + 5}px">
    <div class="ui-tooltip-inner">
      {#if title && title !== "false"}
        <div class:ui-tooltip-title={!!description}>
          {@html title}
        </div>
      {/if}
      {#if description}
        <div class="ui-tooltip-description">
          {@html description}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .ui-tooltip {
    border: var(--outer-border);
    backdrop-filter: var(--backdrop);
    padding: var(--padding-button);
    position: absolute;
    max-width: 60ch;
    min-width: 30ch;
    pointer-events: none;
  }

  .ui-tooltip-title {
    border-bottom: var(--outer-border);
    padding: 6px 0;
  }

  .ui-tooltip-description {
    padding: 6px 0;
  }
</style>
