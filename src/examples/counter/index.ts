import { Aggregate, AggregateState, buildAggregate } from '../..';
import { Outcome } from '../../interfaces';
import { buildCount, buildInit, buildReset } from './behaviours';
import { counterEventResolver, CounterEvents } from './events';

export interface Counter extends Aggregate<CounterState, CounterEvents> {
  init(counterId: string, initialCount: number): Outcome;
  count(number: number): Outcome;
  reset(): Outcome;
}

export interface CounterState extends AggregateState {
  id: string;
  count: number;
}

export function createCounter(
  commandId: string,
  state?: CounterState,
): Counter {
  const initialState: CounterState = {
    id: 'none',
    count: 0,
    sequence: 0,
  };

  const currentState = state || initialState;

  const aggregate = buildAggregate(
    commandId,
    currentState,
    counterEventResolver,
  );

  return {
    init: buildInit(aggregate),
    count: buildCount(aggregate),
    reset: buildReset(aggregate),
    ...aggregate,
  };
}
