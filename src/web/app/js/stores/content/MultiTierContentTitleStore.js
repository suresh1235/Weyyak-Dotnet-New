import { action } from 'mobx';
import endpoints from 'transport/endpoints';
import { getSetterName } from 'components/core/Utils'
import PrimaryInfoTitleMTCStore from 'stores/content/PrimaryInfoTitleMTCStore';
import ContentGenresStore from  'stores/content/ContentGenresStore';
import constants from 'constants/constants';
import ContentStoreBase from 'stores/content/ContentStoreBase';
import SeoDetails from 'stores/content/SeoDetailsStore';

/**
 * The Multi tier content title store
 */
class MultiTierContentTitleStore extends ContentStoreBase {

    /**
     * Construct a multi tier content title store
     * @param {Array} args - a store's arguments
     */
    constructor(args) {
        super(args);
        this.primaryInfo = new PrimaryInfoTitleMTCStore(args);
        this.contentGenres = new ContentGenresStore(args);
        this.seoDetails = new SeoDetails(...args);
    }

    /**
     * Fetch multi tier content title
     * @param {String} id - content id
     * @returns {Promise}
     */
    @action
    fetchContent(id) {
        return this.Transport.callApi(endpoints.GET_MULTI_TIER_CONTENT_TITLE, null, [id]).then(res => {
            res && res.data && this.setStores(res.data);
        });
    }

    /**
     * Set title id
     * @param id
     */
    @action
    setId(id) {
        this.id = id;
    }

    /**
     * Set stores
     * @param {Object} data - content title object
     */
    @action
    setStores(data) {
        super.setStores(data);
        data.primaryInfo && this.primaryInfo.setData(data.primaryInfo);
        data.contentGenres && this.contentGenres.setRepeaterData(data.contentGenres);
        data.seoDetails && this.seoDetails.setData(data.seoDetails);
    }

    /**
     * Empties all props in data object
     */
    @action
    clearData() {
        super.clearData();
        this.primaryInfo.clearData();
        this.contentGenres.clearData();
        this.seoDetails.clearData();
    }

    /**
     * Create multi tier content title published
     * @returns {Promise}
     */
    createContentPublished() {
        return this.Transport.callApi(endpoints.CREATE_MULTI_TIER_TITLE_PUBLISHED, {
                primaryInfo: this.primaryInfo.getData(),
            contentGenres: this.contentGenres.getData(),
            seoDetails: this.seoDetails.getData()
            }
        ).then(res => {
            res && res.data && this.setIdAndStatus(res.data, constants.CONTENT.STATUSES.PUBLISHED);
        });
    }

    /**
     * Create multi tier content draft
     * @returns {Promise}
     */
    createContentDraft() {
        return this.Transport.callApi(endpoints.CREATE_MULTI_TIER_TITLE_DRAFT, {
                primaryInfo: this.primaryInfo.getData(),
            contentGenres: this.contentGenres.getData(),
            seoDetails: this.seoDetails.getData()
            }
        ).then(res => {
            res && res.data && this.setIdAndStatus(res.data, constants.CONTENT.STATUSES.DRAFT);
        });
    }

    /**
     * Update content published
     * @returns {Promise}
     */
    updateContentPublished() {
        return this.Transport.callApi(endpoints.UPDATE_MULTI_TIER_TITLE_PUBLISHED, {
                primaryInfo: this.primaryInfo.getData(),
            contentGenres: this.contentGenres.getData(),
            seoDetails: this.seoDetails.getData()
            }, [this.id]
        ).then(res => {
            res && res.data && this.setIdAndStatus(res.data, constants.CONTENT.STATUSES.PUBLISHED);
        });
    }

    /**
     * Update multi tier content draft
     * @returns {Promise}
     */
    updateContentDraft() {
        return this.Transport.callApi(endpoints.UPDATE_MULTI_TIER_TITLE_DRAFT, {
                primaryInfo: this.primaryInfo.getData(),
            contentGenres: this.contentGenres.getData(),
            seoDetails: this.seoDetails.getData()
            }, [this.id]
        ).then(res => {
            res && res.data && this.setIdAndStatus(res.data, constants.CONTENT.STATUSES.DRAFT);
        });
    }
}

export default MultiTierContentTitleStore;
