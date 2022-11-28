import { writable } from "svelte/store";

export interface LogEntry {
  id: string;
  address: string;
  message: string;
}

export const narrative = writable([] as LogEntry[]);
