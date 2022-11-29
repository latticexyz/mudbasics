import { initialState } from "./config";
import { writable } from "svelte/store";

// UI
export const menuVisible = writable(false);

// Transition speeds
export const speed = writable(100);
export const fragSpeed = writable(0);
export const category = writable("gluttony");

// Create custom store with simpler update methods
function createComponentState() {
  const { subscribe, set, update } = writable(initialState());

  // Update function
  const alter = (id, key, value) =>
    update((obj) => {
      const o = obj?.[id];
      if (o) {
        o[key] = value;
      }
      return obj;
    });

  const setOption = (id, key, value) =>
    update((obj) => {
      const o = obj?.[id];
      if (o) {
        o.options[key] = value;
      }
      return obj;
    });

  // Update function
  const toggle = (id, key) =>
    update((obj) => {
      const o = obj?.[id];
      if (o) {
        o[key] = !o[key];
      }
      return obj;
    });

  return {
    subscribe,
    set,
    setOption,
    // Store function
    alter,
    toggle,
    close: (id: string) => {
      alter(id, "active", false);
    },
    open: (id: string) => {
      alter(id, "active", true);
    },
    toggleMute: (id: string) => {
      toggle(id, "muted");
    },
  };
}

export const uiState = createComponentState();
