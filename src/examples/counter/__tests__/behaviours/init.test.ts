import { createCounter } from "../..";

describe("init()", () => {
  describe("Given a counter ", () => {
    const commandId = "command-id";
    const counter = createCounter(commandId);

    describe("When I initiate it with id: 'counter-id' and initial count to 5", () => {
      it("Then it returns a success outcome and count = 5 and a 'CounterInitiated' event is uncommited", () => {
        expect(counter.init("counter-id", 5)).toStrictEqual({
          data: {
            results: [
              {
                data: {},
                outcome: "SUCCESS",
              },
            ],
          },
          outcome: "SUCCESS",
        });

        expect(counter.state()).toStrictEqual({
          id: "counter-id",
          sequence: 1,
          commandId: "command-id",
          count: 5,
        });

        expect(counter.getUncommmitedEvents()).toStrictEqual([
          {
            name: "CounterInitiated",
            version: 1,
            commandId: "command-id",
            entityId: "counter-id",
            sequence: 1,
            payload: {
              count: 5,
              counterId: "counter-id",
            },
          },
        ]);
      });
    });
  });
});
