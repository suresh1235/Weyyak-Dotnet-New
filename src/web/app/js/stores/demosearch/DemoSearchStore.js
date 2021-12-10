import { observable, action } from 'mobx';

import Store from 'stores/Store';
import endpoints from 'transport/endpoints';

/**
 * The data list store
 */
class DemoSearchStore extends Store {
    /** The data list */
    @observable
    data = null;

    /**
     * Get data
     * @returns {Object} data
     */
    getData() {
        return this.data;
    }

    /**
     * Set data details
     * @param {Object} data - data details to be set
     */
    @action
    setData(data) {
        this.data = data;
    }

    /**
     * Set data data
     * @param {Array} dataData - data details to be set
     */
    setDataData(dataData) {
        const { pagination } = this.getData();
        this.setData({pagination, data: dataData});
    }

    /**
     * Fetch data
     * @params {Object} params - fetch parameters
     * @returns {Promise} - a call api promise
     */
    fetchData(params) {
        this.setData(null);
        return this.Transport.callApi(endpoints.GET_SEARCH_DEMO_DATA, null, params).then(this.setData.bind(this));
    }
}

export default DemoSearchStore;
