import { observable, action, toJS, computed } from 'mobx';
import Store from 'stores/Store';
import endpoints from 'transport/endpoints';
import { getSetterName } from 'components/core/Utils'
import constants from 'constants/constants';

/**
 * The pages store.
 */
class AttachedToPagesStore extends Store {

    /** Custom data observable object */
    @observable
    data = {
        pages: []
    };
  
    @computed get pages() {
        return toJS(this.data.pages);
    }

    @action
    setPages(pages) {
        this.data.pages = pages || [];
    } 

    /**
     * Set data
     * @param {Object} data - data
     */
    @action
    setData(data) {
        this.data = data;
    }

    @action
    fetchPages(searchText) {
        return this.Transport
        .callApi(
            endpoints.PAGES.GET_PAGES_SUMMARY, 
            null, 
            [searchText || '', 0, constants.MULTISELECT_SEARCH.SEARCH_LIMIT]);
    }

    /**
     * Retrieve normalized data object for the store
     * @returns {Object} normalized data
     */
    getData() {
        return toJS(this.data)
    }

    /**
     * Empties all props in data object
     */
    @action
    clearData() {
        this.data.pages = [];
    }
}

export default AttachedToPagesStore;
