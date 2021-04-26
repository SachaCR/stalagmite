import {
  AggregateState,
  Aggregate,
  Event,
  EventResolver,
  Outcome,
  OutcomeSuccess,
} from "./interfaces";


/**
 * Use this function to build your aggregate instances.
 * @param state The current state of you aggregate
 * @param resolver The EventResolver your aggregate will use to mutate the state.
 * @returns This function will return an new aggregate instance.
 * @example
 * ```typescript
 * export function createCounter(
 *   commandId: string,
 *   snapshot?: CounterState
 * ): Counter {
 *   const initialState: CounterState = {
 *     id: "none",
 *     count: 0,
 *     sequence: 0,
 *     allEvents: [],
 *     uncommitedEvents: [],
 *     commandId: commandId,
 *   };
 * 
 *   if (snapshot) {
 *     snapshot.commandId = commandId; // Override snapshot previous command id
 *   }
 * 
 *   const currentState = snapshot || initialState;
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
export function buildAggregate<S extends AggregateState<E>, E extends Event>(
  state: S,
  resolver: EventResolver<S, E>
): Aggregate<S, E> {
  return {
    apply: (event: E | E[]) => apply(state, event, resolver),
    addEvent: (event: E) => addEvent(state, event, resolver),
    getSequence: () => state.sequence,
    getAllEvents: () => state.allEvents,
    getUncommmitedEvents: () => state.uncommitedEvents,
    eventsCommited: () => (state.uncommitedEvents = []),
    state: () => Object.assign({}, state), // Warning this is a not deep copy. State should never be manipulated outside aggregate boundaries.
  };
}

function apply<S extends AggregateState<E>, E extends Event>(
  state: S,
  events: E | E[],
  resolver: EventResolver<S, E>
): Outcome {
  const eventList = Array.isArray(events) ? events : [events];
  const successOutcomes: OutcomeSuccess[] = [];

  for (let i = 0; i < eventList.length; i++) {
    const event = eventList[i];

    if (event.sequence !== state.sequence + 1) {
      return {
        outcome: "FAILURE",
        errorCode: "APPLY_EVENT_FAILED",
        reason: "Incoherent sequence",
        data: {
          event: event,
          stateSequence: state.sequence,
        },
      };
    }

    try {
      const result = resolver(state, event);

      if (result.outcome === "FAILURE") {
        return result;
      }

      successOutcomes.push(result);
    } catch (error) {
      return {
        outcome: "FAILURE",
        errorCode: "APPLY_EVENT_FAILED",
        reason: "Resolver thrown an error",
        data: {
          error: error.name,
          message: error.message,
          stack: error.stack,
        },
      };
    }

    state.allEvents.push(event);
    state.sequence += 1;
  }

  return {
    outcome: "SUCCESS",
    data: {
      results: successOutcomes,
    },
  };
}

function addEvent<S extends AggregateState<E>, E extends Event>(
  state: S,
  event: E,
  resolver: EventResolver<S, E>
): Outcome {
  const result = apply(state, event, resolver);

  if (result.outcome === "FAILURE") {
    return result;
  }

  state.uncommitedEvents.push(event);

  return result;
}
