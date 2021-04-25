# stalagmite

Stalagmite is a library that helps you building event sourced aggregates.

# typedoc:

[typedoc here](https://sachacr.github.io/stalagmite/)

# Example:

In this example we will create a simple aggregate for a counter. Find the complete [counter example here](https://github.com/SachaCR/stalagmite/tree/main/src/examples/counter)

## buildAggregate()

```typescript
import { buildAggregate } from "stalagmite";

const aggregate = buildAggregate(initialState, eventResolver);

// Build your counter interface and expose aggregate methods.
return {
  init: buildInit(aggregate),
  count: buildCount(aggregate),
  reset: buildReset(aggregate),
  ...aggregate,
};
```

## Aggregate interface:

```typescript
// Aggregate interface
aggregate.apply(events: Event | Event[]): Outcome; // Apply an event to the aggregate.
aggregate.addEvent(events: E): Outcome; // Add and apply a new event to the aggregate.
aggregate.eventsCommited(): void; // Call this function when you have saved those events in your event store. It clear the uncommited events array

aggregate.getSequence(): number; // Returns aggregate sequence
aggregate.getUncommmitedEvents(): E[]; // Returns new events created not commited yet
aggregate.getAllEvents(): E[]; // Returns all events (initial and new)
aggregate.state(): S; // Returns the current state.
```

## Declare your aggregate:

```typescript
// Declare your aggregate's events
export type CounterEvents = CounterInitiated | NumberCounted | CounterReseted;

// Declare your aggregate internal state
export interface CounterState extends AggregateState<CounterEvents> {
  id: string;
  count: number;
}

// Declare your aggregate's interface
export interface Counter extends Aggregate<CounterState, CounterEvents> {
  init(counterId: string, initialCount: number): Outcome;
  count(number: number): Outcome;
  reset(): Outcome;
}
```

## EventResolver:

It's a function that takes an event and apply it to the aggregate state.

```typescript
function eventResolver(state: CounterState, event: CounterEvents): Outcome {
  switch (event.name) {
    case "CounterInitiated":
      state.id = event.payload.counterId;
      state.count = event.payload.count;
      break;

    case "NumberCounted":
      state.count += event.payload.number;
      break;

    case "CounterReseted":
      state.count = event.payload.count;
      break;

    default:
      const { name: eventName } = event;
      missingSwitchCaseHandling(eventName);
  }

  return {
    outcome: "SUCCESS",
    data: {},
  };
}
```

# Declare you events :

```typescript
export interface CounterInitiated extends Event {
  name: "CounterInitiated";
  version: 1;
  payload: {
    counterId: string;
    count: number;
  };
}

export interface NumberCounted extends Event {
  name: "NumberCounted";
  version: 1;
  payload: {
    number: number;
  };
}

export interface CounterReseted extends Event {
  name: "CounterReseted";
  version: 1;
  payload: {
    count: number;
  };
}
```

# Implement counter busines logic:

```typescript
export function buildCount(aggregate: Aggregate<CounterState, CounterEvents>) {
  return function count(number: number): Outcome {
    const state = aggregate.state();

    // Business rules
    // We count only positive numbers
    if (number <= 0) {
      return {
        outcome: "FAILURE",
        errorCode: "COUNT_NUMBER_FAILED",
        reason: "Counter allow positive numbers only",
        data: {
          number,
        },
      };
    }

    // Create corresponding event
    const event = numberCounted(state, number);

    // Add it to the aggregate
    return aggregate.addEvent(event);
  };
}
```

# Command handler example:

```typescript
export async function counterNumberHandler(
  command: CountNumber
): Promise<Outcome> {
  const { counterId, number } = command.payload;

  const snapshot = await eventStore.getLatestSnapshot(counterId); // Retrieve the latest snapshot for this accountId
  const events = await eventStore.getEventFrom(snapshot); // Get event after this snapshot
  const counter = createCounter(command.id, snapshot); // Create an aggregate from the snapshot

  counter.apply(events); // Apply latest events

  counter.count(number); // Use aggregate methods to do business logic

  const uncomitedEvents = counter.getUncommmitedEvents(); // Retrieve business logic resulting events
  const result = await eventStore.save(uncomitedEvents); // Save them in the event store

  if (result.outcome === "FAILURE") {
    return result;
  }

  counter.eventsCommited(); // Clear the uncommited events

  return {
    outcome: "SUCCESS",
    data: {},
  };
}
```

# TODO

- [ ] Finish tests
- [ ] Improve README.md with more details and explanations
- [ ] Complete typedoc
