/**
 * The definition of the base store.
 * The store's responsibilities:
 * - defines a transport level of a communication with a middleware
 */
class Store {

    /**
     * Construct a store instance
     * @param {Object} transport - a transport level
     */
    constructor(transport) {
        this.transport = transport;
    }

    /**
     * Get a transport level
     * @returns {Object} a transport level
     */
    get Transport() {
        return this.transport;
    }

    /**
     * Set a transport level
     * @param {Object} transport - a transport level
     */
    set Transport(transport) {
        this.transport = transport;
    }
}

export default Store;