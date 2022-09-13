// cache task queue
const queue = new Set();
let isFlushing = false;
const p = Promise.resolve();
/**
 * patch update schedule function
 * @returns queueJob
 */
export default function queueJob(job) {
  // add task
  queue.add(job);
  // refresh cache queue
  if (!isFlushing) {
    isFlushing = true;
    p.then(() => {
      // run job
      try {
        queue.forEach(job => job());
      } finally {
        // reset
        isFlushing = false;
        queue.length = 0;
      }
    });
  }
}
