<script lang="ts">
  import UIComponent from "./UIComponent.svelte";
  import UITextLog from "./UITextLog.svelte";
  import UIDebugLog from "./UIDebugLog.svelte";
  import UIAvatar from "./UIAvatar.svelte";
  import UIWorldStats from "./UIWorldStats.svelte";
  import UICharacterStats from "./UICharacterStats.svelte";
  import UIOperationsEditor from "./UIOperationsEditor.svelte";
  import UIVisualOperationsEditor from "./UIVisualOperationsEditor.svelte";
  // import UIMap from "./UIMap.svelte";
  // import UIView from "./UIView.svelte";
</script>

<div class="ui-container">
  <div class="ui-container-inner">
    <!-- ***** AVATAR -->
    <UIComponent title="Avatar">
      <UIAvatar />
    </UIComponent>

    <!-- ***** TEXT LOG -->
    <UIComponent title="Text Log">
      <UITextLog />
    </UIComponent>

    <!-- ***** CHARACTER STATS -->
    <UIComponent title="Character Stats">
      <UICharacterStats />
    </UIComponent>

    <!-- ***** VIEW -->
    <!-- <UIComponent title="View">
      <UIView />
    </UIComponent> -->

    <!-- ***** WORLD STATS -->
    <UIComponent title="World Stats">
      <UIWorldStats />
    </UIComponent>

    <!-- ***** VISUAL OPERATIONS EDITOR -->
    <UIComponent title="Visual Operations Editor" large={true}>
      <UIVisualOperationsEditor />
    </UIComponent>

    <!-- ***** OPERATIONS EDITOR -->
    <!-- <UIComponent title="Operations Editor" large={true}>
      <UIOperationsEditor />
    </UIComponent> -->

    <!-- ***** TEXT LOG -->
    <UIComponent title="Debug Log">
      <UIDebugLog />
    </UIComponent>

    <!-- ***** MAP -->
    <!-- <UIComponent title="Map">
      <UIMap />
    </UIComponent> -->
  </div>
</div>

<style>
  .ui-container {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background: red;
  }

  .ui-container-inner {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
