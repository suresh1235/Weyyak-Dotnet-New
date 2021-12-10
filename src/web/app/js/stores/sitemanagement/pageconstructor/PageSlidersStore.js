import { observable, action, toJS, computed } from 'mobx';
import Store from 'stores/Store';
import endpoints from 'transport/endpoints';
import constants from 'constants/constants';

/**
 * The page sliders store.
 */
class PageSlidersStore extends Store {

    /** Custom data observable object */
    @observable
    data = {
        sliders: [],
        defaultSlider: null,
    };
  
    @computed get sliders() {
        return toJS(this.data.sliders);
    }

    @computed get defaultSlider() {
        return toJS(this.data.defaultSlider);
    }

    @action
    setSliders(sliders) {
        this.data.sliders = sliders || [];
    } 

    @action
    setDefaultSlider(defaultSlider) {
        this.data.defaultSlider = defaultSlider || null;
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
    fetchSliders(searchText) {
        return this.Transport
        .callApi(
            endpoints.SLIDERS.GET_SLIDERS_SUMMARY, 
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
        this.data.sliders = [];
        this.data.defaultSlider = null;
    }
}

export default PageSlidersStore;
