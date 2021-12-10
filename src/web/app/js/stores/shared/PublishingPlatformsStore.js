import { observable, action, computed } from 'mobx';
import Store from 'stores/Store';
import { getSetterName } from 'components/core/Utils'
import endpoints from 'transport/endpoints';

/**
 * The publishing platforms store.
 */
class PublishingPlatformsStore extends Store {

    /** Custom data observable object */
    @observable
    data = {
        publishingPlatforms: [],
    };

    @observable
    publishingPlatformsList = null;

    /**
     * Expose *All* check box option whether all publish platforms were selected
     */
    @computed
    get markAllPlatforms() {
        return this.publishingPlatformsList && this.data.publishingPlatforms.length === this.publishingPlatformsList.length;
    }

    /**
     * Adds or remove all platforms to data.
     */
    @action
    togglePlatforms() {
        if (!this.markAllPlatforms) {
            this.data.publishingPlatforms = [];
            this.publishingPlatformsList && this.publishingPlatformsList.forEach(platform => {
                    this.data.publishingPlatforms.push(platform.id)
                }
            )
        }
        else {
            this.data.publishingPlatforms = [];
        }
    }

    /**
     * Toggle platform
     * @param {Number} platformId - platform id
     * @param {Boolean} isChecked - whether platform checked
     */
    @action
    togglePlatform(platformId, isChecked) {
      console.log('togglePlatform', platformId, isChecked);
      
        if (isChecked) {
            this.removePlatform(platformId);
        }
        else {
            this.addPlatform(platformId);
        }
    }

    /**
     * Adds platform to data.
     * @param {Number} platformId - current platform id.
     */
    @action
    addPlatform(platformId) {
        this.data.publishingPlatforms.push(platformId);
    }

    /**
     * Removes platform from data.
     * @param {Number} platformId - current platform id.
     */
    @action
    removePlatform(platformId) {
        let platformIndex = this.data.publishingPlatforms.indexOf(platformId);
        this.data.publishingPlatforms.splice(platformIndex, 1);
    }

    /**
     * Set publishing platforms value.
     * @param {Object} publishingPlatforms - list of publishing platforms.
     */
    @action
    setPublishingPlatforms(publishingPlatforms) {
        this.publishingPlatformsList  = publishingPlatforms;
    }

    /**
     * Set data
     * @param {Array} data - data
     */
    @action
    setData(data) {
        this.data = data;
    }

    /**
     * Fetch publishing platforms.
     * @returns {Promise} a call api promise
     */
    fetchItemPublishingPlatforms() {
        return this.Transport.callApi(endpoints.GET_PUBLISHING_PLATFORMS)
            .then(result => result && result.data && this.setPublishingPlatforms(result.data));
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
        this.data.publishingPlatforms = [];
    }
}

export default PublishingPlatformsStore;
