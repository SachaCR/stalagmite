import { Aggregate, AggregateState, buildAggregate } from "../..";
import { buildCount, buildInit, buildReset } from "./behaviours";
import { counterEventResolver, CounterEvents } from "./events";

export interface Counter extends Aggregate<CounterState, CounterEvents> {
  init(counterId: string, initialCount: number): "SUCCESS" | "FAILURE";
  count(number: number): "SUCCESS" | "FAILURE";
  reset(): "SUCCESS" | "FAILURE";
}

export interface CounterState extends AggregateState<CounterEvents> {
  id: string;
  count: number;
}

export function createCounter(
  commandId: string,
  snapshot?: CounterState
): Counter {
  const initialState: CounterState = {
    id: "none",
    count: 0,
    sequence: 0,
    allEvents: [],
    uncommitedEvents: [],
    commandId: commandId,
  };

  if (snapshot) {
    snapshot.commandId = commandId; // Override snapshot previous command id
  }

  const currentState = snapshot || initialState;

  const aggregate = buildAggregate(currentState, counterEventResolver);

  return {
    init: buildInit(aggregate),
    count: buildCount(aggregate),
    reset: buildReset(aggregate),
    ...aggregate,
  };
}
