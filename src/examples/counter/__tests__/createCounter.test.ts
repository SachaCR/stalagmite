import { CounterState, createCounter } from "..";

describe("createCounter()", () => {
  describe("Given a CreateCounter command id", () => {
    describe("When I create a counter for this command id", () => {
      describe("With no initial state", () => {
        it("Then it returns a counter in initial state version 0", () => {
          const commandId = "command-id";
          const counter = createCounter(commandId);

          expect(counter.state()).toStrictEqual({
            commandId: "command-id",
            id: "none",
            sequence: 0,
            count: 0,
          });

          expect(counter.getSequence()).toStrictEqual(0);
        });
      });

      describe("With an initial state", () => {
        it("Then it returns a counter in the initial state", () => {
          const commandId = "current-command-id";

          const initialState: CounterState = {
            id: "counter-id-1",
            commandId: "previous-command-id",
            count: 12,
            sequence: 1,
          };

          const counter = createCounter(commandId, initialState);

          expect(counter.state()).toStrictEqual({
            commandId: "current-command-id",
            id: "counter-id-1",
            sequence: 1,
            count: 12,
          });
        });
      });
    });
  });
});
