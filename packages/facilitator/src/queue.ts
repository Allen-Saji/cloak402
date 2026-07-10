/**
 * Per-key task serialization. eERC transfer proofs commit to the sender's
 * exact balance ciphertext, so two in-flight payments from one account would
 * make the second revert on-chain. Settlements for the same sender must run
 * one at a time; different senders proceed in parallel.
 */
export class KeyedQueue {
  private tails = new Map<string, Promise<unknown>>();

  run<T>(key: string, task: () => Promise<T>): Promise<T> {
    const tail = this.tails.get(key) ?? Promise.resolve();
    const next = tail.then(task, task);
    const tracked = next.catch(() => {}).then(() => {
      if (this.tails.get(key) === tracked) this.tails.delete(key);
    });
    this.tails.set(key, tracked);
    return next;
  }
}
