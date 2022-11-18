<script lang="ts">
  import { entities } from "../stores/entities";
  import { playerAddress } from "../stores/player";
  import UIComponent from "./UIComponent.svelte";
  import UISpawn from "./UISpawn.svelte";
  import UITextLog from "./UITextLog.svelte";
  import UIAvatar from "./UIAvatar.svelte";
  import UIVisualOperationsEditor from "./UIVisualOperationsEditor.svelte";
  import UIMap from "./UIMap.svelte";
  import UIGridMap from "./UIGridMap.svelte";
  import UIDebugLog from "./UIDebugLog.svelte";
  // import UIView from "./UIView.svelte";
  // import UIOperationsEditor from "./UIOperationsEditor.svelte";
  // import UIWorldStats from "./UIWorldStats.svelte";
  // import UICharacterStats from "./UICharacterStats.svelte";
</script>

<div class="ui-container">
  <div class="ui-container-inner">
    {#if !$entities[$playerAddress]}
      <!-- ***** SPAWN -->
      <UIComponent centered={true}>
        <UISpawn />
      </UIComponent>
    {:else}
      <!-- ***** AVATAR -->
      <UIComponent title="Avatar">
        <UIAvatar />
      </UIComponent>

      <!-- ***** VISUAL OPERATIONS EDITOR -->
      <UIComponent title="Visual Operations Editor" large={true}>
        <UIVisualOperationsEditor />
      </UIComponent>

      <!-- ***** TEXT LOG -->
      <UIComponent title="Text Log">
        <UITextLog />
      </UIComponent>

      <!-- ***** MAP -->
      <UIComponent title="Map">
        <UIMap />
      </UIComponent>

      <!-- ***** GRID MAP -->
      <UIComponent title="Grid Map">
        <UIGridMap />
      </UIComponent>

      <!-- ***** DEBUG LOG -->
      <UIComponent title="Debug Log">
        <UIDebugLog />
      </UIComponent>

      <!-- ***** CHARACTER STATS -->
      <!-- <UIComponent title="Character Stats">
        <UICharacterStats />
      </UIComponent> -->

      <!-- ***** VIEW -->
      <!-- <UIComponent title="View">
      <UIView />
    </UIComponent> -->

      <!-- ***** WORLD STATS -->
      <!-- <UIComponent title="World Stats">
      <UIWorldStats />
    </UIComponent> -->

      <!-- ***** OPERATIONS EDITOR -->
      <!-- <UIComponent title="Operations Editor" large={true}>
      <UIOperationsEditor />
    </UIComponent> -->
    {/if}
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
