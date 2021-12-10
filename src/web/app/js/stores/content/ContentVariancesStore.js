import { observable, computed, action, toJS } from 'mobx';

import Store from 'stores/Store';
import constants from 'constants/constants';
import endpoints from 'transport/endpoints';
import { getSetterName } from 'components/core/Utils'

/**
 * The Primary Info store.
 */
class ContentVariancesStore extends Store {

    /** Custom data observable object */
    @observable
    data = [
        {
            id: '',
            videoContentId: '',
            introDuration: null,
            // IntroDuration:null,
            introStart:'00:00:05',
            // IntroStart:5,
            languageType: null,
            dubbingLanguage: null,
            subtitlingLanguage: null,
            dubbingDialectId: null,
            digitalRightsType: null,
            digitalRightsRegions: [],
            digitalRightsStartDate: null,
            digitalRightsEndDate: null,
            schedulingDateTime: null,
            overlayPosterImage: '',
            dubbingScript: '',
            subtitlingScript: '',
            publishingPlatforms: [],
            products: [],
            subscriptionPlans:[],
            varianceTrailers:[{
                englishTitle: '',
                arabicTitle: '',
                videoTrailerId: '',
                trailerposterImage: ''
            }]
        }
    ];
    @observable
    originTypes = null;
    @observable
    dubbing = null;
    @observable
    subtitling = null;
    @observable
    dialects = null;
    @observable
    digitalRightsTypes = null;
    @observable
    digitalRightsRegions = null;
    @observable
    publishingPlatformsList = null;
    @observable
    defaultMultipleCheckboxContainer = [
        false
    ];
    @observable
    expandedVariances = [
      false
    ];
    @observable
    products = null;
    @observable
    expandedNodes = [];
    @observable
    subscriptionPlans=null;
    @observable
    countryCheck = false
    /**
     * Image uploading visual indicator
     */
    @observable
    uploadStatus = [
        {
            overlayPosterImage: '',
            dubbingScript: '',
            subtitlingScript: ''
        }
    ];

    /**
     * Image metadata for request
     */
    metadataMap = {
        overlayPosterImage: 'overlay-poster-image',
        dubbingScript: 'dubbing-script',
        subtitlingScript: 'subtitling-script'
    };

    /**
     * Trailer Image uploading visual indicator
     */
    @observable
    TrailerPosterUploadStatus =[[{
        trailerposterImage: '',
        }]
    ]
    /**
     * Image metadata for request
     */
    TrailerMetadataMap = {
        trailerposterImage: 'trailer-poster-image'
    };


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
     * Adds or remove all platforms to data.
     * @param {Number} index - index of variance.
     */
    @action
    toggleCheckboxes(index) {
        this.defaultMultipleCheckboxContainer[index] = !this.defaultMultipleCheckboxContainer[index];
        this.data[index].publishingPlatforms = [];
        this.defaultMultipleCheckboxContainer[index] && (
            this.publishingPlatformsList && this.publishingPlatformsList.forEach(platform => {
                this.data[index].publishingPlatforms.push(platform.id)
            })
        )
    }

    /**
     * Expose *All* check box option if all publish platforms were selected
     */
    markAllPlatformsSelected(){
        this.publishingPlatformsList && this.data.forEach((variance, index) => {
            if(variance.publishingPlatforms.length == this.publishingPlatformsList.length){
                this.defaultMultipleCheckboxContainer[index] = true;
            }
        });
    }

    /**
     * Toggle platform
     * @param {Number} platformId - platform id
     * @param {Boolean} isChecked - whether platform checked
     * @param {Number} index - index of variance.
     */
    @action
    togglePlatform(platformId, isChecked, index) {
        if (isChecked) {
            this.removePlatform(platformId, index);
        }
        else {
            this.addPlatform(platformId, index);
        }
    }

    /**
     * Adds platform to data.
     * @param {Number} platformId - current platform id.
     * @param {Number} index - index of variance.
     */
    @action
    addPlatform(platformId, index) {
        this.data[index].publishingPlatforms.push(platformId);

        this.defaultMultipleCheckboxContainer[index] =
            this.data[index].publishingPlatforms.length == this.publishingPlatformsList.length;
    }

    /**
     * Removes platform from data.
     * @param {Number} platformId - current platform id.
     * @param {Number} index - index of variance.
     */
    @action
    removePlatform(platformId, index) {
        let platformIndex = this.data[index].publishingPlatforms.indexOf(platformId);
        this.data[index].publishingPlatforms.splice(platformIndex, 1);

        this.defaultMultipleCheckboxContainer[index] =
            this.data[index].publishingPlatforms.length == this.publishingPlatformsList.length;
    }

