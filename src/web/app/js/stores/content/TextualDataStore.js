import Store from 'stores/Store';
import PrimaryInfoOTCStore from 'stores/content/PrimaryInfoOTCStore';
import SeoDetails from 'stores/content/SeoDetailsStore';
import ContentGenresStore from 'stores/content/ContentGenresStore';
import ContentVariancesStore from 'stores/content/ContentVariancesStore';
import AboutTheContentStore from 'stores/content/AboutTheContentStore';
import CastStore from 'stores/content/CastStore';
import MusicStore from 'stores/content/MusicStore';
import TagStore from 'stores/content/TagStore';
import { action } from 'mobx';
import moment from 'moment';

/**
 * The Textual Data store.
 */
class TextualDataStore extends Store {

    constructor(...args) {
        super(...args);
        this.primaryInfo = new PrimaryInfoOTCStore(...args);
        this.seoDetails = new SeoDetails(...args);
        this.contentGenres = new ContentGenresStore(...args);
        this.contentVariances = new ContentVariancesStore(...args);
        this.aboutTheContent = new AboutTheContentStore(...args);
        this.cast = new CastStore(...args);
        this.music = new MusicStore(...args);
        this.tags = new TagStore(...args);
    }

    /**
     * Set textual data object
     * @param {Object} textualData
     */
    @action
    setData(textualData, variancesConfig) {
        if (textualData) {
            textualData.primaryInfo && this.primaryInfo.setData(textualData.primaryInfo);
            textualData.seoDetails && this.seoDetails.setData(textualData.seoDetails);

            textualData.contentGenres && this.contentGenres.setRepeaterData(
                textualData.contentGenres.map(genre => ({
                    genreId: genre.genreId,
                    subgenresId: genre.subgenresId
                })));

            textualData.aboutTheContent && this.aboutTheContent.setData(textualData.aboutTheContent);
            textualData.cast && this.cast.setData(textualData.cast);
            textualData.music && this.music.setData(textualData.music);
            textualData.tagInfo.tags && this.tags.setData(textualData.tagInfo.tags);
            textualData.contentVariances && this.setVariances(textualData.contentVariances, variancesConfig);
        }
    }

    /**
     * Set variances
     * @param {Object} contentVariances - content variances data
     * @param {Object} variancesConfig - variances configuration
     */
    @action
    setVariances(contentVariances, variancesConfig) {
        const variancesData = [], variancesUploadStatues = [], expandedVariances = [], TrailerUploadStatus = [[]];
        const { selectedVarianceId, addNewVariance } = variancesConfig;

        contentVariances.forEach((variance, index) => {
            variancesData.push(Object.assign({}, variance, {
                digitalRightsStartDate: variance.digitalRightsStartDate && moment(variance.digitalRightsStartDate),
                digitalRightsEndDate: variance.digitalRightsEndDate && moment(variance.digitalRightsEndDate),
                schedulingDateTime: variance.schedulingDateTime && moment(variance.schedulingDateTime),
            }));
            variancesUploadStatues.push({
                overlayPosterImage: variance.overlayPosterImage ? 'success' : '',
                dubbingScript: variance.dubbingScript ? 'success' : '',
                subtitlingScript: variance.subtitlingScript ? 'success' : ''
            });
            expandedVariances.push(selectedVarianceId ? variance.id === selectedVarianceId : !addNewVariance && index === 0);

            variance.varianceTrailers.map((TrailerInfo)=>{
                console.log(TrailerUploadStatus[0])
                // TrailerUploadStatus[index].push({
                TrailerUploadStatus[0].push({
                    trailerposterImage: TrailerInfo.trailerposterImage ? 'success' : ''
                });
            })

        });
        this.contentVariances.setRepeaterData(variancesData, variancesUploadStatues, expandedVariances,TrailerUploadStatus);
        addNewVariance && !this.contentVariances.hasMaxAmountReached && this.contentVariances.addItem(true);
    }

    /**
     * Fetch all maps
     * @returns {Promise}
     */
    fetchAllMaps(){
        var promises = [
            this.primaryInfo.fetchContentTypes(),

            this.contentVariances.fetchAllMaps(),

            // this.cast.fetchActors(),
            // this.cast.fetchWriters(),
            // this.cast.fetchDirectors(),

            // this.aboutTheContent.fetchOriginalLanguages(),
            // this.aboutTheContent.fetchProductionCountries(),
            // this.aboutTheContent.fetchAgeGroups(),

            // this.contentGenres.fetchGenres(),

            // this.music.fetchSingers(),
            // this.music.fetchMusicComposers(),
            // this.music.fetchSongWriters(),

            // this.tags.fetchTags()
        ];

        return Promise.all(promises);
    }

    /**
     * Retrieve normalized data object for the store
     * @returns {Object} normalized data
     */
    getData() {
    //  let Country = this.contentVariances.getData();
      return {
          primaryInfo: this.primaryInfo.getData(),
          seoDetails: this.seoDetails.getData(),
          contentGenres: this.contentGenres.getData(),
          contentVariances: this.contentVariances.getData(),
          aboutTheContent: this.aboutTheContent.getData(),
          cast: this.cast.getData(),
          music: this.music.getData(),
        //   countryCheck: Country[0].digitalRightsRegions.length==241?true:false,
          tagInfo: {
              tags: this.tags.getData()
          },
      }
    }

    /**
     * Empties all args in data object
     */
    clearData() {
        this.primaryInfo.clearData();
        this.contentGenres.clearData();
        this.contentVariances.clearData();
        this.aboutTheContent.clearData();
        this.cast.clearData();
        this.music.clearData();
        this.tags.clearData();
        this.seoDetails.clearData();
    }
}

export default TextualDataStore;
