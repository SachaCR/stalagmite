import { buildAggregate } from "../";
import { AggregateState, Event, EventResolver } from "../interfaces";

describe("buildAggregate", () => {
  describe("Given a state type and event type", () => {
    describe("When I build an aggregate", () => {
      it("Then it returns a full aggregate object", () => {
        interface MyState extends AggregateState<MyEvents> {
          toto: "test";
        }

        interface MyEvents extends Event {
          name: "MyTestEvent";
          version: 1;
          payload: {
            test: "ok";
          };
        }

        const initialState: MyState = {
          toto: "test",
          commandId: "initiateState",
          sequence: 0,
          allEvents: [],
          uncommitedEvents: [],
        };

        const resolver: EventResolver<MyState, MyEvents> = (
          state: MyState,
          event: MyEvents
        ) => {
          return {
            outcome: "SUCCESS",
            data: {},
          };
        };

        const aggregate = buildAggregate(initialState, resolver);

        expect(aggregate.getAllEvents()).toStrictEqual([]);
        expect(aggregate.getUncommmitedEvents()).toStrictEqual([]);
        expect(aggregate.getSequence()).toStrictEqual(0);
        expect(aggregate.state()).toStrictEqual({
          allEvents: [],
          commandId: "initiateState",
          sequence: 0,
          toto: "test",
          uncommitedEvents: [],
        });
      });
    });
  });
});
