import { observable, action } from 'mobx';
import { getSetterName } from 'components/core/Utils'
import PrimaryInfoStore from 'stores/content/PrimaryInfoStore'

/**
 * The Primary Info store.
 */
class PrimaryInfoEpisodeMTCStore extends PrimaryInfoStore {

    /**
     * Contract primary info episode multi tier content store
     * @param {Object} args - arguments
     */
    constructor(args) {
        super(args);
        this.setDefaultNumbers();
    }

    /** Content numbers list */
    @observable
    Numbers = null;

    validationData = {};

    /**
     * Set episode numbers
     * @param {Array} Numbers - list of season numbers
     */
    @action
    setNumbers(Numbers) {
        this.Numbers = Numbers;
    }

    /**
     * Set episode numbers
     * @param {Array} savedEpisodes - list of saved episodes
     */
    @action
    setSavedEpisodes(savedEpisodes) {
        this.savedEpisodes = savedEpisodes;
    }

    /**
     * Set episode numbers and names
     * @param {Array} savedEpisodes - list of saved episodes
     */
    @action
    setSavedEpisodesAndTitles(savedEpisodesAndTitles) {
        this.savedEpisodesAndTitles = savedEpisodesAndTitles;
    }

    /**
     * Set notes
     * @param {String} notes - notes
     */
    @action
    setNotes(notes) {
        this.data.notes = notes;
    }

    /**
     * Set default episode numbers
     */
    @action
    setDefaultNumbers() {
        this.Numbers = '';
    }

    /**
     * Updates value for compare
     * @param {Number} number - season number
     * @param {String} title - transliterated title
     */
    setValueForCompare(number, title) {
        this.validationData.number = number;
        this.validationData.transliteratedTitle = title;
    }

    /**
     * Set episode number
     * @param {Number} number - season number
     */
    @action
    setNumber(number) {
        this.data.number = number;
        this.setValueForCompare(number, this.data.transliteratedTitle);
    }

    /**
     * Updates value for compare
     * @param {String} transliteratedTitle - transliterated title
     */
    @action
    setTransliteratedTitle(transliteratedTitle) {
        this.data.transliteratedTitle = transliteratedTitle;
        this.setValueForCompare(this.data.number, transliteratedTitle);
    }

    /**
     * Set episode synopsis english
     * @param {String} synopsisEnglish - season number
     */
    @action
    setSynopsisEnglish(synopsisEnglish) {
        this.data.synopsisEnglish = synopsisEnglish;
    }

    @action
    setIntroStart(introStart) {
        // console.log( new Date('1970-01-01T' + introStart + 'Z').getTime() / 1000)
        this.data.introStart = introStart;
        // this.introStart = introStart;
       
        
    }

    /**
     * Set episode video conren id
     * @param {String} videoContentId - season number
     */
    @action
    setVideoContentId(videoContentId) {
        this.data.videoContentId = videoContentId;
    }

    /**
     * Set episode synopsis arabic
     * @param {String} synopsisArabic - season number
     */
    @action
    setSynopsisArabic(synopsisArabic) {
        this.data.synopsisArabic = synopsisArabic;
    }

    @action
    setOutroStart(outroStart) {
        this.data.outroStart = outroStart;
    }

    /**
     * Clear data
     */
    @action
    clearData() {
        super.clearData();
        this.data.number = '';
        this.data.videoContentId = '';
        this.data.synopsisEnglish = '';
        this.data.introStart = '';
        // this.data.introStartTime= '';
        this.data.outroStart= '';
        this.data.synopsisArabic = '';
        this.data.contentId = null;
        this.setDefaultNumbers();
    }

    /**
     * Create data
     * @returns {Object} data
     */
    createData() {
        const data = super.createData();
        data['Number'] = '';
        data['videoContentId'] = '';
        data['synopsisEnglish'] = '';
        data['introStart'] = '';
        // data['introStartTime']='';
        data['outroStart'] ='';
        data['synopsisArabic'] = '';
        return data;
    }
}

export default PrimaryInfoEpisodeMTCStore;
