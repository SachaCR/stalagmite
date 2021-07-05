import { CounterState } from "..";
import { buildAggregate } from "../../../buildAggregate";
import { buildCount, buildInit, buildReset } from "../behaviours";
import { counterEventResolver } from "../events";

describe("Auto snapshot option", () => {
  describe("Given a counter with auto snapshot every 2 events", () => {
    const initialState: CounterState = {
      id: "none",
      count: 0,
      sequence: 0,
      commandId: "command-id",
    };

    const aggregate = buildAggregate(initialState, counterEventResolver, {
      snapshotEvery: 2,
    });

    const counter = {
      init: buildInit(aggregate),
      count: buildCount(aggregate),
      reset: buildReset(aggregate),
      ...aggregate,
    };

    describe("When I generate 5 events", () => {
      counter.init("counter-id", 4);
      counter.count(12);
      counter.count(4);
      counter.count(5);
      counter.count(9);

      it("Then it should generate 2 snapshots", () => {
        const snapshots = counter.getSnapshot();
        expect(snapshots).toStrictEqual([
          {
            commandId: "command-id",
            count: 16,
            id: "counter-id",
            sequence: 2,
          },
          {
            commandId: "command-id",
            count: 25,
            id: "counter-id",
            sequence: 4,
          },
        ]);
      });
    });
  });
});
