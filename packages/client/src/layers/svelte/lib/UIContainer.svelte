<script lang="ts">
  import UIComponent from "./UIComponent.svelte";
  import UITextLog from "./UITextLog.svelte";
  import UIAvatar from "./UIAvatar.svelte";
  import UIWorldStats from "./UIWorldStats.svelte";
  import UICharacterStats from "./UICharacterStats.svelte";
  import UIOperationsEditor from "./UIOperationsEditor.svelte";
</script>

<div class="ui-container">
  <div class="ui-container-inner">
    <!-- ***** AVATAR -->
    <UIComponent title="Avatar">
      <UIAvatar />
    </UIComponent>

    <!-- ***** WORLD STATS -->
    <UIComponent title="World Stats">
      <UIWorldStats />
    </UIComponent>

    <!-- ***** CHARACTER STATS -->
    <UIComponent title="Character Stats">
      <UICharacterStats />
    </UIComponent>

    <!-- ***** TEXT LOG -->
    <UIComponent title="Text Log">
      <UITextLog />
    </UIComponent>

        <!-- ***** TEXT LOG -->
        <UIComponent title="Operations Editor">
          <UIOperationsEditor />
        </UIComponent>
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
