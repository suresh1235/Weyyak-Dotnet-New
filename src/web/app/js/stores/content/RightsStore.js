import { observable, action, toJS } from 'mobx';
import Store from 'stores/Store';
import endpoints from 'transport/endpoints';
import { getSetterName } from 'components/core/Utils'
/**
 * The Rights store.
 */
class RightsStore extends Store {

    /** Custom data observable object */
    @observable
    data = {
            digitalRightsType: null,
            digitalRightsRegions: [],
            digitalRightsStartDate: null,
            digitalRightsEndDate: null,
            subscriptionPlans: []
        };

    @observable
    digitalRightsTypes = null;

    @observable
    digitalRightsRegions = null;

    @observable
    expandedNodes = [];
    
    @observable
    subscriptionPlans= [];
    /**
     * Set data by property name
     * @param {String} name - data property name
     * @param {Object} value - data property value
     */
    @action
    setDataByName(name, value) {
        this.data[name] = value      
    }

    @action
    updateDataByName(name,value){
        this.data[name] = value      
    }
    /**
     * Returns digital rights regions
     * @returns {Array} digital rights regions
     */
    getRightsRegions() {
        return toJS(this.digitalRightsRegions);
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
    getExpandedNodes(nodes) {
        return toJS(this.expandedNodes);
    }

    /**
     * Set data
     * @param {Array} data - data
     */
    @action
    setData(data) {
        if (data) {
            this.data = data;
        }
    }

    /**
     * Set digital rights types
     * @param {Object} digitalRightsTypes
     */
    @action
    setDigitalRightsTypes(digitalRightsTypes) {
        this.digitalRightsTypes = digitalRightsTypes;
    }

    /**
     * Format digital rights regions data
     * @param {Object} digitalRightsRegions
     * @returns {Object} formatted data
     */
    formatDigitalRightsRegionsData(digitalRightsRegions) {
        return digitalRightsRegions.map(region => {
            region.value = region.id ? region.id.toString() : region.name;
            region.label = region.name;
            if ( region.regions ) {
                region.children = this.formatDigitalRightsRegionsData(region.regions);
            }
            if ( region.countries ) {
                region.children = this.formatDigitalRightsRegionsData(region.countries);
            }
            return region
        });
    }

    @action fetchPlans () {
        return this.Transport
          .callApi (endpoints.PLANS)
          .then (res => {       
          
            this.setsubscriptionPlans (res);
          })
          .catch (err => console.log (err));
      }
      @action setsubscriptionPlans (plans) {
        this.subscriptionPlans = plans;
      }
    /**
     * Set digital rights regions
     * @param {Object} digitalRightsRegions
     */
    @action
    setDigitalRightsRegions(digitalRightsRegions) {
        digitalRightsRegions = this.formatDigitalRightsRegionsData(digitalRightsRegions.data);
        this.digitalRightsRegions = [{
            value: 'All',
            label: 'All',
            children: digitalRightsRegions}];
    }

    /**
     * Fetch all maps
     */
    fetchAllRightsMaps(){
        let promises = [
            this.fetchDigitalRightsTypes(),
            this.fetchDigitalRightsRegions(),
            this.fetchPlans()
        ];
        return Promise.all(promises);
    }

    /**
     * Fetch rights type.
     * @returns {Promise} a call api promise
     */
    fetchDigitalRightsTypes() {
        return this.Transport.callApi(endpoints.GET_DIGITAL_RIGHTS_TYPES)
            .then(rightsTypes => {
                rightsTypes && rightsTypes.data && this.setDigitalRightsTypes(rightsTypes.data)
        });
    }

    /**
     * Fetch rights regions.
     * @returns {Promise} a call api promise
     */
    fetchDigitalRightsRegions() {
        return this.Transport.callApi(endpoints.GET_DIGITAL_RIGHTS_REGIONS)
            .then(rightsRegions => {
                rightsRegions && this.setDigitalRightsRegions(rightsRegions)
            });
    }

    /**
     * Retrieve data object for the store
     * @returns {Object} normalized data
     */
    @action
    getData() {
        if(this.data.subscriptionPlans==null){
            this.data.subscriptionPlans=[];
            return this.data;
        }else{
            return this.data;
        }
    }
    @action
    clearRights() {
        this.rights.clearRights();
    }
    /**
     * Empties all props in data object
     */
    @action
    clearData() {
        Object.keys(this.data).forEach(prop => {
            this.data[prop] = ( prop == 'digitalRightsRegions' ) ? [] : null;
        });
        this.expandedNodes = [];
    }
}

export default RightsStore;
