import UISpawn from "../lib/UISpawn.svelte";
import UITextLog from "../lib/UITextLog.svelte";
import UIAvatar from "../lib/UIAvatar.svelte";
import UIVisualOperationsEditor from "../lib/UIVisualOperationsEditor.svelte";
import UIMap from "../lib/UIMap.svelte";
import UIGridMap from "../lib/UIGridMap.svelte";
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

export const uiState = writable([
  {
    id: "avatar",
    title: "Avatar",
    component: UIAvatar,
    active: true,
  },
  {
    id: "visual-operations-editor",
    title: "Visual Operations Editor",
    component: UIVisualOperationsEditor,
    active: true,
    large: true,
  },
  {
    id: "text-log",
    title: "Text Log",
    component: UITextLog,
    active: false,
  },
  {
    id: "map",
    title: "Map",
    component: UIMap,
    active: true,
  },
  {
    id: "grid-map",
    title: "Grid Map",
    component: UIGridMap,
    active: true,
  },
  {
    id: "debug-log",
    title: "Debug Log",
    component: UIDebugLog,
    active: true,
  },
]);