    /**
     * Uploads file to server.
     * @param {String} name - name of field.
     * @param {Object} file - file which will be uploaded to the server.
     */
    @action
    updateFile(index, name, file) {
        this.Transport.callApi(endpoints.SAVE_NON_TEXTUAL_IMAGES, {
            file
        }, this.metadataMap[name]).then(this.handleErrors)
            .then(response => {
                this.setUploadStatus(index, name, 'success', response.data)
            })
            .catch(error => {
                this.setUploadStatus(index, name, 'failed')
            });
    }

    /**
     * Change upload status.
     * @param {String} name - name of field.
     * @param {String} status - name of current status.
     * @param {Object} response - data from server.
     */
    @action
    setUploadStatus(index, name, status, id) {
        this.data[index][name] = id;
        this.uploadStatus[index][name] = status;
    }

    /**
     * Resets field.
     * @param {String} name - name of field.
     */
    @action
    resetField(index, name) {
        this.data[index][name] = '';
        this.setUploadStatus(index, name, null)
    }

    // Trailer related image upload Functions ...............

    /**
     * Uploads file to server.
     * @param {String} name - name of field.
     * @param {Object} file - file which will be uploaded to the server.
     */
    @action
    TrailerUpdateFile(index,TrailerNum, name, file) {
        this.Transport.callApi(endpoints.SAVE_NON_TEXTUAL_IMAGES, {
            file
        }, this.TrailerMetadataMap[name]).then(this.handleErrors)
            .then(response => {
                this.setTrailerUploadStatus(index,TrailerNum, name, 'success', response.data)
            })
            .catch(error => {
                this.setTrailerUploadStatus(index,TrailerNum, name, 'failed')
            });
    }

    /**
     * Change upload status.
     * @param {String} name - name of field.
     * @param {String} status - name of current status.
     * @param {Object} response - data from server.
     */
    @action
    setTrailerUploadStatus(index,trailerIndex, name, status, id) {
        this.data[index].varianceTrailers[trailerIndex][name] = id;
        this.TrailerPosterUploadStatus[index][trailerIndex][name] = status;
    }

    /**
     * Resets field.
     * @param {String} name - name of field.
     */
    @action
    resetTrailerField(index,trailerIndex, name) {
        this.data[index].varianceTrailers[trailerIndex][name] = '';
        this.setTrailerUploadStatus(index,trailerIndex, name, null)
    }

    /**
     * Error handler
     * @param {Object} response - response from the server.
     * @returns {Object} - response from the server..
     */
    handleErrors(response) {
        if (!response.data) {
            throw Error(response.statusText);
        }
        return response;
    }

    /**
     * Retrieve file upload status.
     * @returns {String} - file upload status.
     */
    getUploadStatus(index) {
        return toJS(this.uploadStatus[index]);
    }

    /**
     * Retrieve file upload status.
     * @returns {String} - file upload status.
     */
    getTrailerUploadStatus(index,TrailerNum) {
        // console.log(toJS(this.TrailerPosterUploadStatus))
        // return toJS(this.TrailerPosterUploadStatus[index][TrailerNum]);
        return toJS(this.TrailerPosterUploadStatus[0][TrailerNum]);
    }

    /**
     * Add new empty item
     */
    // @action
    // addItem(expanded = false) {
    //     let dataTemplate = {
    //         id: '',
    //         videoContentId: '',
    //         languageType: null,
    //         dubbingLanguage: null,
    //         subtitlingLanguage: null,
    //         dubbingDialectId: null,
    //         digitalRightsType: null,
    //         digitalRightsRegions: [],
    //         digitalRightsStartDate: null,
    //         digitalRightsEndDate: null,
    //         schedulingDateTime: null,
    //         overlayPosterImage: '',
    //         dubbingScript: '',
    //         subtitlingScript: '',
    //         publishingPlatforms: [],
    //         products: [],
    //         subscriptionPlans:[]
    //     };
    //     let uploadStatusTemplate = {
    //         overlayPosterImage: '',
    //         dubbingScript: '',
    //         subtitlingScript: ''
    //     };
    //     this.expandedVariances.push(expanded);
    //     this.defaultMultipleCheckboxContainer.push(false);
    //     this.uploadStatus.push(uploadStatusTemplate);
    //     this.data.push(dataTemplate);
    // }


