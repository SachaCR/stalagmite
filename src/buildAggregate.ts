import { AggregateState, Aggregate, Event, EventResolver } from "./interfaces";

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
    state: () => Object.assign({}, state), // Warning this is a not deep copy. You should never manipulate state outside aggregate boundaries.
  };
}

function apply<S extends AggregateState<E>, E extends Event>(
  state: S,
  events: E | E[],
  resolver: EventResolver<S, E>
): "FAILURE" | "SUCCESS" {
  const eventList = Array.isArray(events) ? events : [events];

  for (let i = 0; i < eventList.length; i++) {
    const event = eventList[i];

    if (event.sequence !== state.sequence + 1) {
      return "FAILURE";
    }

    const result = resolver(state, event);

    if (result === "FAILURE") {
      return "FAILURE";
    }

    state.allEvents.push(event);
    state.sequence += 1;
  }

  return "SUCCESS";
}

function addEvent<S extends AggregateState<E>, E extends Event>(
  state: S,
  event: E,
  resolver: EventResolver<S, E>
): "FAILURE" | "SUCCESS" {
  const result = apply(state, event, resolver);

  if (result === "FAILURE") {
    return result;
  }

  state.uncommitedEvents.push(event);

  return result;
}
