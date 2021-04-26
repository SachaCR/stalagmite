import { CounterState, createCounter } from "../..";

describe('count()', () => {
  describe('Given a counter with count = 0 and sequence 1', () => {
    const commandId = 'command-id';

    const snapshot: CounterState = {
      id: 'counter-id-1',
      commandId: 'previous-command-id',
      count: 0,
      sequence: 1,
      allEvents: [],
      uncommitedEvents: [],
    };

    const counter = createCounter(commandId, snapshot);

    describe('When I count 5', () => {
      it("Then it returns a success outcome and count = 5 and a 'CounterInitiated' event is uncommited", () => {
        expect(counter.count(5)).toStrictEqual({
          data: {
            results: [
              {
                data: {},
                outcome: 'SUCCESS',
              },
            ],
          },
          outcome: 'SUCCESS',
        });

        expect(counter.state()).toStrictEqual({
          id: 'counter-id-1',
          sequence: 2,
          commandId: 'command-id',
          count: 5,
          uncommitedEvents: [
            {
              commandId: 'command-id',
              entityId: 'counter-id-1',
              name: 'NumberCounted',
              payload: {
                number: 5,
              },
              sequence: 2,
              version: 1,
            },
          ],
          allEvents: [
            {
              commandId: 'command-id',
              entityId: 'counter-id-1',
              name: 'NumberCounted',
              payload: {
                number: 5,
              },
              sequence: 2,
              version: 1,
            },
          ],
        });
      });
    });
  });

  describe('count()', () => {
    describe('Given a counter with count = 0 and sequence 1', () => {
      const commandId = 'command-id';

      const snapshot: CounterState = {
        id: 'counter-id-1',
        commandId: 'previous-command-id',
        count: 0,
        sequence: 1,
        allEvents: [],
        uncommitedEvents: [],
      };

      const counter = createCounter(commandId, snapshot);

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
            sequence: 1,
            commandId: 'command-id',
            count: 0,
            uncommitedEvents: [],
            allEvents: [],
          });
        });
      });
    });
  });
});
  
