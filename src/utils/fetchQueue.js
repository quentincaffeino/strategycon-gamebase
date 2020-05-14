
import { createUnwrappedPromise } from './createUnwrappedPromise'


export const fetchQueue = () => {
  const queue = []
  const activeFetches = {}

  let interval = null

  function createFetchTask(resource) {
    const p = createUnwrappedPromise()

    return {
      promise: p.promise,
      run: () => {
        fetch(resource)
          .then(response => response.json())
          .then(p.resolve)
          .catch(p.reject)
          .finally(() => {
            delete activeFetches[resource]
          })
      }
    }
  }

  function dequeueAndFetch() {
    const task = queue.shift()
    if (task) {
      task.run()
    } else {
      clearInterval(interval)
    }
  }

  function createQueueInterval() {
    if (!interval) {
      interval = setInterval(() => dequeueAndFetch(), 2000)
    }
  }

  return {

    /**
     * @param {string} resource
     * @returns {Promise<string>}
     */
    fetch(resource) {
      let t = null

      if (resource in activeFetches) {
        t = activeFetches[resource]
      } else {
        t = createFetchTask(resource)
        activeFetches[resource] = t
        queue.push(t)
        createQueueInterval()
      }

      return t.promise
    }

  }
}
