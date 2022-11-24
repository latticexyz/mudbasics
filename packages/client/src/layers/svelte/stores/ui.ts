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

export const uiState = writable({
  avatar: {
    id: "avatar",
    title: "Avatar",
    component: UIAvatar,
    active: true,
    fluid: true,
    persistent: true,
    colStart: 2,
    colEnd: 3,
    rowStart: 2,
    rowEnd: 11,
  },
  "visual-operations-editor": {
    id: "visual-operations-editor",
    title: "Visual Operations Editor",
    component: UIVisualOperationsEditor,
    active: false,
    area: "mr",
    // large: true,
  },
  "text-log": {
    id: "text-log",
    title: "Text Log",
    component: UITextLog,
    active: true,
    rowStart: 2,
    rowEnd: 7,
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
    rowStart: 8,
    rowEnd: 11,
  },
  "debug-log": {
    id: "debug-log",
    title: "Debug Log",
    component: UIDebugLog,
    active: true,
    colStart: 3,
    colEnd: 4,
    rowStart: 2,
    rowEnd: 5,
    fluid: true,
  },
  view: {
    id: "view",
    title: "View",
    component: UIView,
    active: false,
    fluid: true,
    rowStart: 8,
    rowEnd: 11,
  },
});
