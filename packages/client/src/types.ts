import { boot } from "./boot";
import { NetworkLayer } from "./layers/network";

export type EmberWindow = Awaited<ReturnType<typeof boot>>;

export type Layers = { network: NetworkLayer };
