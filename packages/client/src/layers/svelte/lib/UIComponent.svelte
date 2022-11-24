<script lang="ts">
  import { createEventDispatcher } from "svelte"
  // import { useRipple } from "../utils/effects"
  const dispatch = createEventDispatcher()

  export let title = "";
  export let area = ""
  export let rowStart = 1
  export let rowEnd = 9
  export let colStart = 1
  export let colEnd = 2
  export let large = false;
  export let persistent = false // no option to close
  export let centered = false;
  export let fluid = false
  export let bare = false
  export let layer = 1

  let rippleEnabled = bare

  const close = () => dispatch('close')
</script>

<div
  class="ui-component {area || `col-${colStart}-${colEnd} row-${rowStart}-${rowEnd}`}"
  style:z-index={layer}
  class:large
  class:centered
  class:fluid
  class:box={!bare}
  class:rectangles={!bare}
  class:backed={!bare}
>
  {#if !bare}
    <div class="titlebar" class:border={!bare}>
      {#if title}
        {title}
      {/if}

      {#if !persistent}
        <button class="close" on:click={close}>
          ×
        </button>
      {/if}
    </div>
  {/if}
  <div
    class="ui-component-inner">
    <slot />
  </div>
</div>

<style>
  .ui-component {
    grid-column: auto / span 1;
    grid-row: auto / span 3;
    user-select: none;
    overflow-y: scroll;
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
    position: relative;
  }

  .ui-component.backed {
    background-color: rgba(0,0,0,0.7);
  }

  .ui-component.box {
    border: 1px solid var(--foreground);
  }

  .ui-component-inner {
    padding: 10px;
  }

  .titlebar {
    width: 100%;
    padding: 10px;
    font-size: 12px;
    /* background: var(--foreground); */
    color: var(--foreground);
    font-weight: bold;
    display: flex;
    justify-content: space-between;
  }

  .titlebar.border {
    border-bottom: 1px solid var(--foreground);
  }

  .close {
    all: unset;
    color: var(--foreground);
    background: var(--background);
    padding: 0 calc(var(--row-gap) * 0.5);
    border: 1px solid var(--foreground);
    cursor: pointer;
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
