import { createCounter } from ".";
import { Command, Outcome } from "../../interfaces";
import { buildEventStore } from "./mocks/eventStore";

const eventStore = buildEventStore(); // This mock an event store interface for example puposes.

// COMMANDS
export interface InitCounter extends Command {
  name: "InitCounter";
  payload: {
    counterId: string;
    initialCount: number;
  };
}

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

// COMMAND HANDLERS
export async function createCounterHandler(
  command: InitCounter
): Promise<Outcome> {
  const { counterId, initialCount } = command.payload;

  // Create the aggregate
  const counter = createCounter(command.id);
  counter.init(counterId, initialCount); // Use aggregate behaviour to do business logic

  const uncomitedEvents = counter.getUncommmitedEvents(); // Retrieve resulting events from business logic
  const result = await eventStore.save(uncomitedEvents); // Save them in the event store

  if (result.outcome === "FAILURE") {
    return result;
  }

  counter.eventsCommited(); // Clear the uncomitted events

  return {
    outcome: "SUCCESS",
    data: {},
  };
}

export async function counterNumberHandler(
  command: CountNumber
): Promise<Outcome> {
  const { counterId, number } = command.payload;

  const snapshot = await eventStore.getLatestSnapshot(counterId); // Retrieve the latest snapshot for this accountId
  const events = await eventStore.getEventFrom(snapshot); // Get event after this snapshot
  const counter = createCounter(command.id, snapshot); // Create an aggregate from the snapshot
  counter.apply(events); // Apply latest events

  counter.count(number); // Use aggregate methods to do business logic

  const uncomitedEvents = counter.getUncommmitedEvents(); // Retrieve business logic resulting events
  const result = await eventStore.save(uncomitedEvents); // Save them in the event store

  if (result.outcome === "FAILURE") {
    return result;
  }

  counter.eventsCommited(); // Clear the uncommited events

  return {
    outcome: "SUCCESS",
    data: {},
  };
}

export async function resetCounterHandler(
  command: ResetCounter
): Promise<Outcome> {
  const { counterId } = command.payload;

  const snapshot = await eventStore.getLatestSnapshot(counterId); // Retrieve the latest snapshot for this accountId
  const events = await eventStore.getEventFrom(snapshot); // Get event after this snapshot
  const counter = createCounter(command.id, snapshot); // Create an aggregate from the snapshot
  counter.apply(events); // Apply latest events

  counter.reset(); // Use aggregate methods to do business logic

  const uncomitedEvents = counter.getUncommmitedEvents(); // Retrieve business logic resulting events
  const result = await eventStore.save(uncomitedEvents); // Save them in the event store

  if (result.outcome === "FAILURE") {
    return result;
  }

  counter.eventsCommited(); // Clear the uncommited events

  return {
    outcome: "SUCCESS",
    data: {},
  };
}
