<script lang="ts">
  import UIClock from "./UIClock.svelte"
</script>

<div class="ui-taskbar">
  <UIClock />
</div>

<style>
  .ui-taskbar {
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 0 calc(var(--col-gap) * -0.5);
    user-select: none;
    height: var(--taskbar-height);
  }
</style>