    @action
    addItem(expanded = false) {
        const videoContentId = this.data.map (
            variance => variance.videoContentId
          );
          const introDuration = this.data.map (
            variance => variance.introDuration
          );
        //   const IntroDuration = this.data.map (
        //     variance => variance.IntroDuration
        //   );
          const introStart = this.data.map (
            variance => variance.introStart
          );
          console.log(introStart)
        //   const IntroStart = this.data.map (
        //     variance => variance.IntroStart
        //   );
        const languageType = this.data.map(
          variance => variance.languageType   
        );
        const dubbingLanguage = this.data.map(
            variance => variance.dubbingLanguage
        );
        const dubbingDialectId = this.data.map(
            variance => variance.dubbingDialectId
        );
        const overlayPosterImage = this.data.map(
            variance => variance.overlayPosterImage
        )

        let dataTemplate = {
            id: '',
            videoContentId: videoContentId[0],
            introDuration:introDuration[0],
            // IntroDuration:IntroDuration[0],
            introStart:introStart[0],
            // IntroStart:IntroStart[0],
            languageType: languageType[0],
            dubbingLanguage: dubbingLanguage[0],
            subtitlingLanguage: null,
            dubbingDialectId: dubbingDialectId[0],
            digitalRightsType: null,
            digitalRightsRegions: [],
            digitalRightsStartDate: null,
            digitalRightsEndDate: null,
            schedulingDateTime: null,
            overlayPosterImage: overlayPosterImage[0],
            dubbingScript: '',
            subtitlingScript: '',
            publishingPlatforms: [],
            products: [],
            subscriptionPlans:[],
            varianceTrailers:[{
                englishTitle: '',
                arabicTitle: '',
                videoTrailerId: '',
                trailerposterImage: ''
            }]
        };
        let uploadStatusTemplate = {
            overlayPosterImage: '',
            dubbingScript: '',
            subtitlingScript: ''
        };
        let TrailerStatusTemplate = [{
            trailerposterImage: '',
        }]
        this.expandedVariances.push(expanded);
        this.defaultMultipleCheckboxContainer.push(false);
        this.uploadStatus.push(uploadStatusTemplate);
        this.data.push(dataTemplate);
        this.TrailerPosterUploadStatus.push(TrailerStatusTemplate);
    }

    /**
     * addTrailer function
     */
    @action
    addTrailer(VarianceIndex) {

        let TrailerTemplate = {
                englishTitle: '',
                arabicTitle: '',
                videoTrailerId: '',
                trailerposterImage: ''
        };

        let TrailerStatusTemplate = {
            trailerposterImage: '',
        }

        this.data[VarianceIndex].varianceTrailers.push(TrailerTemplate)
        this.TrailerPosterUploadStatus[VarianceIndex].push(TrailerStatusTemplate);
    }

    /**
     * Toggle variance
     * @param {Number} index - index of variance
     */
    @action
    toggleVariance(index) {
        this.expandedVariances[index] = !this.expandedVariances[index]
    }

    /**
     * Remove one element of data array.
     * @param {Number} index - element's index.
     */
    @action
    removeItem(index) {
        this.data.splice(index, 1);
        this.expandedVariances.splice(index, 1);
    }

    /**
     * Remove one element of data from Trailers  array.
     * @param {Number} index - element's index.
     */
    @action
    removeTrailerItem(index,varianceIndex) {
        this.data[varianceIndex].varianceTrailers.splice(index, 1);
        this.TrailerPosterUploadStatus[varianceIndex].splice(index, 1);
        // this.expandedVariances.splice(index, 1);
    }

    /**
     * Update language properties of data model.
     * @param {Number} index - element's index.
     * @param {String} languageType - origin type id.
     * @param {String} languageCode - language code.
     * @param {Number} dialectId - dialect id.
     */
    @action
    updateLanguage(index, languageType, dubbingLanguage, subtitlingLanguage, dialectId) {
        const variance = this.data[index];

        variance.languageType = languageType;
        variance.dubbingLanguage = dubbingLanguage;
        variance.subtitlingLanguage = subtitlingLanguage;
        variance.dubbingDialectId = dialectId;
    }

    /**
     * Set repeated data
     * @param {Array} data
     * @param {Array}uploadStatuses
     * @param {Array} expandedVariances
     * @param {Boolean} expandedVariances
     */
    @action
    setRepeaterData(data, uploadStatuses, expandedVariances,TrailerUploadStatus) {
        this.uploadStatus = uploadStatuses;
        this.TrailerPosterUploadStatus = TrailerUploadStatus;
        this.expandedVariances = expandedVariances;
        this.data = data;
        this.data.forEach(() => this.defaultMultipleCheckboxContainer.push(false));
        this.markAllPlatformsSelected();
    }

