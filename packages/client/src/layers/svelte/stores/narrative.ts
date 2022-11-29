import { writable } from "svelte/store";

export interface LogEntry {
  id: string;
  blockNumber: number;
  address: string;
  message: string;
}

export const narrative = writable([] as LogEntry[]);
