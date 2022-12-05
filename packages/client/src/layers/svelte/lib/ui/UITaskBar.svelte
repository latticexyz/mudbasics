<script lang="ts">
  import UISurvivalCounter from "./UISurvivalCounter.svelte";
</script>

<div class="ui-taskbar">
  <UISurvivalCounter />
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
