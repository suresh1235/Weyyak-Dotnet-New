import { observable, action } from 'mobx';
import { getSetterName } from 'components/core/Utils'
import Store from 'stores/Store';

/**
 * Content base class store
 * Should be implemented in inheritors
 */
class ContentStoreBase extends Store {
    id = null;

    @observable
    status = null;

    /**
     * Empties all props in data object
     */
    @action
    clearData() {
        this.id = null;
        this.status = null;
    }

    /**
     * Set content id and status
     * @param {String} id - content id
     * @param {Number} status - status
     */
    @action
    setIdAndStatus(id, status) {
        this.id = id;
        this.status = status;
    }

    /**
     * Fetch content by id base method for implementation in inheritors
     * @param {String} contentId - content id
     * @returns {Promise}
     */
    @action
    fetchContent(contentId) {
    }


    /**
     * Create content published base method for implementation in inheritors
     * @returns {Promise}
     */
    createContentPublished() {
    }

    /**
     * Create content draft base method for implementation in inheritors
     * @returns {Promise}
     */
    createContentDraft() {
    }

    /**
     * Set stores
     * @param {Object} data - content title object
     */
    setStores(data) {
        this.setIdAndStatus(data.id, data.status)
    }
}

export default ContentStoreBase;
