<script lang="ts">
  export let title = "";
  console.log("UIComponent");
</script>

<div class="ui-component">
  <div class="titlebar">{title}</div>
  <div class="ui-component-inner">
    <slot />
  </div>
</div>

<style>
  .ui-component {
    float: left;
    width: 24%;
    /* height: 100%; */
    /* position: absolute;
    top: 0;
    right: 0; */
    border: 1px solid #a4a4a4;
    margin: 4px;
    background: #e4e4e4;
  }

  .ui-component-inner {
    padding: 10px;
  }

  .titlebar {
    width: 100%;
    padding: 10px;
    font-size: 12px;
    background: black;
    color: red;
  }
</style>
