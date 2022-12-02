import UITooltip from "./UIToolTip.svelte";

export interface UIToolTipOptions {
  class?: string;
  offset?: { x: number; y: number };
}

export function tooltip(node: HTMLElement, options: UIToolTipOptions = { class: "", offset: { x: 10, y: 10 } }) {
  let title: string;
  let description: string;
  let tooltipComponent;

  function mouseEnter(event) {
    // NOTE: remove the `title` attribute, to prevent showing the default browser tooltip
    // remember to set it back on `mouseleave`
    title = node.getAttribute("title");
    description = node.dataset.description;
    node.removeAttribute("title");

    tooltipComponent = new UITooltip({
      props: {
        classes: options?.class,
        title: title ? title : false,
        description: description ? description : false,
        x: event.pageX + options.offset.x,
        y: event.pageY + options.offset.y,
      },
      target: document.body,
    });
  }

  function mouseMove(event) {
    tooltipComponent.$set({
      x: event.pageX + options.offset.x,
      y: event.pageY + options.offset.y,
    });
  }
  function mouseLeave() {
    tooltipComponent.$destroy();
    node.setAttribute("title", title);
  }

  node.addEventListener("mouseenter", mouseEnter);
  node.addEventListener("mouseleave", mouseLeave);
  node.addEventListener("mousemove", mouseMove);

  return {
    destroy() {
      node.removeEventListener("mouseenter", mouseEnter);
      node.removeEventListener("mouseleave", mouseLeave);
      node.removeEventListener("mousemove", mouseMove);
    },
  };
}
