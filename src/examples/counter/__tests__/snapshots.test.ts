import { createCounter } from "..";

describe("eventCommited()", () => {
  describe("Given a counter with 2 uncommited events", () => {
    const counter = createCounter("commandId");
    counter.init("counter-id", 4);
    counter.count(12);

    describe("When I call eventCommited()", () => {
      const snapshot = counter.snapshot();

      it("Then the uncommited event array is emptied", () => {
        counter.eventsCommited();
        const uncommitedEvents = counter.getUncommmitedEvents();

        expect(uncommitedEvents).toStrictEqual([]);
      });
    });
  });
});
