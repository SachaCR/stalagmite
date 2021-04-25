# stalagmite

Stalagmit is a library that helps you building event sourced aggregates.

# Declare your aggregate interface:

```typescript
// Declare your aggregate's interface
export interface Counter extends Aggregate<CounterState, CounterEvents> {
  init(counterId: string, initialCount: number): Outcome;
  count(number: number): Outcome;
  reset(): Outcome;
}

// Declare your aggregate internal state
export interface CounterState extends AggregateState<CounterEvents> {
  id: string;
  count: number;
}

// Declare your aggregate's events
export type CounterEvents = CounterInitiated | NumberCounted | CounterReseted;
```

# Declare you events :

In this example we will declare events for a simple counter that count number.

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
