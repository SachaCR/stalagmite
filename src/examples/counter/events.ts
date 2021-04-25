import { CounterState } from ".";
import { Event, Outcome, EventResolver } from "../../interfaces";
import { missingSwitchCaseHandling } from "../../missingSwitchCase";

export interface CounterInitiated extends Event {
  name: "CounterInitiated";
  version: 1;
  payload: {
    counterId: string;
    count: number;
  };
}

export function counterInitiated(
  state: CounterState,
  counterId: string,
  count: number
): CounterInitiated {
  const event: CounterInitiated = {
    name: "CounterInitiated",
    version: 1,
    entityId: counterId,
    commandId: state.commandId,
    sequence: state.sequence + 1,
    payload: {
      counterId: counterId,
      count: count,
    },
  };

  return event;
}

export interface NumberCounted extends Event {
  name: "NumberCounted";
  version: 1;
  payload: {
    number: number;
  };
}

export function numberCounted(
  state: CounterState,
  number: number
): NumberCounted {
  const event: NumberCounted = {
    name: "NumberCounted",
    version: 1,
    entityId: state.id,
    commandId: state.commandId,
    sequence: state.sequence + 1,
    payload: {
      number: number,
    },
  };

  return event;
}

export interface CounterReseted extends Event {
  name: "CounterReseted";
  version: 1;
  payload: {
    count: number;
  };
}

export function counterReseted(state: CounterState): CounterReseted {
  const event: CounterReseted = {
    name: "CounterReseted",
    version: 1,
    entityId: state.id,
    commandId: state.commandId,
    sequence: state.sequence + 1,
    payload: {
      count: 0,
    },
  };

  return event;
}

export type CounterEvents = CounterInitiated | NumberCounted | CounterReseted;

function eventResolver(state: CounterState, event: CounterEvents): Outcome {
  switch (event.name) {
    case "CounterInitiated":
      state.id = event.payload.counterId;
      state.count = event.payload.count;
      break;

    case "NumberCounted":
      state.count += event.payload.number;
      break;

    case "CounterReseted":
      state.count = event.payload.count;
      break;

    default:
      const { name: eventName } = event;
      missingSwitchCaseHandling(eventName);
  }

  return {
    outcome: "SUCCESS",
    data: {},
  };
}

export const counterEventResolver: EventResolver<
  CounterState,
  CounterEvents
> = eventResolver;
