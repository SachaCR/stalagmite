import { CounterState } from '.';
import { Event, Outcome } from '../../interfaces';
import { missingSwitchCaseHandling } from '../../missingSwitchCase';

export interface CounterInitiated extends Event {
  name: 'CounterInitiated';
  version: 1;
  payload: {
    counterId: string;
    count: number;
  };
}

export function counterInitiated(
  commandId: string,
  state: CounterState,
  counterId: string,
  count: number,
): CounterInitiated {
  const event: CounterInitiated = {
    name: 'CounterInitiated',
    version: 1,
    entityId: counterId,
    commandId: commandId,
    sequence: state.sequence + 1,
    metadata: {},
    payload: {
      counterId: counterId,
      count: count,
    },
  };

  return event;
}

export interface NumberCounted extends Event {
  name: 'NumberCounted';
  version: 1;
  payload: {
    number: number;
  };
}

export function numberCounted(
  commandId: string,
  state: CounterState,
  number: number,
): NumberCounted {
  const event: NumberCounted = {
    name: 'NumberCounted',
    version: 1,
    entityId: state.id,
    commandId: commandId,
    sequence: state.sequence + 1,
    metadata: {},
    payload: {
      number: number,
    },
  };

  return event;
}

export interface CounterReseted extends Event {
  name: 'CounterReseted';
  version: 1;
  payload: {
    count: number;
  };
}

export function counterReseted(
  commandId: string,
  state: CounterState,
): CounterReseted {
  const event: CounterReseted = {
    name: 'CounterReseted',
    version: 1,
    entityId: state.id,
    commandId: commandId,
    sequence: state.sequence + 1,
    metadata: {},
    payload: {
      count: 0,
    },
  };

  return event;
}

export type CounterEvents = CounterInitiated | NumberCounted | CounterReseted;

export function counterEventResolver(
  state: CounterState,
  event: CounterEvents,
): Outcome {
  switch (event.name) {
    case 'CounterInitiated':
      state.id = event.payload.counterId;
      state.count = event.payload.count;
      break;

    case 'NumberCounted':
      state.count += event.payload.number;
      break;

    case 'CounterReseted':
      state.count = event.payload.count;
      break;

    default:
      const { name: eventName } = event;
      missingSwitchCaseHandling(eventName);
  }

  return {
    outcome: 'SUCCESS',
    data: {},
  };
}
