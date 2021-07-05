import { CounterState, createCounter } from '..';
import { buildAggregate } from '../../../buildAggregate';
import { Outcome } from '../../../interfaces';
import { buildCount, buildInit, buildReset } from '../behaviours';
import { CounterEvents } from '../events';

describe('Auto snapshot option', () => {
  describe('Given a counter with a failing resolver', () => {
    const initialState: CounterState = {
      id: 'none',
      count: 0,
      sequence: 0,
    };

    function counterEventResolver(
      state: CounterState,
      event: CounterEvents,
    ): Outcome {
      return {
        outcome: 'FAILURE',
        errorCode: 'SOME_ERROR',
        reason: 'A reason',
        data: {},
      };
    }

    const aggregate = buildAggregate(
      'command-id',
      initialState,
      counterEventResolver,
      {
        snapshotEvery: 2,
      },
    );

    const counter = {
      init: buildInit(aggregate),
      count: buildCount(aggregate),
      reset: buildReset(aggregate),
      ...aggregate,
    };

    describe('When I try to apply an events', () => {
      const result = counter.init('counter-id', 4);

      it('Then it should return an error', () => {
        expect(result).toStrictEqual({
          outcome: 'FAILURE',
          errorCode: 'SOME_ERROR',
          reason: 'A reason',
          data: {},
        });
      });
    });
  });

  describe('Given a counter with a resolver that throw', () => {
    const initialState: CounterState = {
      id: 'none',
      count: 0,
      sequence: 0,
    };

    function counterEventResolver(
      state: CounterState,
      event: CounterEvents,
    ): Outcome {
      throw new Error('Ouch an error occur');
    }

    const aggregate = buildAggregate(
      'command-id',
      initialState,
      counterEventResolver,
      {
        snapshotEvery: 2,
      },
    );

    const counter = {
      init: buildInit(aggregate),
      count: buildCount(aggregate),
      reset: buildReset(aggregate),
      ...aggregate,
    };

    describe('When I try to apply an events', () => {
      const result = counter.init('counter-id', 4);

      it('Then it should return an error', () => {
        expect(result).toStrictEqual({
          outcome: 'FAILURE',
          errorCode: 'APPLY_EVENT_FAILED',
          reason: 'Resolver thrown an error',
          data: {
            error: 'Error',
            message: 'Ouch an error occur',
            stack: expect.any(String),
          },
        });
      });
    });
  });
});
