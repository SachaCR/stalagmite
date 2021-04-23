import { CounterState } from ".";
import { CounterEvents } from "./events";

// This file is just a mock to make typscript happy in examples.
export function buildEventStore(): EventStore {
  return {} as EventStore;
}

export interface EventStore {
  getLatestSnapshot(counterId: string): Promise<CounterState>;
  getEventFrom(snapshot: CounterState): Promise<CounterEvents[]>;
  save(events: CounterEvents[]): Promise<"SUCCESS" | "FAILURE">;
}
