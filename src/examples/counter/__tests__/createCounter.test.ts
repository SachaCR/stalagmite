import { CounterState, createCounter } from "..";
import { CounterInitiated } from "../events";

describe("createCounter()", () => {
  describe("Given a CreateCounter command id", () => {
    describe("When I create a counter for this command id", () => {
      describe("With no snapshot", () => {
        it("Then it returns a counter in initial state version 0", () => {
          const commandId = "command-id";
          const accountBalance = createCounter(commandId);

          expect(accountBalance.state()).toStrictEqual({
            commandId: "command-id",
            id: "none",
            sequence: 0,
            count: 0,
            allEvents: [],
            uncommitedEvents: [],
          });
        });
      });

      describe("With a snapshot", () => {
        it("Then it returns a counter in the snapshot state", () => {
          const commandId = "current-command-id";
          const previousEvent: CounterInitiated = {
            name: "CounterInitiated",
            version: 1,
            commandId: "previous-command-id",
            entityId: "counter-id-1",
            sequence: 1,
            payload: {
              counterId: "counter-id-1",
              count: 12,
            },
          };

          const snapshot: CounterState = {
            id: "counter-id-1",
            commandId: "previous-command-id",
            count: 12,
            sequence: 1,
            allEvents: [previousEvent],
            uncommitedEvents: [],
          };

          const accountBalance = createCounter(commandId, snapshot);

          expect(accountBalance.state()).toStrictEqual({
            commandId: "current-command-id",
            id: "counter-id-1",
            sequence: 1,
            count: 12,
            allEvents: [previousEvent],
            uncommitedEvents: [],
          });
        });
      });
    });
  });
});
