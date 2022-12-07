import { writable, get } from "svelte/store";
import { ComponentUpdate } from "@latticexyz/recs";
import { blockNumber } from "./network";
import { playerAddress } from "../stores/player";
import { indexToID, entities, EntityType } from "../stores/entities";
import { getOperation } from "../operations";

import { movement, birth, death, gather, eat, fire, cannibalism } from "./narrators";

export enum EventCategory {
  Move,
  Birth,
  Death,
  Gather,
  Cannibalism,
  Fire,
  Eat,
  Play,
  Stats,
  Direct,
}

export enum LogEntryType {
  Normal,
  Failure,
  Success,
}

export interface Narration {
  [key: string]: string | string[];
}

export interface LogEntry {
  id: string;
  blockNumber: number;
  message: string;
  messageType: LogEntryType;
}

function eventCategoryToString(eventCategory: EventCategory) {
  if (eventCategory === EventCategory.Move) return "move";
  if (eventCategory === EventCategory.Birth) return "birth";
  if (eventCategory === EventCategory.Death) return "death";
  if (eventCategory === EventCategory.Gather) return "gather";
  if (eventCategory === EventCategory.Cannibalism) return "cannibalism";
  if (eventCategory === EventCategory.Fire) return "fire";
  if (eventCategory === EventCategory.Eat) return "eat";
  if (eventCategory === EventCategory.Play) return "play";
  if (eventCategory === EventCategory.Stats) return "stats";
  if (eventCategory === EventCategory.Direct) return "direct";
  return "";
}

export const logReady = writable(false);

export const narrative = writable([] as LogEntry[]);

function write(message: string, messageType: LogEntryType = LogEntryType.Normal) {
  if (message.length > 0) {
    const logEntry: LogEntry = {
      id: self.crypto.randomUUID(),
      blockNumber: get(blockNumber),
      message: message,
      messageType: messageType,
    };
    narrative.update((value) => {
      return [logEntry, ...value];
    });
  }
}

export function directToLog(message: string, messageType: LogEntryType = LogEntryType.Normal) {
  write(message, messageType);
}

export function tale(narration: Narration, key: string, replace?: Record<string, string>) {
  if (!(key in narration)) throw new Error("This tale cannot be told! " + key + " does not exist on narration");

  let tale = narration[key];

  if (Array.isArray(tale)) {
    tale = tale[Math.floor(Math.random() * tale.length)];
  }

  if (replace) {
    Object.entries(replace).forEach(([from, to]) => tale.toString().replaceAll(from, to));
  }

  return tale;
}

export function getOperationTale(name: string, key: string, replace?: Record<string, string>) {
  const operation = getOperation(name);
  return tale(operation.narration, key, replace);
}

export function addToLog(update: ComponentUpdate, category: EventCategory) {
  // HACK: Avoid writing the first updates to the log
  if (get(logReady)) {
    const isSelf = indexToID(update.entity) == get(playerAddress);
    const entityType = get(entities)[indexToID(update.entity)].entityType;

    // --- Movement
    // --- Reacts to changes to the position component
    // ---
    if (category === EventCategory.Move && isSelf) {
      write(movement(update, isSelf), LogEntryType.Success);
    }

    // --- Gather
    // --- Reacts to increases to the resource component
    // ---
    if (category === EventCategory.Gather && entityType == EntityType.Player) {
      write(gather(update, isSelf), LogEntryType.Success);
    }

    // --- Eat
    // --- Reacts to increase to the energy component
    // ---
    if (category === EventCategory.Eat && isSelf) {
      write(eat(update, isSelf), LogEntryType.Success);
    }

    // --- Birth
    // ___ Reacts to entity-type component being set to player
    if (category === EventCategory.Birth && !isSelf) {
      write(birth(update, isSelf), LogEntryType.Success);
    }

    // --- Death
    // --- Reacts to entity-type component being set to corpse
    // ---
    if (category === EventCategory.Death) {
      write(death(update, isSelf), LogEntryType.Failure);
    }

    // --- Fire
    // --- Reacts to changes to the creator component
    // ---
    if (category === EventCategory.Fire) {
      write(fire(update, isSelf), LogEntryType.Success);
    }

    // --- Cannibalism
    // --- Reacts to changes to the cannibal component
    // ---
    if (category === EventCategory.Cannibalism) {
      write(cannibalism(update, isSelf), LogEntryType.Success);
    }
  }
}
