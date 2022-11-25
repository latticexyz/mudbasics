import { writable } from "svelte/store";

// Components
import UITextLog from "../lib/UITextLog.svelte";
import UIAvatar from "../lib/UIAvatar.svelte";
import UIVisualOperationsEditor from "../lib/UIVisualOperationsEditor.svelte";
import UIMap from "../lib/UIMap.svelte";
import UIGridMap from "../lib/UIGridMap.svelte";
import UIView from "../lib/UIView.svelte";
import UIDebugLog from "../lib/UIDebugLog.svelte";

// Utilities
const makeDelay = () => 200 + Math.floor(Math.random() * 2000);

// UI
export const menuVisible = writable(false);

// Transition speeds
export const speed = writable(100);
export const fragSpeed = writable(140);

const initialState = () => ({
  avatar: {
    id: "avatar",
    title: "Avatar",
    component: UIAvatar,
    active: true,
    fluid: true,
    bare: true,
    persistent: true,
    colStart: 2,
    colEnd: 3,
    rowStart: 1,
    rowEnd: 10,
    layer: 0,
    delay: makeDelay(),
  },
  "visual-operations-editor": {
    id: "visual-operations-editor",
    muted: true,
    title: "Visual Operations Editor",
    component: UIVisualOperationsEditor,
    active: true,
    colStart: 1,
    colEnd: 3,
    rowStart: 6,
    rowEnd: 10,
    fluid: true,
    delay: makeDelay(),
    // large: true,
  },
  "text-log": {
    id: "text-log",
    muted: false,
    title: "Text Log",
    component: UITextLog,
    active: true,
    fluid: true,
    rowStart: 1,
    rowEnd: 6,
    delay: makeDelay(),
  },
  map: {
    id: "map",
    title: "Map",
    component: UIMap,
    active: false,
    area: "ml",
    delay: makeDelay(),
  },
  "grid-map": {
    id: "grid-map",
    title: "Grid Map",
    component: UIGridMap,
    active: true,
    fluid: true,
    colStart: 3,
    colEnd: 4,
    rowStart: 5,
    rowEnd: 10,
    delay: makeDelay(),
  },
  "debug-log": {
    id: "debug-log",
    title: "Debug Log",
    component: UIDebugLog,
    active: false,
    colStart: 3,
    colEnd: 4,
    rowStart: 1,
    rowEnd: 4,
    fluid: true,
    layer: 2,
    delay: makeDelay(),
  },
  view: {
    id: "view",
    title: "View",
    component: UIView,
    active: true,
    fluid: true,
    colStart: 3,
    colEnd: 4,
    rowStart: 1,
    rowEnd: 5,
    delay: makeDelay(),
  },
});

// Create custom store with simpler update methods
function createComponentState() {
  const { subscribe, set, update } = writable(initialState());

  // Update function
  const alter = (id, key, value) =>
    update((obj) => {
      obj[id][key] = value;
      return obj;
    });

  // Update function
  const toggle = (id, key) =>
    update((obj) => {
      obj[id][key] = !obj[id][key];
      return obj;
    });

  return {
    subscribe,
    set,
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
