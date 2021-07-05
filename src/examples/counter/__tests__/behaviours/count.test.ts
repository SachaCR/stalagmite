import { CounterState, createCounter } from '../..';

describe('count()', () => {
  describe('Given a counter with count = 0 and sequence 1', () => {
    const commandId = 'command-id';

    const initialState: CounterState = {
      sequence: 1,
      id: 'counter-id-1',
      count: 0,
    };

    const counter = createCounter(commandId, initialState);

    describe('When I count 5', () => {
      it("Then it returns a success outcome and count = 5 and a 'CounterInitiated' event is uncommited", () => {
        expect(counter.count(5)).toStrictEqual({
          outcome: 'SUCCESS',
          data: {},
        });

        expect(counter.state()).toStrictEqual({
          id: 'counter-id-1',
          sequence: 2,
          count: 5,
        });

        expect(counter.getUncommmitedEvents()).toStrictEqual([
          {
            name: 'NumberCounted',
            version: 1,
            commandId: 'command-id',
            entityId: 'counter-id-1',
            sequence: 2,
            metadata: {},
            payload: {
              number: 5,
            },
          },
        ]);
      });
    });
  });

  describe('count()', () => {
    describe('Given a counter with count = 0', () => {
      const commandId = 'command-id';

      const state: CounterState = {
        id: 'counter-id-1',
        count: 0,
        sequence: 0,
      };

      const counter = createCounter(commandId, state);

      describe('When I count -5', () => {
        it('Then it returns a failure outcome and no event is created', () => {
          expect(counter.count(-5)).toStrictEqual({
            outcome: 'FAILURE',
            errorCode: 'COUNT_NUMBER_FAILED',
            reason: 'Counter allow only positive numbers',
            data: {
              number: -5,
            },
          });

          expect(counter.state()).toStrictEqual({
            id: 'counter-id-1',
            sequence: 0,
            count: 0,
          });

          expect(counter.getUncommmitedEvents()).toStrictEqual([]);
        });
      });
    });
  });
});
