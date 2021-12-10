import { observable, action, toJS } from 'mobx';
import Store from 'stores/Store';
import { getSetterName } from 'components/core/Utils'

/**
 * The details base class store
 * Should be implemented in inheritors
 */
class seoDetails extends Store {

    /** Custom data observable object */
    @observable
    data = this.createData();

    syncData = {
        arabicTitle: '',
        englishTitle: ''
    };

    static postfixes = {
        arabic: 'على وياك',
        english: 'on Weyyak'
    }

    /**
     * Create data
     * @returns {{originalTitle: string, alternativeTitle: string, arabicTitle: string, transliteratedTitle: string, notes: string}}
     */
    createData() {
        return {
            arabicMetaTitle: '',
            englishMetaTitle: '',
            arabicMetaDescription: '',
            englishMetaDescription: ''
        }
    }

    /**
     * Base fetch data method for implementation in inheritors
     */
    @action
    fetchData() {
    }

    /**
     * Set meta title arabic
     * @param {Array} arabicMetaTitle - meta title arabic
     */
    @action
    setArabicMetaTitle(arabicMetaTitle) {
        this.data.arabicMetaTitle = arabicMetaTitle;
    }

    /**
     * Set meta title english
     * @param {Array} englishMetaTitle - meta title english
     */
    @action
    setEnglishMetaTitle(englishMetaTitle) {
        this.data.englishMetaTitle = englishMetaTitle;
    }

    /**
     * Set meta description arabic
     * @param {Array} arabicMetaDescription - meta description arabic
     */
    @action
    setArabicMetaDescription(arabicMetaDescription) {
        this.data.arabicMetaDescription = arabicMetaDescription;
    }

    /**
     * Set meta description english
     * @param {Array} englishMetaDescription - meta description english
     */
    @action
    setEnglishMetaDescription(englishMetaDescription) {
        this.data.englishMetaDescription = englishMetaDescription;
    }

    /**
     * Set data
     * @param {Object} data - data
     */
    @action
    setData(data, syncData = {}) {
        this.data = data;
        this.syncData = syncData;
    }

    @action
    syncSeoDetails(arabicTitle, englishTitle) {
        if (this.syncData.arabicTitle != arabicTitle) {
            this.syncData.arabicTitle = arabicTitle
            this.setArabicMetaTitle(`${seoDetails.postfixes.arabic} ${arabicTitle}`);
            this.setArabicMetaDescription(`${seoDetails.postfixes.arabic} ${arabicTitle}`);
        }
        if (this.syncData.englishTitle != englishTitle) {
            this.syncData.englishTitle = englishTitle
            this.setEnglishMetaTitle(`${englishTitle} ${seoDetails.postfixes.english}`)
            this.setEnglishMetaDescription(`${englishTitle} ${seoDetails.postfixes.english}`)
        }
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
        this.syncData = { arabicTitle: '', englishTitle: '' };
        Object.keys(this.data).forEach((prop)=>{
            this.data[prop] && this[getSetterName(prop)]('');
        });
    }
}

export default seoDetails
