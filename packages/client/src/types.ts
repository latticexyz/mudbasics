import { boot } from "./boot";
import { NetworkLayer } from "./layers/network";
import { ReactLayer } from "./layers/react";

export type EmberWindow = Awaited<ReturnType<typeof boot>>;

export type Layers = { network: NetworkLayer; react: ReactLayer };
