import { observable, action, toJS } from 'mobx';
import Store from 'stores/Store';
import endpoints from 'transport/endpoints';

/**
 * The Regions store.
 */
class RegionsStore extends Store {

    /** Custom data observable object */
    @observable
    data = {
            regions: [],
        };

    @observable
    regionsList = null;

    @observable
    expandedNodes = [];

    /**
     * Returns regions
     * @returns {Array} regions
     */
    getRegions() {
        return toJS(this.regionsList);
    }

    /**
     * Set expanded nodes
     * @param {Array} nodes - expanded nodes
     */
    @action
    setExpandedNodes(nodes) {
        this.expandedNodes = nodes;
    }

    /**
     * Returns expanded nodes
     * @returns {Array} expanded nodes
     */
    getExpandedNodes() {
        return toJS(this.expandedNodes);
    }

    /**
     * Format regions data
     * @param {Object} regions
     * @returns {Object} formatted data
     */
    formatRegionsData(regions) {
        return regions.map(region => {
            let formattedRegion = {};
            formattedRegion.value = region.id ? region.id.toString() : region.name;
            formattedRegion.label = region.name;
            if (region.regions) {
                formattedRegion.children = this.formatRegionsData(region.regions);
            }
            if (region.countries) {
                formattedRegion.children = this.formatRegionsData(region.countries);
            }
            return formattedRegion
        });
    }

    /**
     * Set data by property name
     * @param {String} name - data property name
     * @param {Object} value - data property value
     */
    @action
    setDataByName(name, value) {
        this.data[name] = value;
    }

    /**
     * Set data
     * @param {Array} data - data
     */
    @action
    setData(regions) {
        if (regions) {
            this.data.regions = regions;
        }
    }

    /**
     * Set digital rights regions
     * @param {Object} regions
     */
    @action
    setRegions(regions) {
        regions = this.formatRegionsData(regions.data);
        this.regionsList = [{
            value: 'All',
            label: 'All',
            children: regions}];
    }

    /**
     * Fetch rights regions.
     * @returns {Promise} a call api promise
     */
    fetchRegions() {
        return this.Transport.callApi(endpoints.GET_DIGITAL_RIGHTS_REGIONS)
            .then(regions => {
                regions && this.setRegions(regions)
            });
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
        this.data.regions = [];
        this.expandedNodes = [];
    }
}

export default RegionsStore;
