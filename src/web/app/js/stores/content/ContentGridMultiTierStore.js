import { observable, action, toJS } from 'mobx';
import Store from 'stores/Store';
import endpoints from 'transport/endpoints';

/**
 * The Manage Content grid item store.
 */
class ContentGridMultiTierStore extends Store {
    @observable
    contentData = {};
    digitalRightsTypes = [];
    digitalRightsRegions = [];
    parentStatuses = [];

    contentId = null;
    data = null;

    /**
     * Sets manage content grid item data
     * @param {Object} manageContentData - manage content grid item data.
     */
    @action
    setManageContentGrid(manageContentData) {
        manageContentData.data.forEach((item, index) => {
            item.index = index;
        });
        this.contentData = manageContentData;
    }

    /**
     * Sets new select value.
     * @param {String} field - field name.
     * @param {Object} item - content item
     * @param {Object} event - event object
     * @param {String} contentLevel - content level name
     */
    @action
    changeSelectValue(field, item, contentLevel, value) {
        const fieldParts = field.split('.');
        if (fieldParts.length > 1) {
            this.contentData.data
                .filter(content => content.index == item.index)[0][fieldParts[0]][fieldParts[1]] = value;
        } else {
            this.contentData.data
                .filter(content => content.index == item.index)[0][field] = value;
        }
    }

    /**
     * Sets digital types
     * @param {Object} data - digital types data.
     */
    @action
    setDigitalRightsTypes(data) {
        this.digitalRightsTypes = data;
    }

    /**
     * Sets digital regions
     * @param {Object} data - digital regions data.
     */
    @action
    setDigitalRightsRegions(data) {
        this.digitalRightsRegions = data;
    }

    /**
     * Sets parent statuses
     * @param {Object} data - digital regions data.
     */
    @action
    setParentStatuses(data) {
        this.parentStatuses = data;
    }

    /**
     * Delete variance
     * @param {String} contentId - content id
     */
    @action
    deleteContent(contentId) {
        const data = this.contentData.data;

        let content = data.find(item => item.id === contentId);
        data.splice(data.indexOf(content), 1);
    }

    /**
     * @param {String} contentId
     * @param {String} contentLevel - content level name
     * @returns {Promise} - a call api promise
     */
    fetchDeleteContent(contentId, contentLevel) {
        return this.Transport.callApi(endpoints[contentLevel].DELETE_ITEM, null, [contentId])
            .then(this.deleteContent.bind(this, contentId));
    }

    /**
     * Fetch update status
     * @param {String} contentId - content id
     * @param {String} status - status
     * @param {String} contentLevel - content level name
     * @returns {Promise} - a call api promise
     */
    fetchUpdateContentStatus(item, value, contentLevel) {
        return this.Transport.callApi(endpoints[contentLevel].UPDATE_STATUS, null, [item.id, value]).then(() => {
            this.fetchCurrentPageData(this.contentId, contentLevel, this.data);
        })
    }

    /**
     * Fetch content rights availability
     * @param {String} contentId - content id
     * @param {String} status - status
     * @param {String} contentLevel - content level name
     * @returns {Promise} - a call api promise
     */
    fetchUpdateContentRightsAvailability(item, value, contentLevel) {
        return this.Transport.callApi(endpoints[contentLevel].UPDATE_RIGHTS_AVAILABILITY, null, [item.id, value]);
    }

    /**
     * Fetch content rights type
     * @param {String} contentId - content id
     * @param {String} status - status
     * @param {String} contentLevel - content level name
     * @returns {Promise} - a call api promise
     */
    fetchUpdateContentRightsType(item, value, contentLevel) {
        return this.Transport.callApi(endpoints[contentLevel].UPDATE_RIGHTS_TYPE, null, [item.id, value]);
    }

    /**
     * Fetch content rights type
     * @param {Object} data - pagination params
     * @param {String} contentId - content id
     * @param {String} contentLevel - content level name
     * @returns {Promise} - a call api promise
     */
    fetchCurrentPageData(contentId, contentLevel, data) {
        return this.Transport.callApi(endpoints[contentLevel].GET_CONTENT_PAGE, null, [contentId, data ? data.offset : 0]).then(res => {
            this.contentId = contentId;
            this.data = data ? data : 0;
            this.setManageContentGrid(res);
        });
    }

    /**
     * Fetch rights type.
     * @returns {Promise} a call api promise
     */
    fetchDigitalRightsTypes() {
        return this.Transport.callApi(endpoints.GET_DIGITAL_RIGHTS_TYPES)
            .then(response => {
                this.setDigitalRightsTypes(response.data)
            });
    }

    /**
     * Fetch rights regions.
     * @returns {Promise} a call api promise
     */
    fetchDigitalRightsRegions() {
        return this.Transport.callApi(endpoints.GET_DIGITAL_RIGHTS_REGIONS)
            .then(response => {
                this.setDigitalRightsRegions(response.data)
            });
    }

    /**
     * Fetch parent statuses.
     * @returns {Promise} a call api promise
     */
    fetchParentStatuses() {
        return this.Transport.callApi(endpoints.GET_CONTENT_PARENT_STATUSES)
            .then(response => {
                this.setParentStatuses(response.data)
            });
    }

    /**
     * Get content data
     * @returns {Object} content data
     */
    getData() {
        return toJS(this.contentData);
    }
}

export default ContentGridMultiTierStore;