    /**
     * Set new value to data model.
     * @param {Number} index - element's index.
     * @param {String} name - name of changing property.
     * @param {String} value - new property value.
     */
    @action
    setData(index, name, value,TrailerNum,TrailerKey) {
        switch (name) {
            case 'digitalRightsStartDate':
                this.setRightsStartDate(index, value);
                break;
            case 'digitalRightsEndDate':
                this.setRightEndDate(index, value);
                break;
            case 'varianceTrailers':
                this.data[index].varianceTrailers[TrailerNum][TrailerKey] = value;
                break;
            default:              
                this.data[index][name] = value;                
        }
    }

    /**
     * Set rights start data
     * @param {Number} index - element's index.
     * @param {Moment} startDate - start date.
     */
    @action
    setRightsStartDate(index, startDate) {
        this.data[index].digitalRightsStartDate = startDate;
        if (!startDate || this.data[index].schedulingDateTime < startDate) {
            this.data[index].schedulingDateTime = null;
        }
    }

    /**
     * Set rights end data
     * @param {Number} index - element's index.
     * @param {Moment} endDate - start date.
     */
    @action
    setRightEndDate(index, endDate) {
        this.data[index].digitalRightsEndDate = endDate;
        if (!endDate || this.data[index].schedulingDateTime > endDate) {
            this.data[index].schedulingDateTime = null;
        }
    }

    /**
     * Set publishing platforms value.
     * @param {Object} publishingPlatforms - list of publishing platforms.
     */
    @action
    setPublishingPlatforms(publishingPlatforms) {
        this.publishingPlatformsList  = publishingPlatforms.data;
    }

    /**
     * Set origin types value.
     * @param {Object} originTypes - list of dubbing languages.
     */
    @action
    setOriginTypes(originTypes) {
        this.originTypes = originTypes.data;
    }

    /**
     * Set dubbing value.
     * @param {Object} dubbing - list of dubbing languages.
     */
    @action
    setDubbing(dubbing) {
        this.dubbing = dubbing.data;
    }

    /**
     * Set subtitling value.
     * @param {Object} subtitling - list of subtitling languages.
     */
    @action
    setSubtitling(subtitling) {
        this.subtitling = subtitling.data;
    }

    /**
     * Set dialects value.
     * @param {Object} dialects - list of dialects languages.
     */
    @action
    setDialects(dialects) {
        this.dialects = dialects.data;
    }

