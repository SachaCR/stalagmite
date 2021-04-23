import { createCounter } from "..";

describe("createCounter()", () => {
  describe("Given a CreateCounter command id", () => {
    describe("When I create a counter for this command id", () => {
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
  });
});
