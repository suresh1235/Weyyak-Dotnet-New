import {observable, action, toJS, isObservableArray} from 'mobx';

import Store from 'stores/Store';
import endpoints from 'transport/endpoints';
import { getSetterName } from 'components/core/Utils';

/**
 * The About The Content store
 */
class AboutTheContentStore extends Store {
    /** Content original language */
    @observable
    originalLanguages = null;

    /** Content age group */
    @observable
    ageGroups = null;

    /** Content production countries */
    @observable
    productionCountriesList = null;
    @observable
    supplierS = null;


    /** Custom data observable object */
    @observable
    data = {
        originalLanguage: '',
        supplier: 'Weyyak',
        acquisitionDepartment: '',
        englishSynopsis: '',
        productionCountries: '',
        productionYear: '',
        productionHouse: '',
        ageGroup: null,
        arabicSynopsis: '',
        arabicSynopsis: '',
        introStart :'00:00:05',
        outroStart :'',
        introDuration : '',
        outroDuration : '',
    };

    /**
     * Set about the content data
     * @param {Object} about
     */
    @action
    setData(about) {
        if (about) {
            this.data = about;
        }
    }

    /**
     * Set set original languages
     * @param {Array} originalLanguages - list of original languages
     */
    @action
    setOriginalLanguages(originalLanguages) {
        this.originalLanguages = originalLanguages;
    }

    /**
     * Set set age groups
     * @param {Array} ageGroups - list of age groups
     */
    @action
    setAgeGroups(ageGroups) {
        this.ageGroups = ageGroups;
    }

    @action
    setSupplierS(supplierInfos) {
        this.supplierS = supplierInfos;
    }

    /**
     * Set set original language
     * @param {String} originalLanguage - original language code
     */
    @action
    setOriginalLanguage(originalLanguage) {
        this.data.originalLanguage = originalLanguage;
    }

    /**
     * Set set production countries
     * @param {Object} productionCountriesList - production country object
     */
    @action
    setProductionCountries(productionCountriesList) {
        this.data.productionCountries = productionCountriesList.length ?
            productionCountriesList.map((country) => country.value) :
            null;
    }

    /**
     * Set production countries
     * @param {Array} productionCountriesList - production countries
     */
    @action
    setProductionCountriesList(productionCountriesList) {
        this.productionCountriesList = productionCountriesList;
    }

  
    /**
     * Set acquisition department
     * @param {String} acquisitionDepartment - value
     */
    @action
    setAcquisitionDepartment(acquisitionDepartment) {
        this.data.acquisitionDepartment = acquisitionDepartment;
    }
    /**
     * Set synopsis english
     * @param {String} englishSynopsis - value
     */
    @action
    setEnglishSynopsis(englishSynopsis) {
        this.data.englishSynopsis = englishSynopsis;
    }

    /**
     * Set synopsis arabic
     * @param {String} arabicSynopsis - value
     */
    @action
    setArabicSynopsis(arabicSynopsis) {
        this.data.arabicSynopsis = arabicSynopsis;
    }

    /**
     * Set production year
     * @param {String} productionYear - value
     */
    @action
    setProductionYear(productionYear) {
        this.data.productionYear = productionYear;
    }
    /**
     * Set production house
     * @param {String} productionHouse - value
     */
    @action
    setProductionHouse(productionHouse) {
        this.data.productionHouse = productionHouse;
    }
    /**
     * Set age group
     * @param {String} ageGroup - value
     */
    @action
    setAgeGroup(ageGroup) {
        this.data.ageGroup = (ageGroup === '') ? null : parseInt(ageGroup);
    }

      /**
     * Set supplier
     * @param {String} supplier - value
     */
    @action
    setSupplier(supplier) {
    //    this.data.supplier =  supplier;
       this.data.supplier = (supplier === '') ? 'Weyyak' : supplier;
    }

    @action
    setIntroStart(introStart) {
        this.data.introStart = introStart;
    }

    @action
    setOutroStart(outroStart) {
        this.data.outroStart = outroStart;
    }

    @action
    setIntroDuration(introDuration) {
        this.data.introDuration = introDuration;
    }

    @action
    setOutroDuration(outroDuration) {
        this.data.outroDuration = outroDuration;
    }


    /**
     * Fetch original languages
     * @returns {Promise} a call api promise
     */
    fetchOriginalLanguages() {
        return this.Transport.callApi(endpoints.GET_LANGUAGES_ORIGINAL).then(res => {
            this.setOriginalLanguages.call(this, res.data);
        });
    }

    fetchSupplierInfos(){
          let  supplier = [
            {id:'Weyyak',supplierName:"Weyyak"},
            {id:'Others',supplierName:"Others"}
                
          ];

         return this.setSupplierS.call(this, supplier);
        }

    /**
     * Fetch production countries
     * @returns {Promise} a call api promise
     */
    fetchProductionCountries() {
        return this.Transport.callApi(endpoints.GET_COUNTRY_NAMES).then(res => {
            this.setProductionCountriesList.call(this, res.data);
        });
    }

    /**
     * Fetch age groups
     * @returns {Promise} a call api promise
     */
    fetchAgeGroups() {
        return this.Transport.callApi(endpoints.GET_AGE_GROUPS).then(res => {
            this.setAgeGroups.call(this, res.data);
        });
    }

    /**
     * Retrieve normalized data object for submitting the store data
     * @returns {Object} normalized data
     */
    getData() {
        return this.data;
    }

    /**
     * Retrieve normalized object for the submitting store data
     * @returns {Object} normalized data
     */
    getSubmitData() {
        const submitData = toJS(this.data);

        submitData.productionCountries = submitData.productionCountry;
        delete(submitData.productionCountry);

        return submitData;
    }

    /**
     * Empties all props in data object
     */
    clearData() {
        Object.keys(this.data).forEach((prop)=>{
            this[getSetterName(prop)]('');
        });
    }

    /**
     * Gets store property
     *
     * @param key
     * @returns {*}
     */
    getStoreProperty(key) {
        const property = this.hasOwnProperty(key) ? this[key] : this.data[key];

        return isObservableArray(property) ? property.peek() : property;
    }
}

export default AboutTheContentStore;