    /**
     * Set digital rights types
     * @param {Object} digitalRightsTypes
     */
    @action
    setDigitalRightsTypes(digitalRightsTypes) {
        this.digitalRightsTypes = digitalRightsTypes.data;
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
     * set products value
     * @param products
     */
    @action
    setProducts(products) {
        this.products = products.data;
    }

    @action
    setPlans(subscriptionPlans) {
        this.subscriptionPlans = subscriptionPlans;
    }

    /**
     * Checks whether max amount of content variances was reached
     */
    @computed
    get hasMaxAmountReached(){
        return this.data.length === constants.CONTENT.CONTENT_VARIANCES.MAX_AMOUNT;
    }

    /**
     * Checks whether min amount of content variances was exceeded
     */
    @computed
    get hasMinAmountExceeded(){
        return this.data.length > constants.CONTENT.CONTENT_VARIANCES.MIN_AMOUNT;
    }

    // /**
    //  * Checks whether max amount of  variance Trailer was reached
    //  */
    // @computed
    // get hasMaxTrailerReached(){
    //     return this.data[0].varianceTrailers.length === constants.CONTENT.VARIANCE_TRAILERS.MAX_AMOUNT;
    // }

    // /**
    //  * Checks whether min amount of variance Trailer was exceeded
    //  */
    // @computed
    // get hasMinTrailerExceeded(){
    //     return this.data[0].varianceTrailers.length > constants.CONTENT.VARIANCE_TRAILERS.MIN_AMOUNT;
    // }

    /**
     * Checks whether max amount of  variance Trailer was reached
     */
   
     hasMaxTrailerReached(index){
        return this.data[index].varianceTrailers.length === constants.CONTENT.VARIANCE_TRAILERS.MAX_AMOUNT;
    }

    /**
     * Checks whether min amount of variance Trailer was exceeded
     */
   
   hasMinTrailerExceeded(index){
        return this.data[index].varianceTrailers.length > constants.CONTENT.VARIANCE_TRAILERS.MIN_AMOUNT;
    }

    /**
     * Fetch all maps
     */
    fetchAllMaps(){
        var promises = [
            this.fetchOriginTypes(),
            this.fetchSubtitling(),
            this.fetchDubbing(),
            this.fetchDialects(constants.LANGUAGES.DATA.ARABIC.CODE),
            this.fetchDigitalRightsTypes(),
            this.fetchDigitalRightsRegions(),
            this.fetchPublishingPlatforms(),
            this.fetchProducts(),
            this.fetchPlans()
        ];

       return Promise.all(promises);
    }

    /**
     * Fetch origin types.
     * @returns {Promise} a call api promise
     */
    fetchOriginTypes() {
        return this.Transport.callApi(endpoints.GET_LANGUAGES_ORIGIN_TYPES)
            .then(this.setOriginTypes.bind(this));
    }

    /**
     * Fetch publishing platforms.
     * @returns {Promise} a call api promise
     */
    fetchPublishingPlatforms() {
        return this.Transport.callApi(endpoints.GET_PUBLISHING_PLATFORMS)
            .then(this.setPublishingPlatforms.bind(this));
    }

    /**
     * Fetch subtitles.
     * @returns {Promise} a call api promise
     */
    fetchSubtitling() {
        return this.Transport.callApi(endpoints.GET_SUBTITLING)
            .then(this.setSubtitling.bind(this));
    }

    /**
     * Fetch dubbing.
     * @returns {Promise} a call api promise
     */
    fetchDubbing() {
        return this.Transport.callApi(endpoints.GET_DUBBING)
            .then(this.setDubbing.bind(this));
    }

    /**
     * Fetch possible subgenres
     * @param {String} languageCode - code of language.
     * @returns {Promise} a call api promise
     */
    fetchDialects(languageCode) {
        return this.Transport.callApi(endpoints.GET_DIALECTS, null, [languageCode]).
            then(this.setDialects.bind(this));
    }

    /**
     * Fetch rights type.
     * @returns {Promise} a call api promise
     */
    fetchDigitalRightsTypes() {
        return this.Transport.callApi(endpoints.GET_DIGITAL_RIGHTS_TYPES)
            .then(this.setDigitalRightsTypes.bind(this));
    }

    /**
     * Fetch rights regions.
     * @returns {Promise} a call api promise
     */
    fetchDigitalRightsRegions() {
        return this.Transport.callApi(endpoints.GET_DIGITAL_RIGHTS_REGIONS)
            .then(this.setDigitalRightsRegions.bind(this));
    }

    /**
     * Fetch products
     * @returns {Promise} a call api promise
     */
    fetchProducts() {
        return this.Transport.callApi(endpoints.GET_PRODUCTS)
            .then(this.setProducts.bind(this));
    }

    fetchPlans() {
        return this.Transport.callApi(endpoints.PLANS)
            .then(this.setPlans.bind(this));
    } 
    
    /**
     * Retrieve data object for the store
     * @returns {Object} normalized data
     */
    // getData() {
    //     return this.data;
    // }
    @action
    getData() {
        if (this.data[0].digitalRightsRegions.length == "241"){
            this.data[0].countryCheck = true;
            return this.data;
        }
        else {
            // this.data[0].countryCheck = false;
            return this.data;
        }
    }


    /**
     * Empties all props in data object
     */
    @action
    clearData() {
        this.data = [
            {
                videoContentId: '',
                introDuration: '',
                // IntroDuration:'',
                introStart:'',
                // IntroStart:'',
                languageType: null,
                dubbingLanguage: null,
                subtitlingLanguage: null,
                dubbingDialectId: null,
                digitalRightsType: null,
                digitalRightsRegions: [],
                digitalRightsStartDate: null,
                digitalRightsEndDate: null,
                schedulingDateTime: null,
                overlayPosterImage: '',
                dubbingScript: '',
                subtitlingScript: '',
                publishingPlatforms: [],
                products: [],
                subscriptionPlans :[],
                varianceTrailers:[]
            }
        ];
        this.expandedVariances = [false];
        this.defaultMultipleCheckboxContainer = [
            false
        ];
        this.expandedNodes = [];
        this.uploadStatus = [
            {
                overlayPosterImage: '',
                dubbingScript: '',
                subtitlingScript: ''
            }
        ];
    }
}

export default ContentVariancesStore;
