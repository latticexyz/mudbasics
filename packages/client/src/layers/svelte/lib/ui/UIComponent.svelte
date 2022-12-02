<script lang="ts">
  import UIComponentTitleBar from "./UIComponentTitleBar";
  import { UIComponentPlacement, UIComponentOptions } from "../../stores/config";
  import { fade } from "svelte/transition";
  import { uiState, speed, activeComponent } from "../../stores/ui";

  export let id: string;
  export let active: boolean = true;
  export let title: string = "";

  export let grid: UIComponentPlacement = {};
  export let options: UIComponentOptions;
  export let area: string = "";

  const handleShortcuts = ({ code }) => {
    if ($activeComponent === id) {
      if (code === 'Escape' && !options.persistent) {
        uiState.alter(id, 'active', false)
      }
    }
  }

  const handleMouseEnter = () => {
    $activeComponent = id
  }
  const handleMouseLeave = () => {
    $activeComponent = ''
  }
</script>

<svelte:window on:keydown={handleShortcuts}></svelte:window>

{#if active}
  <div
    style:z-index={options?.layer}
    class="ui-component col-{grid?.col?.[0]}-{grid?.col?.[1]} row-{grid?.row?.[0]}-{grid?.row?.[1]} {area}"
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    on:introend={() => uiState.alter(id, "delay", 0)}
    class:fluid={options?.fluid}
    class:box={!options?.bare}
    class:rectangles={!options?.bare}
    class:backed={!options?.bare}
    class:blend={options?.layer === 0}
    class:span={options?.span}
    in:fade={{ duration: $speed, delay: options?.delay }}
    out:fade={{ duration: $speed }}
  >
    <!-- Title Bar -->
    {#if !options?.bare}
      <UIComponentTitleBar {id} {title} {options} />
    {/if}

    <!-- Body -->
    <div
      class="ui-component-inner"
      class:no-padding={options?.layer === 0}
      class:no-scroll={options?.noscroll}
    >
      <!-- aaa -->
      <slot />
    </div>
  </div>
{/if}

<style>
  .ui-component {
    grid-column: auto / span 1;
    grid-row: auto / span 3;
    user-select: none;
    overflow-y: hidden;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    position: relative;
  }

  .ui-component:not(.span) {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: max-content 1fr ;
  }

  .ui-component.blend {
    mix-blend-mode: screen;
    background-blend-mode: screen;
  }

  .ui-component.backed {
    background-color: rgba(0, 0, 0, var(--muted-opacity));
    backdrop-filter: var(--backdrop);
  }

  .ui-component.box {
    border: 1px solid rgba(var(--foreground-rgb), var(--muted-opacity));
  }

  .ui-component-inner {
    padding: 10px;
    height: 100%;
    overflow-y: scroll;
  }

  .ui-component-inner.no-padding {
    padding: 0;
  }

  .ui-component-inner.no-scroll {
    overflow: hidden;
  }

  .taskbar {
    grid-area: taskbar;
  }
  .tl {
    grid-area: tl;
  }
  .tm {
    grid-area: tm;
  }
  .tr {
    grid-area: tr;
  }
  .ml {
    grid-area: ml;
  }
  .mm {
    grid-area: mm;
  }
  .mr {
    grid-area: mr;
  }
  .bl {
    grid-area: bl;
  }
  .bm {
    grid-area: bm;
  }
  .br {
    grid-area: br;
  }

  .col-1-4 {
    grid-column: 1 / 4;
  }
  .col-1-3 {
    grid-column: 1 / 3;
  }
  .col-1-2 {
    grid-column: 1 / 2;
  }

  .col-2-4 {
    grid-column: 2 / 4;
  }
  .col-2-3 {
    grid-column: 2 / 3;
  }

  .col-3-4 {
    grid-column: 3 / 4;
  }

  /* 1 */
  .row-1-2 {
    grid-row: 1 / 2;
  }
  .row-1-3 {
    grid-row: 1 / 3;
  }
  .row-1-4 {
    grid-row: 1 / 4;
  }
  .row-1-5 {
    grid-row: 1 / 5;
  }
  .row-1-6 {
    grid-row: 1 / 6;
  }
  .row-1-7 {
    grid-row: 1 / 7;
  }
  .row-1-8 {
    grid-row: 1 / 8;
  }
  .row-1-9 {
    grid-row: 1 / 9;
  }
  .row-1-10 {
    grid-row: 1 / 10;
  }
  .row-1-11 {
    grid-row: 1 / 11;
  }
  /* 2 */
  .row-2-3 {
    grid-row: 2 / 3;
  }
  .row-2-4 {
    grid-row: 2 / 4;
  }
  .row-2-5 {
    grid-row: 2 / 5;
  }
  .row-2-6 {
    grid-row: 2 / 6;
  }
  .row-2-7 {
    grid-row: 2 / 7;
  }
  .row-2-8 {
    grid-row: 2 / 8;
  }
  .row-2-9 {
    grid-row: 2 / 9;
  }
  .row-2-10 {
    grid-row: 2 / 10;
  }
  .row-2-11 {
    grid-row: 2 / 11;
  }
  /* 3 */
  .row-3-4 {
    grid-row: 3 / 4;
  }
  .row-3-5 {
    grid-row: 3 / 5;
  }
  .row-3-6 {
    grid-row: 3 / 6;
  }
  .row-3-7 {
    grid-row: 3 / 7;
  }
  .row-3-8 {
    grid-row: 3 / 8;
  }
  .row-3-9 {
    grid-row: 3 / 9;
  }
  .row-3-10 {
    grid-row: 3 / 10;
  }
  .row-3-11 {
    grid-row: 3 / 11;
  }
  /* 4 */
  .row-4-5 {
    grid-row: 4 / 5;
  }
  .row-4-6 {
    grid-row: 4 / 6;
  }
  .row-4-7 {
    grid-row: 4 / 7;
  }
  .row-4-8 {
    grid-row: 4 / 8;
  }
  .row-4-9 {
    grid-row: 4 / 9;
  }
  .row-4-10 {
    grid-row: 4 / 10;
  }
  .row-4-11 {
    grid-row: 4 / 11;
  }
  /* 5 */
  .row-5-6 {
    grid-row: 5 / 6;
  }
  .row-5-7 {
    grid-row: 5 / 7;
  }
  .row-5-8 {
    grid-row: 5 / 8;
  }
  .row-5-9 {
    grid-row: 5 / 9;
  }
  .row-5-10 {
    grid-row: 5 / 10;
  }
  .row-5-11 {
    grid-row: 5 / 11;
  }
  /* 6 */
  .row-6-7 {
    grid-row: 6 / 7;
  }
  .row-6-8 {
    grid-row: 6 / 8;
  }
  .row-6-9 {
    grid-row: 6 / 9;
  }
  .row-6-10 {
    grid-row: 6 / 10;
  }
  .row-6-11 {
    grid-row: 6 / 11;
  }
  /* 7 */
  .row-7-8 {
    grid-row: 7 / 8;
  }
  .row-7-9 {
    grid-row: 7 / 9;
  }
  .row-7-10 {
    grid-row: 7 / 10;
  }
  .row-7-11 {
    grid-row: 7 / 11;
  }
  /* 8 */
  .row-8-9 {
    grid-row: 8 / 9;
  }
  .row-8-10 {
    grid-row: 8 / 10;
  }
  .row-8-11 {
    grid-row: 8 / 11;
  }

  .mm,
  .centered {
    grid-area: mm;
    align-self: stretch;
  }

  .fluid {
    align-self: stretch;
  }

  .fluid .ui-component-inner {
    width: 100%;
    height: 100%;
  }

  /* Hide scrollbar for Chrome, Safari and Opera */
  .ui-component-inner::-webkit-scrollbar {
    display: none;
  }
</style>
