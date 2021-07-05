import cloneDeep from 'lodash.clonedeep';

import {
  AggregateState,
  Aggregate,
  Event,
  EventResolver,
  Outcome,
  OutcomeSuccess,
  OutcomeFailure,
} from './interfaces';

/**
 * Internal type used to keep track of all events and snapshots
 */
interface AggregateHistory<S, E extends Event> {
  allEvents: E[];
  uncommitedEvents: E[];
  snapshots: S[];
}

/**
 * Use this function to build your aggregate instances.
 * @param state The current state of you aggregate
 * @param resolver The EventResolver your aggregate will use to mutate the state.
 * @returns This function will return an new aggregate instance.
 * @example
 * ```typescript
 * export function createCounter(
 *   commandId: string,
 *   state?: CounterState
 * ): Counter {
 *   const initialState: CounterState = {
 *     id: "none",
 *     count: 0,
 *     sequence: 0,
 *     commandId: commandId,
 *   };
 *
 *   if (state) {
 *     state.commandId = commandId;
 *   }
 *
 *   const currentState = state || initialState;
 *
 *   const aggregate = buildAggregate(currentState, counterEventResolver);
 *
 *   return {
 *     init: buildInit(aggregate),
 *     count: buildCount(aggregate),
 *     reset: buildReset(aggregate),
 *     ...aggregate,
 *   };
 * }
 * ```
 */
export function buildAggregate<S extends AggregateState, E extends Event>(
  state: S,
  resolver: EventResolver<S, E>,
  options?: {
    /**
     * This option will generate a snapshots every X events added.
     */
    snapshotEvery?: number;
  },
): Aggregate<S, E> {
  const history: AggregateHistory<S, E> = {
    allEvents: [],
    uncommitedEvents: [],
    snapshots: [],
  };

  return {
    apply: (event: E | E[]) => apply(state, event, resolver, history),
    addEvent: (event: E) => addEvent(state, event, resolver, history, options),
    getSequence: () => state.sequence,
    getUncommmitedEvents: () => history.uncommitedEvents,
    eventsCommited: () => (history.uncommitedEvents = []),
    state: () => cloneDeep(state),
    snapshot: () => {
      const snapshot = cloneDeep(state);
      history.snapshots.push(snapshot);
      return snapshot;
    },
    getSnapshot: () => {
      return history.snapshots;
    },
    snapshotsCommited: () => {
      history.snapshots = [];
    },
  };
}

interface ApplyEventOutcomeSuccess extends OutcomeSuccess {
  data: OutcomeSuccess[];
}

export type ApplyEventOutcome = ApplyEventOutcomeSuccess | OutcomeFailure;

function apply<S extends AggregateState, E extends Event>(
  state: S,
  events: E | E[],
  resolver: EventResolver<S, E>,
  history: AggregateHistory<S, E>,
): ApplyEventOutcome {
  const eventList = Array.isArray(events) ? events : [events];
  const successOutcomes: OutcomeSuccess[] = [];

  for (let i = 0; i < eventList.length; i++) {
    const event = eventList[i];

    if (event.sequence !== state.sequence + 1) {
      return {
        outcome: 'FAILURE',
        errorCode: 'APPLY_EVENT_FAILED',
        reason: 'Incoherent sequence',
        data: {
          event: event,
          stateSequence: state.sequence,
        },
      };
    }

    try {
      const result = resolver(state, event);

      if (result.outcome === 'FAILURE') {
        return result;
      }

      successOutcomes.push(result);
    } catch (error) {
      return {
        outcome: 'FAILURE',
        errorCode: 'APPLY_EVENT_FAILED',
        reason: 'Resolver thrown an error',
        data: {
          error: error.name,
          message: error.message,
          stack: error.stack,
        },
      };
    }

    history.allEvents.push(event);
    state.sequence += 1;
  }

  return {
    outcome: 'SUCCESS',
    data: successOutcomes,
  };
}

function addEvent<S extends AggregateState, E extends Event>(
  state: S,
  event: E,
  resolver: EventResolver<S, E>,
  history: AggregateHistory<S, E>,
  options?: {
    snapshotEvery?: number;
  },
): Outcome {
  const snapshotEvery = options?.snapshotEvery;
  const results = apply(state, event, resolver, history);

  if (results.outcome === 'FAILURE') {
    return results;
  }

  if (snapshotEvery && state.sequence % snapshotEvery === 0) {
    const snapshot = cloneDeep(state);
    history.snapshots.push(snapshot);
  }

  history.uncommitedEvents.push(event);

  return results.data[0];
}
