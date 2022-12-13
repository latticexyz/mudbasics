import { createNetworkLayer } from "../network";
import { Layers } from "../../types";
import { Wallet } from "ethers";

export async function bootGame() {
  const layers: Partial<Layers> = {};

  const params = new URLSearchParams(window.location.search);
  const worldAddress = params.get("worldAddress");
  let privateKey = params.get("burnerWalletPrivateKey");
  const chainIdString = params.get("chainId");
  const jsonRpc = params.get("rpc") || undefined;
  const wsRpc = params.get("wsRpc") || undefined; // || (jsonRpc && jsonRpc.replace("http", "ws"));
  const snapshotServiceUrl = params.get("snapshot") || undefined;
  const faucetServiceUrl = params.get("faucet") || undefined;
  const devMode = params.get("dev") === "true";
  const initialBlockNumberString = params.get("initialBlockNumber");
  const initialBlockNumber = initialBlockNumberString ? parseInt(initialBlockNumberString) : 0;

  if (!privateKey) {
    privateKey = localStorage.getItem("burnerWallet") || Wallet.createRandom().privateKey;
    localStorage.setItem("burnerWallet", privateKey);
  }

  let networkLayerConfig;
  if (worldAddress && privateKey && chainIdString && jsonRpc) {
    networkLayerConfig = {
      worldAddress,
      privateKey,
      chainId: parseInt(chainIdString),
      jsonRpc,
      wsRpc,
      snapshotServiceUrl,
      faucetServiceUrl,
      devMode,
      initialBlockNumber,
    };
  }

  if (!networkLayerConfig) throw new Error("Invalid config");

  layers.network = await createNetworkLayer(networkLayerConfig);
  layers.network.startSync();

  return layers as Layers;
}
