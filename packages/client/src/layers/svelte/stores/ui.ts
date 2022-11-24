import UITextLog from "../lib/UITextLog.svelte";
import UIAvatar from "../lib/UIAvatar.svelte";
import UIVisualOperationsEditor from "../lib/UIVisualOperationsEditor.svelte";
import UIMap from "../lib/UIMap.svelte";
import UIGridMap from "../lib/UIGridMap.svelte";
import UIView from "../lib/UIView.svelte";
import UIDebugLog from "../lib/UIDebugLog.svelte";

import { writable } from "svelte/store";

// export interface UIComponentState = {
// id,
// component,
// title,
// area,
// available,
// active,
// muted
// }

export const menuVisible = writable(false);
export const uiState = writable({
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
  },
  "visual-operations-editor": {
    id: "visual-operations-editor",
    title: "Visual Operations Editor",
    component: UIVisualOperationsEditor,
    active: true,
    colStart: 1,
    colEnd: 3,
    rowStart: 6,
    rowEnd: 10,
    fluid: true,
    // large: true,
  },
  "text-log": {
    id: "text-log",
    title: "Text Log",
    component: UITextLog,
    active: true,
    fluid: true,
    rowStart: 1,
    rowEnd: 6,
  },
  map: {
    id: "map",
    title: "Map",
    component: UIMap,
    active: false,
    area: "ml",
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
  },
});
