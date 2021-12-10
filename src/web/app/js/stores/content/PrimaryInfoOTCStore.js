import { observable, action } from 'mobx';
import endpoints from 'transport/endpoints';
import { getSetterName } from 'components/core/Utils'
import PrimaryInfoStore from 'stores/content/PrimaryInfoStore'

/**
 * The Primary Info store.
 */
class PrimaryInfoOTCStore extends PrimaryInfoStore {

    /** Content types list */
    @observable
    contentTypes = null;

    @action
    fetchData() {
        this.fetchContentTypes();
    }

    /**
     * Set content types
     * @param {Array} contentTypes - list of content types
     */
    @action
    setContentTypes(contentTypes) {
        this.contentTypes = contentTypes;
    }

    /**
     * Set content types
     * @param {Array} contentType - list of content types
     */
    @action
    setContentType(contentType) {
        this.data.contentType = contentType;
    }

    /**
     * Fetch content types
     * @returns {Promise} a call api promise
     */
    fetchContentTypes() {
        return this.Transport.callApi(endpoints.GET_ONE_TIER_CONTENT_TYPES).then(res => {
            this.setContentTypes.call(this, res.data);
        });
    }

    createData() {
        const data = super.createData();
        data['contentType'] = '';
        return data;
    }

}

export default PrimaryInfoOTCStore;
