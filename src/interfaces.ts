export interface Aggregate<S extends AggregateState<E>, E extends Event> {
  apply(events: Event | Event[]): "SUCCESS" | "FAILURE";
  addEvent(events: E): "SUCCESS" | "FAILURE";
  eventsCommited(): void;

  getSequence(): number;
  getUncommmitedEvents(): E[];
  getAllEvents(): E[];
  state(): S;
}

export interface AggregateState<E extends Event> {
  sequence: number;
  commandId: string;
  allEvents: E[];
  uncommitedEvents: E[];
}

export interface Event {
  entityId: string;
  version: number;
  commandId: string;
  sequence: number;
  name: string;
  payload: unknown;
}

export interface Command {
  id: string;
  name: string;
  actorId: string;
  payload: unknown;
}

export type EventResolver<S extends AggregateState<E>, E extends Event> = (
  state: S,
  event: E
) => "SUCCESS" | "FAILURE";
