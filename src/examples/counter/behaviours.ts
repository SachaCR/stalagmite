import { CounterState } from ".";
import { Aggregate } from "../../interfaces";
import {
  CounterEvents,
  counterInitiated,
  counterReseted,
  numberCounted,
} from "./events";

export function buildInit(aggregate: Aggregate<CounterState, CounterEvents>) {
  return function init(
    counterId: string,
    initialCount: number
  ): "SUCCESS" | "FAILURE" {
    const state = aggregate.state();

    // Business rules
    if (state.id !== "none") {
      // We can't init a counter that has already an id.
      return "FAILURE";
    }

    // We count only positive numbers
    if (initialCount <= 0) {
      return "FAILURE";
    }

    // Create the event
    const event = counterInitiated(state, counterId, initialCount);

    // Add it to aggregate
    return aggregate.addEvent(event);
  };
}

export function buildCount(aggregate: Aggregate<CounterState, CounterEvents>) {
  return function count(number: number): "SUCCESS" | "FAILURE" {
    const state = aggregate.state();

    // Business rules
    // We count only positive numbers
    if (number <= 0) {
      return "FAILURE";
    }

    // Create corresponding event
    const event = numberCounted(state, number);

    // Add it to the aggregate
    return aggregate.addEvent(event);
  };
}

export function buildReset(aggregate: Aggregate<CounterState, CounterEvents>) {
  return function reset(): "SUCCESS" | "FAILURE" {
    const state = aggregate.state();

    // Create corresponding event
    const event = counterReseted(state);

    // Add it to the aggregate
    return aggregate.addEvent(event);
  };
}
