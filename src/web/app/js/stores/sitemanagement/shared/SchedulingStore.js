import { observable, action, toJS } from 'mobx';
import Store from 'stores/Store';
import endpoints from 'transport/endpoints';
import { getSetterName } from 'components/core/Utils'

/**
 * The Scheduling store.
 */
class SchedulingStore extends Store {

    /** Custom data observable object */
    @observable
    data = {
        schedulingStartDate: null,
        schedulingEndDate: null,
    };

    /**
     * Set data by property name
     * @param {String} name - data property name
     * @param {Object} value - data property value
     */
    @action
    setDataByName(name, value) {
        this.data[name] = value
    }

    /**
     * Set data
     * @param {Array} data - data
     */
    @action
    setData(data) {
        if (data) {
            this.data = {
                schedulingEndDate: data.schedulingEndDate,
                schedulingStartDate: data.schedulingStartDate
            };
        }
    }

    /**
     * Retrieve data object for the store
     * @returns {Object} normalized data
     */
    getData() {
        return this.data;
    }

    /**
     * Empties all props in data object
     */
    @action
    clearData() {
        Object.keys(this.data).forEach(prop => {
            this.data[prop] = null;
        });
    }
}

export default SchedulingStore;
