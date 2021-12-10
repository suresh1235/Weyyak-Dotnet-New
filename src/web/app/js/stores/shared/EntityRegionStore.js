import { observable, action, toJS } from 'mobx';
import Store from 'stores/Store';
import endpoints from 'transport/endpoints';

/**
 * The Region store.
 */
class EntityRegionStore extends Store {

    @observable
    data = {};

    endpoint = '';

    constructor(endpoint, ...args) {
        super(...args);

        this.endpoint = endpoint;
    }
   
    getRegion(id) {
        const region = this.getData()[id];

        if (region) {
            return new Promise((resolve) => resolve(region));
        }

        return this.fetchRegion(id);
    }
  
    fetchRegion(id) {
        return this.Transport.callApi(this.endpoint, null, [id])
            .then(response => {
                if (response) {
                    const region = response.data;
                    this.setData(id, region);
                    return region;
                }
                return [];
            });
    }

    @action
    setData(id, region) {
        this.data[id] = region;
    }

    /**
     * Retrieve data object for the store
     * @returns {Object} normalized data
     */
    getData() {
        return toJS(this.data);
    }

    /**
     * Empties all props in data object
     */
    @action
    clearStore() {
        this.data = {};
    }
}

export default EntityRegionStore;
