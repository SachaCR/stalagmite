import { CounterState } from ".";
import { Aggregate, Outcome } from "../../interfaces";
import {
  CounterEvents,
  counterInitiated,
  counterReseted,
  numberCounted,
} from "./events";

export function buildInit(aggregate: Aggregate<CounterState, CounterEvents>) {
  return function init(counterId: string, initialCount: number): Outcome {
    const state = aggregate.state();

    // Business rules
    if (state.id !== "none") {
      // We can't init a counter that has already an id.
      return {
        outcome: "FAILURE",
        errorCode: "COUNTER_INIT_FAILED",
        reason: "This counter is already initiated",
        data: {
          counterId: state.id,
        },
      };
    }

    // We count only positive numbers
    if (initialCount <= 0) {
      return {
        outcome: "FAILURE",
        errorCode: "COUNTER_INIT_FAILED",
        reason: "Counter allow only positive numbers",
        data: {
          initialCount,
        },
      };
    }

    // Create the event
    const event = counterInitiated(state, counterId, initialCount);

    // Add it to aggregate
    return aggregate.addEvent(event);
  };
}

export function buildCount(aggregate: Aggregate<CounterState, CounterEvents>) {
  return function count(number: number): Outcome {
    const state = aggregate.state();

    // Business rules
    // We count only positive numbers
    if (number <= 0) {
      return {
        outcome: "FAILURE",
        errorCode: "COUNT_NUMBER_FAILED",
        reason: "Counter allow only positive numbers",
        data: {
          number,
        },
      };
    }

    // Create corresponding event
    const event = numberCounted(state, number);

    // Add it to the aggregate
    return aggregate.addEvent(event);
  };
}

export function buildReset(aggregate: Aggregate<CounterState, CounterEvents>) {
  return function reset(): Outcome {
    const state = aggregate.state();

    // Create corresponding event
    const event = counterReseted(state);

    // Add it to the aggregate
    return aggregate.addEvent(event);
  };
}
