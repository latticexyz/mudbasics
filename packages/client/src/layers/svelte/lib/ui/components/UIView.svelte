<script lang="ts">
  import { sample } from "lodash";
  import { blockNumber } from "../../../stores/network";

  let currentView = "";

  const VIEWS = ["/images/view.png", "/images/view2.jpg", "/images/view3.png", "/images/view4.jpg", "/images/view5.jpg"];

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
