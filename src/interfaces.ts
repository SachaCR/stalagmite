/**
 * This is the aggregate interface
 * @category Aggregate
 */
export interface Aggregate<S extends AggregateState<E>, E extends Event> {
  /**
   *
   * @param events The event you want to apply to the current state. This function is used when you want to rehydrate your aggregate from your events store events.
   */
  apply(events: Event | Event[]): Outcome;

  /**
   *
   * @param events The event you want to apply and add to the list of events that are not commited yet.
   */
  addEvent(events: E): Outcome;

  /**
   * Call this function clear the uncommmited events array after you saved them in your event store / repository.
   */
  eventsCommited(): void;

  /**
   * @returns The current sequence of you aggregate.
   */
  getSequence(): number;

  /**
   * @returns The list of events you added that need to be persisted in your event store. Call eventsCommited() when it's done to clear the array.
   */
  getUncommmitedEvents(): E[];

  /**
   * @returns All events that leds to the current state of you aggregate.
   */
  getAllEvents(): E[];

  /**
   * @returns The current state of you aggregate. Beware it's not a deep copy so if you mutate it. It will impact your aggregate state. It should never be used outside of you aggregate boundaries.
   */
  state(): S;
}

/**
 * This is the aggregate state interface
 * @category Aggregate
 * @example
 * ```typescript
 * interface CounterState extends AggregateState<CounterEvents> {
 *   id: string;
 *   count: number;
 * }
 * ```
 */
export interface AggregateState<E extends Event> {
  /**
   * This is history revision of the aggregate.
   */
  sequence: number;

  /**
   * The command id related to this sequence.
   */
  commandId: string;

  /**
   * All the events that has generate the current state.
   */
  allEvents: E[];

  /**
   * All the events that your current operations on the aggregate has generated that need to be persisted in your event store / repository.
   */
  uncommitedEvents: E[];
}

/**
 * This is the event interface
 * @category Events
 *
 * @example
 * ```typescript
 * export interface CounterInitiated extends Event {
 *   name: "CounterInitiated";
 *   version: 1;
 *   payload: {
 *     counterId: string;
 *     count: number;
 *   };
 * }
 * ```
 *
 */
export interface Event {
  /**
   * The name of the event
   */
  name: string;
  /**
   * The version of the event. Used to track schemas evolution of your events.
   */
  version: number;

  /**
   * It's the place of the event in the history of the aggregate.
   */
  sequence: number;

  /**
   * The command id that has generated this event.
   */
  commandId: string;

  /**
   * This is the aggregate id.
   */
  entityId: string;

  /**
   * The payload of your event.
   */
  payload: unknown;
}

/**
 * @category Commands
 * @example
 * ```typescript
 * export interface InitCounter extends Command {
 *   name: "InitCounter";
 *   payload: {
 *     counterId: string;
 *     initialCount: number;
 *   };
 * }
 * ```
 */
export interface Command {
  /**
   * The command's id.
   */
  id: string;

  /**
   * The command's name.
   */
  name: string;

  /**
   * The user that perform the command.
   */
  actorId: string;

  /**
   * The payload of your command.
   */
  payload: unknown;
}

/**
 * This is the function you aggregate will use to mutate your state. If you know redux it's like a reducer.
 * @category Events
 * @example
 * ```typescript
 * function eventResolver(state: CounterState, event: CounterEvents): Outcome {
 *   switch (event.name) {
 *     case "CounterInitiated":
 *       state.id = event.payload.counterId;
 *       state.count = event.payload.count;
 *       break;
 *
 *     case "NumberCounted":
 *       state.count += event.payload.number;
 *       break;
 *
 *     case "CounterReseted":
 *       state.count = event.payload.count;
 *       break;
 *
 *     default:
 *       const { name: eventName } = event;
 *       missingSwitchCaseHandling(eventName);
 *   }
 *
 *   return {
 *     outcome: "SUCCESS",
 *     data: {},
 *   };
 * }
 * ```
 */
export type EventResolver<S extends AggregateState<E>, E extends Event> = (
  state: S,
  event: E
) => Outcome;

/**
 * It represent an operation result.
 * @category Outcome
 */
export type Outcome = OutcomeSuccess | OutcomeFailure;

/**
 * It represent an operation result that has failed.
 * @category Outcome
 * @example
 * ```typescript
 * {
 *   outcome: "FAILURE",
 *   errorCode: "COUNTER_INIT_FAILED",
 *   reason: "Counter allow only positive numbers",
 *   data: {
 *     initialCount,
 *   },
 * };
 * ```
 */
export interface OutcomeFailure {
  outcome: 'FAILURE';
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
  outcome: 'SUCCESS';
  /**
   * It's the result of the operation.
   * It can be anything you wants.
   * You should not let it to any and type it in your implementation.
   */
  data: any;
}
