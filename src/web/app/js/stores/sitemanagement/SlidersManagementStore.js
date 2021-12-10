import Store from 'stores/Store';
import endpoints from 'transport/endpoints';
import { observable, action, toJS } from 'mobx';
import EntityRegionStore from 'stores/shared/EntityRegionStore'
import InvalidationNotificationsStore from 'stores/shared/InvalidationNotificationsStore'
/**
 * The Sliders Management Store.
 */
class SlidersManagementStore extends Store {

    @observable
    data = {};

    constructor(...args) {
        super(...args);

        this.entityRegionStore = new EntityRegionStore(endpoints.SLIDERS.GET_SLIDER_REGION, ...args);
        this.invalidationNotificationStore = new InvalidationNotificationsStore(endpoints.SLIDERS.GET_SLIDER_INVALIDATION_NOTIFICATIONS, ...args);
    }

    @action
    deleteSlider(sliderId) {
        return this.Transport.callApi(endpoints.SLIDERS.DELETE_SLIDER, null, sliderId)
            .then(this.removeItem.bind(this, sliderId));
    }

    @action
    changeSliderAvailability(sliderId, available) {
        return this.Transport
            .callApi(endpoints.SLIDERS.CHANGE_SLIDER_AVAILABILITY, {
                id: sliderId,
                isDisabled: !available
            }, sliderId)
            .then(this.updateItemAvailability.bind(this, sliderId, available));
    }

    @action
    setData(data) {
        this.data = data;
    }

    /**
     * Fetch Sliders data.
     * @returns {Promise} a call api promise
     */
    @action
    fetchSliders(params) {
        const { searchText = '', offset = 0, limit } = params;
        this.setData(null);

        return this.Transport.callApi(endpoints.SLIDERS.GET_SLIDERS, null, [searchText, offset, limit])
            .then(res => {
                this.setData(res);
            });
    }

    /**
     * Clear store
     */
    @action
    clearStore() {
        this.data = [];
        this.entityRegionStore.clearStore();
        this.invalidationNotificationStore.clearStore();
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
        const { data: sliders } = this.data;
        var index = sliders.findIndex(value => value.id == id);
        sliders.splice(index, 1);
    }

    @action
    updateItemAvailability(id, available) {
        const { data: sliders } = this.data;
        var item = sliders.find(value => value.id == id);
        if (!!item) {
            item.isDisabled = !available;
        }
    }
}

export default SlidersManagementStore;
