import Store from 'stores/Store';
import endpoints from 'transport/endpoints';
import { observable, action, toJS } from 'mobx';
import EntityRegionStore from 'stores/shared/EntityRegionStore'
/**
 * The Pages Management Store.
 */
class PagesManagementStore extends Store {

    @observable
    data = {};

    constructor(...args) {
        super(...args);

        this.entityRegionStore = new EntityRegionStore(endpoints.PAGES.GET_PAGE_REGION, ...args);
    }

    @action
    deletePage(pageId) {
        return this.Transport.callApi(endpoints.PAGES.DELETE_PAGE, null, pageId)
            .then(this.removeItem.bind(this, pageId));
    }

    @action
    changePageAvailability(pageId, available){
        return this.Transport
            .callApi(endpoints.PAGES.CHANGE_PAGE_AVAILABILITY, {
                id: pageId,
                isDisabled: !available
            }, pageId)
            .then(this.updateItemAvailability.bind(this, pageId, available));
    }

    @action
    setPages(data) {
        this.data = data;
    }

    /**
     * Fetch pages data.
     * @returns {Promise} a call api promise
     */
    @action
    fetchPages(params) {
        const { searchText = '', offset = 0, limit} = params;
        this.setPages(null);

        return this.Transport.callApi(endpoints.PAGES.GET_PAGES, null, [searchText, offset, limit])
        .then(res => {
            this.setPages(res);
        });
    }

    /**
     * Clear store
     */
    @action
    clearStore() {
        this.data = [];
        this.entityRegionStore.clearStore();
    }

    /**
     * Get content data
     * @returns {Object} content data
     */
    getData() {
        return toJS(this.data);
    }

    /**
     * Removes editor from the storage
     * @param {String} editorId - editor's identifier
     */
    @action
    removeItem(id) {
        const { data: pages } = this.data;
        var index = pages.findIndex(value => value.id == id);
        pages.splice(index, 1);
    }

    @action
    updateItemAvailability(id, available) {
        const { data: pages } = this.data;
        var item = pages.find(value => value.id == id);
        if (!!item) {
            item.isDisabled = !available;
        }
    }
}

export default PagesManagementStore;
