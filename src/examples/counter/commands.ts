import { createCounter } from ".";
import { Command } from "../../interfaces";
import { buildEventStore } from "./eventStore";

const eventStore = buildEventStore(); // This mock an event store interface for example puposes.

// COMMANDS
export interface CountNumber extends Command {
  name: "CountNumber";
  payload: {
    counterId: string;
    number: number;
  };
}

export interface ResetCounter extends Command {
  name: "ResetCounter";
  payload: {
    counterId: string;
  };
}

export interface CreateCounter extends Command {
  name: "CreateCounter";
  payload: {
    counterId: string;
  };
}

// COMMAND HANDLERS
export async function createCounterHandler(
  command: CreateCounter
): Promise<"SUCCESS" | "FAILURE"> {
  const { counterId } = command.payload;

  // Create the aggregate
  const counter = createCounter(command.id);
  counter.init(counterId); // Use aggregate behaviour to do business logic

  const uncomitedEvents = counter.getUncommmitedEvents(); // Retrieve resulting events from business logic
  const result = await eventStore.save(uncomitedEvents); // Save them in the event store

  if (result === "FAILURE") {
    return result;
  }

  counter.eventsCommited(); // Clear the uncomitted events

  return "SUCCESS";
}

export async function counterNumberHandler(
  command: CountNumber
): Promise<"SUCCESS" | "FAILURE"> {
  const { counterId, number } = command.payload;

  const snapshot = await eventStore.getLatestSnapshot(counterId); // Retrieve the latest snapshot for this accountId
  const events = await eventStore.getEventFrom(snapshot); // Get event after this snapshot
  const counter = createCounter(command.id, snapshot); // Create an aggregate from the snapshot
  counter.apply(events); // Apply latest events

  counter.count(number); // Use aggregate methods to do business logic

  const uncomitedEvents = counter.getUncommmitedEvents(); // Retrieve business logic resulting events
  const result = await eventStore.save(uncomitedEvents); // Save them in the event store

  if (result === "FAILURE") {
    return result;
  }

  counter.eventsCommited(); // Clear the uncommited events

  return "SUCCESS";
}

export async function resetCounterHandler(
  command: ResetCounter
): Promise<"SUCCESS" | "FAILURE"> {
  const { counterId } = command.payload;

  const snapshot = await eventStore.getLatestSnapshot(counterId); // Retrieve the latest snapshot for this accountId
  const events = await eventStore.getEventFrom(snapshot); // Get event after this snapshot
  const counter = createCounter(command.id, snapshot); // Create an aggregate from the snapshot
  counter.apply(events); // Apply latest events

  counter.reset(); // Use aggregate methods to do business logic

  const uncomitedEvents = counter.getUncommmitedEvents(); // Retrieve business logic resulting events
  const result = await eventStore.save(uncomitedEvents); // Save them in the event store

  if (result === "FAILURE") {
    return result;
  }

  counter.eventsCommited(); // Clear the uncommited events

  return "SUCCESS";
}
