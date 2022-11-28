<script>
  import { player } from "../../stores/player";
  import { menuVisible, uiState } from "../../stores/ui";
  import { fade } from "svelte/transition";
  import { speed, fragSpeed } from "../../stores/ui";

  const toggle = () => {
    $menuVisible = !$menuVisible;
  };
</script>

{#if $player}
  <div class="ui-menu-container" class:open={$menuVisible}>
    <button class="ui-button" on:click={toggle}> Menu </button>

    {#if $menuVisible}
      <ul class="ui-menu">
        {#each Object.values($uiState) as item, i (item.id)}
          {#if !item.options.persistent}
            <li
              in:fade={{ duration: $speed + $fragSpeed * i }}
              class="ui-menu-item"
              on:click={() => {
                uiState.toggle(item.id, "active");
              }}
            >
              [{item.active ? "x" : "/"}] {item.title}
            </li>
          {/if}
        {/each}
      </ul>
    {/if}
  </div>
{/if}

<style>
  .ui-menu-container {
    position: fixed;
    top: var(--row-gap);
    left: var(--row-gap);
    border: var(--outer-border);
    z-index: 9;
    transition: all 0.3s ease;
    height: var(--taskbar-height);
    width: 56px;
    /* background-color: rgba(var(--background-rgb), var(--muted-opacity)); */
    backdrop-filter: var(--backdrop);
    user-select: none;
  }
  .ui-menu-container.open {
    width: 256px;
    height: 256px;
    /* position: fixed; */
  }

  .ui-button {
    all: unset;
    box-sizing: border-box;
    padding: var(--padding-button);
    /* height: auto; */
    cursor: pointer;
    font-weight: bold;
  }

  .ui-menu {
    all: unset;
    display: block;
    cursor: pointer;
    list-style-type: none;
    z-index: 999;
    padding: var(--padding-button);
    font-weight: bold;
    overflow-x: hidden;
  }

  .ui-menu-item {
    white-space: nowrap;
  }
</style>
