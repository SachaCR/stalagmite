import { createCounter } from '..';

describe('apply()', () => {
  describe('Given a counter', () => {
    const counter = createCounter('commandId');
    counter.init('counter-id', 4);

    describe('When I apply an event and the sequence is coherent', () => {
      const event1 = {
        name: 'NumberCounted',
        version: 1,
        commandId: 'command-id',
        entityId: 'counter-id',
        sequence: 2,
        metadata: {},
        payload: {
          number: 5,
        },
      };

      const event2 = {
        name: 'NumberCounted',
        version: 1,
        commandId: 'command-id',
        entityId: 'counter-id',
        sequence: 3,
        metadata: {},
        payload: {
          number: 5,
        },
      };

      const result = counter.apply([event1, event2]);
      expect(result.outcome).toStrictEqual('SUCCESS');
      expect(result.data.length).toStrictEqual(2);

      it('Then the event is applied', () => {
        expect(counter.state()).toStrictEqual({
          count: 14,
          id: 'counter-id',
          sequence: 3,
        });
      });
    });

    describe('When I apply an event and the sequence is incoherent', () => {
      const event = {
        name: 'NumberCounted',
        version: 1,
        commandId: 'command-id',
        entityId: 'counter-id',
        sequence: 200, // incoherent sequece
        metadata: {},
        payload: {
          number: 5,
        },
      };

      const result = counter.apply(event);

      it('Then it returns a FAILURE', () => {
        expect(result).toStrictEqual({
          outcome: 'FAILURE',
          errorCode: 'APPLY_EVENT_FAILED',
          reason: 'Incoherent sequence',
          data: {
            event: {
              name: 'NumberCounted',
              version: 1,
              commandId: 'command-id',
              entityId: 'counter-id',
              sequence: 200,
              metadata: {},
              payload: {
                number: 5,
              },
            },
            stateSequence: 3,
          },
        });
      });
    });
  });
});
