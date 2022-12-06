import { writable, get } from "svelte/store";
import { ComponentUpdate } from "@latticexyz/recs";
import { blockNumber, startBlock } from "./network";
import { playerAddress } from "../stores/player";
import { indexToID, entities, EntityType } from "../stores/entities";

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

export function addToLog(update: ComponentUpdate, category: EventCategory) {
  console.log(eventCategoryToString(category));
  console.log(update);

  console.log("get(startBlock)", get(startBlock));

  // HACK: Avoid writing the first updates to the log
  if (get(logReady)) {
    const isSelf = indexToID(update.entity) == get(playerAddress);
    const entityType = get(entities)[indexToID(update.entity)].entityType;

    // --- Movement
    // --- Reacts to changes to the position component
    // ---
    if (category === EventCategory.Move && isSelf) {
      write(movement(update, isSelf));
    }

    // --- Gather
    // --- Reacts to increases to the resource component
    // ---
    if (category === EventCategory.Gather && entityType == EntityType.Player) {
      write(gather(update, isSelf));
    }

    // --- Eat
    // --- Reacts to increase to the energy component
    // ---
    if (category === EventCategory.Eat && isSelf) {
      write(eat(update, isSelf));
    }

    // --- Birth
    // ___ Reacts to entity-type component being set to player
    if (category === EventCategory.Birth && !isSelf) {
      write(birth(update, isSelf));
    }

    // --- Death
    // --- Reacts to entity-type component being set to corpse
    // ---
    if (category === EventCategory.Death) {
      write(death(update, isSelf));
    }

    // --- Fire
    // --- Reacts to changes to the creator component
    // ---
    if (category === EventCategory.Fire) {
      write(fire(update, isSelf));
    }

    // --- Cannibalism
    // --- Reacts to changes to the cannibal component
    // ---
    if (category === EventCategory.Cannibalism) {
      write(cannibalism(update, isSelf));
    }
  }
}
