import { createCounter } from '..';

describe('snapshot()', () => {
  describe('Given a counter', () => {
    const counter = createCounter('commandId');
    counter.init('counter-id', 4);
    counter.count(12);

    describe('When I create a snapshot', () => {
      const snapshot = counter.snapshot();

      it('Then it returns a the snapshot', () => {
        expect(snapshot).toStrictEqual({
          count: 16,
          id: 'counter-id',
          sequence: 2,
        });
      });

      it('And the snapshot is in the list', () => {
        const snapshots = counter.getSnapshot();
        expect(snapshots).toStrictEqual([
          {
            count: 16,
            id: 'counter-id',
            sequence: 2,
          },
        ]);
      });

      it('And when I call snapshotCommited() it clear the snaphots array', () => {
        counter.snapshotsCommited();
        const snapshots = counter.getSnapshot();
        expect(snapshots).toStrictEqual([]);
      });
    });
  });
});
