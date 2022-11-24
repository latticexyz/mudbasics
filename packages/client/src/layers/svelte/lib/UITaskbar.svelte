<script lang="ts">
  import UIMenu from "./UIMenu.svelte"
  import UIClock from "./UIClock.svelte"
</script>

<div class="ui-taskbar">
  <UIMenu />
  <UIClock />
</div>

<style>
  .ui-taskbar {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 calc(var(--col-gap) * -0.5);
    user-select: none;
  }
</style>