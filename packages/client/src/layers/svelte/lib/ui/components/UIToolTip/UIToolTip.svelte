<script>
	export let title;
	export let description;
	export let x;
	export let y;
</script>
<div
  class="ui-tooltip"
  style:top="{y + 5}px"
  style:left="{x + 5}px"
  >
  <div class="ui-tooltip-inner">
    {#if title && title !== 'false'}
      <div class:ui-tooltip-title={!!description}>
        {title}
      </div>
    {/if}
    {#if description}
      <div class="ui-tooltip-description">
        {description}
      </div>
    {/if}
  </div>
</div>

<style>
	.ui-tooltip {
		border: var(--outer-border);
    backdrop-filter: var(--backdrop);
		padding: var(--padding-button);
		position: absolute;
    max-width: 60ch;
    min-width: 30ch;
    pointer-events: none;
	}
  
  .ui-tooltip-title {
    border-bottom: var(--outer-border);
    padding: 6px 0;
  }

  .ui-tooltip-description {
    padding: 6px 0;
  }
</style>
