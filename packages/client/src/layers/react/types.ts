import { createReactLayer } from "./createReactLayer";

export type ReactLayer = Awaited<ReturnType<typeof createReactLayer>>;
