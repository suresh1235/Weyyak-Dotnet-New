import { observable, action, toJS } from 'mobx';
import Store from 'stores/Store';

/**
 * The entity validation notification store.
 */
class InvalidationNotificationsStore extends Store {

    @observable
    data = [];

    endpoint = '';

    constructor(endpoint, ...args) {
        super(...args);

        this.endpoint = endpoint;
    }

    getNotifications() {
        return toJS(this.data);
    }
   
    @action
    setData(data) {
        this.data = data || [];
    }
   
    fetchData() {
        return this.Transport.callApi(this.endpoint)
            .then(data => {
                data && this.setData(data)
            });
    }

    getData() {
        return this.data;
    }

    @action
    clearStore() {
        this.data = [];
    }
}

export default InvalidationNotificationsStore;
