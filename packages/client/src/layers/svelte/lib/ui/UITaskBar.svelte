<script lang="ts">
  import { player } from "../../stores/player"
  import { EntityType } from "../../stores/entities"
  import UISurvivalCounter from "./UISurvivalCounter.svelte";
  import UISpawn from "./components/UISpawn.svelte";
</script>

<div class="ui-taskbar">
  <div>
    {#if $player.entityType == EntityType.Corpse}
      <UISpawn />
    {:else}
      <UISurvivalCounter />
    {/if}
  </div>
</div>

<style>
  .ui-taskbar {
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    user-select: none;
    height: var(--taskbar-height);
  }
</style>
