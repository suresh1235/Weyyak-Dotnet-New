import {observable, action, toJS, isObservableArray} from 'mobx';

import Store from 'stores/Store';
import endpoints from 'transport/endpoints';
import { getSetterName } from 'components/core/Utils';

/**
 * The Tag store
 */
class TagStore extends Store {
    /** Content tags */
    @observable
    tagsList = null;

    /** Custom data observable object */
    @observable
    data = {
        tags: [],
    };

    /**
     * Set tags data
     * @param tags
     */
    @action
    setData(tags) {
        this.data.tags = tags;
    }

    /**
     * Set tags collection
     * @param {Array} tags - list of tags
     */
    @action
    setTagsList(tags) {
        this.tagsList = tags;
    }

    /**
     * Set data tag
     * @param {Array} tags - list of tags
     */
    @action
    setTags(tags) {
        this.data.tags = tags.map(tag => tag.value);
    }

    /**
     * Fetch tags
     * @returns {Promise} a call api promise
     */
    fetchTags() {
        return this.Transport.callApi(endpoints.GET_TAGS).then(res => {
            this.setTagsList.call(this, res.data);
        });
    }

    /**
     * Create new tag
     * @param {Object} tagData - tag data object
     * @returns {Promise} a call api promise
     */
    createTag(tagData) {
        return this.Transport.callApi(endpoints.CREATE_TAG, tagData).then(this.fetchTags.bind(this));
    }

    /**
     * Retrieve normalized data object for the store
     * @returns {Object} normalized data
     */
    getData() {
        return this.data.tags;
    }

    /**
     * Empties all props in data object
     */
    clearData() {
        Object.keys(this.data).forEach((prop)=>{
            this[getSetterName(prop)]([]);
        });
    }

    /**
     * Gets store property
     *
     * @param key
     * @returns {*}
     */
    getStoreProperty(key) {
        const property = this.hasOwnProperty(key) ? this[key] : this.data[key];

        return isObservableArray(property) ? property.peek() : property;
    }
}

export default TagStore;
