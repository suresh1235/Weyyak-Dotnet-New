import { observable, action, toJS, computed } from 'mobx';
import Store from 'stores/Store';
import { getSetterName } from 'components/core/Utils'
import endpoints from 'transport/endpoints';

/**
 * The details base class store
 * Should be implemented in inheritors
 */
class SliderDetailsStore extends Store {

    /** Custom data observable object */
    @observable
    data = this.createData();

    @observable
    publishingPlatformsList = null;

    @observable
    types = null;

    previewLayouts = null;

    /**
     * Create data
     * @returns {{name: string, type: number}}
     */
    createData() {
        return {
            name: '',
            type: '',
            publishingPlatform: ''
        }
    }

    /**
     * Get preview layout for selected slider type and platform
     */
    @computed
    get previewImageUrl() {
        const { type, publishingPlatform } = this.data;
        const layout = this.previewLayouts && this.previewLayouts.filter(layout => layout.sliderType === parseInt(type)
            && layout.platform === parseInt(publishingPlatform))[0];

        return layout && layout.previewImageUrl;
    }

    /**
     * Base fetch data method for implementation in inheritors
     */
    @action
    fetchData() {
    }

    @action
    fetchPublishingPlatformsList() {
        return this.Transport.callApi(endpoints.GET_PUBLISHING_PLATFORMS)
            .then((res) => this.setPublishingPlatformsList(res.data));
    }

    @action
    fetchSliderTypes() {
        return this.Transport.callApi(endpoints.SLIDERS.GET_SLIDER_TYPES)
            .then((res) => this.setTypes(res.data));
    }

    fetchPreviewLayouts() {
        return this.Transport.callApi(endpoints.SLIDERS.GET_SLIDER_PREVIEW_LAYOUTS)
            .then((res) => this.setPreviewLayouts(res.data));
    }

    /**
     * Set slider name
     * @param {Array} name - slider name
     */
    @action
    setName(name) {
        this.data.name = name;
    }

    /**
     * Set slider type
     * @param {Array} type - slider type
     */
    @action
    setType(type) {
        this.data.type = type;
    }

    /**
     * Set default slider type
     */
    @action
    setDefaultType() {
        this.data.type = this.types[0].id;
    }

    /**
     * Set preview layout platform
     * @param {Array} platform - platform to set
     */
    @action
    setPublishingPlatform(platform) {
        this.data.publishingPlatform = platform;
    }

    /**
     * Set preview layouts
     * @param {Array} layouts - layouts to set
     */
    @action
    setPreviewLayouts(layouts) {
        this.previewLayouts = layouts;
    }

    /**
     * Set data
     * @param {Object} data - data
     */
    @action
    setData(data) {
        const { name, type, publishingPlatform = ''} = data;
        this.data = { name, type, publishingPlatform };
    }

    /**
     * Set platforms options list
     * @param {Array} layout - platforms to set
     */
    @action
    setPublishingPlatformsList(platforms) {
        this.publishingPlatformsList = platforms;
    }

    /**
     * Set slider types options list
     * @param {Array} types - types to set
     */
    @action
    setTypes(types) {
        this.types = types;
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
    clearData() {
        Object.keys(this.data).forEach((prop) => {
            this.data[prop] && this[getSetterName(prop)]('');
        });

        this.publishingPlatformsList = null;
        this.types = null;
        this.previewLayouts = null;
    }
}

export default SliderDetailsStore
