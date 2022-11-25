import { SetupContractConfig } from "@latticexyz/std-client";

export type GameConfig = {
  worldAddress: string;
  privateKey: string;
  chainId: number;
  jsonRpc: string;
  wsRpc?: string;
  snapshotServiceUrl?: string;
  devMode: boolean;
  initialBlockNumber: number;
};

export const getNetworkConfig: (networkConfig: GameConfig) => SetupContractConfig = (config) => ({
  clock: {
    period: 1000,
    initialTime: 0,
    syncInterval: 5000,
  },
  provider: {
    jsonRpcUrl: config.jsonRpc,
    wsRpcUrl: config.wsRpc,
    chainId: config.chainId,
    options: {
      batch: false,
    },
  },
  privateKey: config.privateKey,
  chainId: config.chainId,
  snapshotServiceUrl: config.snapshotServiceUrl,
  initialBlockNumber: config.initialBlockNumber,
  worldAddress: config.worldAddress,
  devMode: config.devMode,
});
