import { writable } from "svelte/store";

export interface LogEntry {
  address: string;
  message: string;
}

export const narrative = writable([] as LogEntry[]);
