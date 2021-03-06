# Stalagmite

![test](https://github.com/github/docs/actions/workflows/test.yml/badge.svg)

Stalagmite is a library that helps you building event sourced aggregates.

# Installation:

[![https://nodei.co/npm/stalagmite.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/stalagmite.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/stalagmite)

`npm install stalagmite`

# Documentation:

[Access documentation here with examples](https://sachacr.github.io/stalagmite/modules.html)

# Example:

In this example we will create a simple aggregate for a counter. Find the complete [counter example here](https://github.com/SachaCR/stalagmite/tree/main/src/examples/counter)

# buildAggregate()

```typescript
import { buildAggregate, Aggregate, AggregateState } from 'stalagmite';

export interface Counter extends Aggregate<CounterState, CounterEvents> {
  init(counterId: string, initialCount: number): Outcome;
  count(number: number): Outcome;
  reset(): Outcome;
}

export interface CounterState extends AggregateState {
  id: string;
  count: number;
}

function counterEventResolver( // It's this function that mutate the state when applying an event.
  state: CounterState,
  event: CounterEvents,
): Outcome {
  /*...*/
}

const commandId = 'command-id'; // The command you are building the aggregate for.

const aggregate = buildAggregate(commandId, initialState, eventResolver, {
  snapshotEvery: 2, // This options will generate snapshots every 2 events added
});

// Expose your business methods and expose aggregate methods.
return {
  init: () => {
    /*...*/
  },
  count: () => {
    /*...*/
  },
  reset: () => {
    /*...*/
  },
  ...aggregate,
};
```

To see an eventResolver example [click here](https://github.com/SachaCR/stalagmite/blob/main/src/examples/counter/events.ts#L85)

## Aggregate interface:

```typescript
// Aggregate interface
aggregate.apply(events: Event | Event[]): ApplyEventOutcome; // Apply an event to the aggregate.

aggregate.addEvent(events: E): Outcome; // Add and apply a new event to the aggregate.
aggregate.getUncommmitedEvents(): E[]; // Returns new events created not commited yet.
aggregate.eventsCommited(): void; // Call this function when you have saved those events in your event store. It clear the uncommited events array.

aggregate.getSequence(): number; // Returns aggregate sequence.
aggregate.state(): S; // Returns a deep copy of the current state.

aggregate.snapshot(): S; // Create an aggregate snapshot and return it.
aggregate.getSnapshot(): S[]; // Get all snapshots created.
aggregate.snapshotsCommited(): void; // Empty the list of snapshots.
```

[For more details click here ](https://sachacr.github.io/stalagmite/modules.html)
