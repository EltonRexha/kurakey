import { EventEmitter } from 'events';

/*
 * Ensures a single EventEmitter instance across hot-reloads / multiple imports
 * in the same Node process.
 */
const globalForEmitter = globalThis as unknown as {
  notificationEmitter?: EventEmitter;
};

const emitter =
  globalForEmitter.notificationEmitter ||
  (() => {
    const e = new EventEmitter();
    e.setMaxListeners(0); // unlimited listeners per user channels
    return e;
  })();

if (!globalForEmitter.notificationEmitter) {
  globalForEmitter.notificationEmitter = emitter;
}

export default emitter; 