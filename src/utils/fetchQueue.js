
import { createUnwrappedPromise } from './createUnwrappedPromise'


const defaultProps = {
  intervalMs: 2000
}


/**
 * @param {Object} props 
 */
export const fetchQueue = (props) => {
  props = Object.assign({}, defaultProps, props)

  /**
   * @var {Task}
   */
  const queue = []

  /**
   * @var {{ [String]: Promise<Response> }}
   */
  const activeFetches = {}

  let interval = null

  /**
   * @param {String} resource
   * @param {Object} opts
   * @returns {Task}
   */
  function createFetchTask(resource, opts) {
    const p = createUnwrappedPromise()

    return {
      promise: p.promise,
      run: () => {
        fetch(resource, opts)
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
      interval = setInterval(() => dequeueAndFetch(), props.intervalMs)
    }
  }

  return {

    /**
     * @param {String} resource
     * @param {Object} opts
     * @returns {Promise<Response>}
     */
    fetch(resource, opts) {
      let t = null

      if (resource in activeFetches) {
        t = activeFetches[resource]
      } else {
        t = createFetchTask(resource, opts)
        activeFetches[resource] = t
        queue.push(t)
        createQueueInterval()
      }

      return t.promise
    }

  }
}
