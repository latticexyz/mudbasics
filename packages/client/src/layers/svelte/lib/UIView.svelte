<script lang="ts">
  import { sample } from "lodash";
  import { blockNumber } from "../stores/network";

  let currentView = "";

  const VIEWS = ["/img/view.png", "/img/view2.jpg", "/img/view3.png", "/img/view4.jpg", "/img/view5.jpg"];

  blockNumber.subscribe((newBlock) => {
    currentView = sample(VIEWS);
  });
</script>

<div class="ui-view">
  <img src={currentView} alt="View" />
</div>

<style>
  img {
    max-width: 100%;
  }
</style>
