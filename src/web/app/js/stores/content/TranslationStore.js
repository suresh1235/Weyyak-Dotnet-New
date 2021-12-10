import {observable, action } from 'mobx';
import constants from 'constants/constants';
import Store from 'stores/Store';
import endpoints from 'transport/endpoints';
import { getSetterName } from 'components/core/Utils';

/**
 * The translation store.
 */
class TranslationStore extends Store {
    /** Custom data observable object */
    @observable
    data = [
        {
            languageType: null,
            dubbingLanguage: null,
            subtitlingLanguage: null,
            dubbingDialectId: null,
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

    /**
     * Update language
     * @param {String} languageType - language type
     * @param {String} dubbingLanguage - dubbing language
     * @param {String} subtitlingLanguage - subtitling language
     * @param {String} dubbingDialectId - dubbing dialect id
     */
    @action
    updateLanguage(languageType, dubbingLanguage, subtitlingLanguage, dubbingDialectId) {
        this.setData({
            languageType,
            dubbingLanguage,
            subtitlingLanguage,
            dubbingDialectId
        });
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
     * Empties all props in data object
     */
    @action
    clearData() {
        Object.keys(this.data).forEach(prop => {
            this.data[prop] = null;
        });
    }

    /**
     * Fetch all maps
     */
    fetchAllMaps(){
        const promises = [
            this.fetchOriginTypes(),
            this.fetchSubtitling(),
            this.fetchDubbing(),
            this.fetchDialects(constants.LANGUAGES.DATA.ARABIC.CODE),
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
     * Get data
     * @returns {Object} data
     */
    getData() {
        return this.data;
    }

}

export default TranslationStore;
