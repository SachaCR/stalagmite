export interface Aggregate<S extends AggregateState<E>, E extends Event> {
  apply(events: Event | Event[]): Outcome;
  addEvent(events: E): Outcome;
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
  name: string;
  version: number;
  sequence: number;
  commandId: string;
  entityId: string;
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
) => Outcome;

export type Outcome = OutcomeSuccess | OutcomeFailure;

/**
 * It represent an operation result that has failed.
 * @category Outcome
 */
export interface OutcomeFailure {
  outcome: "FAILURE";
  /**
   * It's a specific error code relative to the error.
   */
  errorCode: string;
  /**
   * The explanation why the error happened.
   */
  reason: string;
  /**
   * You can put anything usefull to understand the error.
   * You should not let it to any and type it in your implementation.
   */
  data: any;
}

/**
 * It represent an operation result that succeeded.
 * @category Outcome
 */
export interface OutcomeSuccess {
  outcome: "SUCCESS";
  /**
   * It's the result of the operation.
   * It can be a domain event or anything you wants.
   * You should not let it to any and type it in your implementation.
   */
  data: any;
}
