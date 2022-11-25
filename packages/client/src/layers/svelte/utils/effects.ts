export function useRipple(node: HTMLElement, disabled: boolean) {
  if (!disabled) {
    node.addEventListener("mousemove", createRipple);
  }

  function createRipple(event: MouseEvent) {
    const circle = document.createElement("span");
    const diameter = Math.max(node.clientWidth, node.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - (node.offsetLeft + radius)}px`;
    circle.style.top = `${event.clientY - (node.offsetTop + radius)}px`;
    circle.classList.add("ripple");

    const ripple = node.getElementsByClassName("ripple")[0];

    if (ripple) {
      ripple.remove();
    }

    node.appendChild(circle);
  }
}
