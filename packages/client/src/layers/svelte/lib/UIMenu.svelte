<script>
  import { values } from "mobx";
  import { menuVisible, uiState } from "../stores/ui"

  const toggle = () => {
    $menuVisible = !$menuVisible
  }
  const toggleItem = (id) => {
    console.log(id)
    $uiState[id].active = !$uiState[id].active
  }
</script>


<button class="ui-button" on:click={toggle}>
  Menu
</button>

{#if $menuVisible}
  <ul class="ui-menu">
    {#each Object.values($uiState) as item (item.id)}
      {#if !item.persistent}
        <li
          on:click={() => {toggleItem(item.id)}}>
          [{item.active ? 'x' : '/'}] {item.title}
        </li>
      {/if}
    {/each}
  </ul>
{/if}

<style>
  .ui-button {
    all: unset;
    box-sizing: border-box;
    border-width: 1px;
    border-style: solid;
    height: 2.5rem;
    padding: 0 1rem;
    /* height: auto; */
    cursor: pointer;
    font-weight: bold;
  }

  .ui-menu {
    all: unset;
    position: fixed;
    top: 4rem;
    left: 1rem;
    background: var(--background);
    cursor: pointer;
    list-style-type: none;
    z-index: 999;
    border-width: 1px;
    border-style: solid;
    padding: 8px 12px;
    font-weight: bold;
    width: 256px;
    height: 256px;
  }
</style>