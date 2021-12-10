import {observable, action, computed, toJS} from 'mobx';

import endpoints from 'transport/endpoints';
import {getFirstMissedNumber} from 'components/core/Utils';
import {isEqual} from 'lodash';

import ContentStoreBase from 'stores/content/ContentStoreBase';
import AboutTheContentStore from 'stores/content/AboutTheContentStore';
import PrimaryInfoSeasonMTCStore
  from 'stores/content/PrimaryInfoSeasonMTCStore';
import constants from 'constants/constants';
import ContentGenresStore from 'stores/content/ContentGenresStore';
import TrailersStore from 'stores/content/TrailersStore';
import TranslationStore from 'stores/content/TranslationStore';
import RightsStore from 'stores/content/RightsStore';
import ProductNameStore from 'stores/content/ProductNameStore';
import PlanNameStore from 'stores/content/PlanNameStore';
import moment from 'moment';
import NonTextualDataStore from 'stores/content/NonTextualDataStore';
import CastStore from 'stores/content/CastStore';
import MusicStore from 'stores/content/MusicStore';
import TagStore from 'stores/content/TagStore';
import ContentGridMultiTierStore
  from 'stores/content/ContentGridMultiTierStore';
import SeoDetails from 'stores/content/SeoDetailsStore';

/**
 * The Multi tier content season store
 */
class MultiTierContentSeasonStore extends ContentStoreBase {
  @observable contentId = null;

  @observable titles = null;

  @observable contentSeasons = null;

  @observable titlePrimaryInfo = null;

  @observable data = null;

  @observable status = null;

  @observable actualSeasonId = null;

  @observable actualSeason = null;

  @observable seasonId = null;
  @observable rightsAdd=false;
  season = null;
  @observable subscriptionPlans = [];

  

  @computed get createdSeasonsTranslations () {
    return this.contentSeasons
      ? this.contentSeasons
          .filter (
            season =>
              season.primaryInfo.transliteratedTitle ===
                this.primaryInfo.data.transliteratedTitle &&
              season.primaryInfo.seasonNumber ===
                this.primaryInfo.data.seasonNumber
          )
          .map (season => season.translation)
      : [];
  }

  /**
     * Updates content seasons after season delete
     * @param {String} id - season id
     */
  @action updateContentSeasons (id) {
    let updatedSeasons = this.contentSeasons.toJS ();
    this.contentSeasons = null;
    updatedSeasons.forEach ((season, key) => {
      if (season.id == id) {
        delete updatedSeasons[key];
      }
    });
    this.contentSeasons = updatedSeasons;
  }

  @action updateSeasonId (id) {
    this.actualSeasonId = id;
  }

  /**
     * Checks is data was changed
     * @param {Array} props - a store's arguments
     */
  @action isDataChanged () {
    let actualSeason = toJS (this.actualSeason);
    let formData = toJS (this.getDataFromStores ());
    let dirty = false;

    actualSeason &&
      Object.keys (formData).forEach (key => {
        let currentData = toJS (formData[key]);
        let templateData = toJS (actualSeason[key]);

        // TODO NOT REMOVE
        // Chenge format of digital rights start date to compare
        if (key == 'rights') {
          currentData = JSON.stringify (formData[key]);
          templateData = JSON.stringify (actualSeason[key]);
          currentData = currentData.replace ('00:00.000', '00:00');
          templateData = templateData.replace ('00:00.000', '00:00');
        }

        if (key == 'tagInfo') {
          currentData = toJS (currentData.tags);
          templateData = toJS (templateData.tags);
        }

        !isEqual (currentData, templateData) && (dirty = true);
      });

    return dirty;
  }

  /**
     * Construct a multi tier content season store
     * @param {Array} props - a store's arguments
     */
  constructor (props) {
    super (props);
    this.contentGridMultiTierStore = new ContentGridMultiTierStore (props);
    this.primaryInfo = new PrimaryInfoSeasonMTCStore ();
    this.contentGenres = new ContentGenresStore (props);
    this.varianceTrailers = new TrailersStore (props);
    this.aboutTheContent = new AboutTheContentStore (props);
    this.translation = new TranslationStore (props);
    this.nonTextualData = new NonTextualDataStore (props);
    this.cast = new CastStore (props);
    this.music = new MusicStore (props);
    this.tags = new TagStore (props);
    this.rights = new RightsStore (props);
    // this.plans = new PlanNameStore(props);
    this.products = new ProductNameStore (props);
    this.seoDetails = new SeoDetails (props);
  }

  /**
     * Set titles
     * @param {Array} titles - array of titles
     */
  @action setTitles (titles) {
    this.titles = titles;
  }

  /**
     * Set content id
     * @param contentId
     */
  @action setContentId (contentId) {
    this.contentId = contentId;
  }

  /**
     * Set current season data
     * @param {String} id - current season id
     */
  getSeasonData (id) {
    this.clearData ();
    this.setContentId (id);
  }

  /**
     * Set content season data
     * @param {Object} data - content object
     * @param {String} contentId - content title id
     */
  @action setData (data, contentId) {
    this.data = this.season ? this.season : data;
    const {
      primaryInfo,
      contentGenres,
      contentSeasons,
      seasonGenres,
    } = this.data;
    let actualSeason = null;
    if ((contentSeasons && contentSeasons.length) || this.season) {
      actualSeason = contentSeasons
        ? contentSeasons.sort ((left, right) =>
            moment.utc (left).diff (moment.utc (right))
          )[contentSeasons.length - 1]
        : this.data;
      const {cast, music, tagInfo, rights, products} = actualSeason;
      this.aboutTheContent.setData (
        Object.assign ({}, actualSeason.aboutTheContent, {
          englishSynopsis: !this.season
            ? ''
            : actualSeason.aboutTheContent.englishSynopsis,
          arabicSynopsis: !this.season
            ? ''
            : actualSeason.aboutTheContent.arabicSynopsis,
        })
      );
      this.cast.setData (cast);
      this.music.setData (music);
      this.tags.setData (tagInfo.tags);
      this.rights.setData (
        Object.assign ({}, rights, {
          digitalRightsStartDate: rights.digitalRightsStartDate &&
            moment (rights.digitalRightsStartDate),
          digitalRightsEndDate: rights.digitalRightsEndDate &&
            moment (rights.digitalRightsEndDate),
        })
      );
      this.products.setProductNames (products);
     // this.subscriptionPlans.setPlanNames(subscriptionPlans);
    }

    this.status = !this.season ? null : actualSeason.status;
    this.actualSeasonId = !this.season ? null : actualSeason.id;

    this.primaryInfo.setData (
      this.getPrimaryInfoData (primaryInfo, actualSeason, contentSeasons)
    );

    contentGenres &&
      contentGenres.forEach (genre => {
        delete genre.id;
      });

    !this.season
      ? this.contentGenres.setRepeaterData (contentGenres)
      : this.contentGenres.setRepeaterData (toJS (seasonGenres));

    !this.season
      ? this.nonTextualData.clearData ()
      : this.nonTextualData.setData (actualSeason.nonTextualData, {
          posterImage: actualSeason.nonTextualData.posterImage ? 'success' : '',
          overlayPosterImage: actualSeason.nonTextualData.overlayPosterImage
            ? 'success'
            : '',
          detailsBackground: actualSeason.nonTextualData.detailsBackground
            ? 'success'
            : '',
          mobileDetailsBackground: actualSeason.nonTextualData
            .mobileDetailsBackground
            ? 'success'
            : '',
        });

    !this.season && this.setContentId (contentId);
    this.contentSeasons = !this.season ? contentSeasons : this.contentSeasons;
    this.primaryInfo.setDefaultSeasonNumbers ();
    !this.season
      ? this.translation.clearData ()
      : this.translation.setData (actualSeason.translation);

    this.actualSeason = !this.season
      ? JSON.parse (JSON.stringify (this.getDataFromStores ()))
      : JSON.parse (JSON.stringify (actualSeason));

    this.titlePrimaryInfo = data.primaryInfo;

    this.seoDetails.data = this.data.seoDetails;

    // Update Trailer store data and Trailer Poster Upload Status from API Data.......

    let TrailerUploadStatus = []

    this.data.varianceTrailers.map((TrailerInfo)=>{
      TrailerUploadStatus.push({
          trailerposterImage: TrailerInfo.trailerposterImage ? 'success' : ''
      });
    })
  
    this.varianceTrailers.setRepeaterData(this.data.varianceTrailers,TrailerUploadStatus);

  }

  getPrimaryInfoData (primaryInfo, actualSeason, contentSeasons) {
    return {
      notes: !this.season ? primaryInfo.notes : actualSeason.primaryInfo.notes,
      originalTitle: !this.season
        ? primaryInfo.originalTitle
        : actualSeason.primaryInfo.originalTitle,
      alternativeTitle: !this.season
        ? primaryInfo.alternativeTitle
        : actualSeason.primaryInfo.alternativeTitle,
      arabicTitle: !this.season
        ? primaryInfo.arabicTitle
        : actualSeason.primaryInfo.arabicTitle,
      transliteratedTitle: !this.season
        ? primaryInfo.transliteratedTitle
        : actualSeason.primaryInfo.transliteratedTitle,
      seasonNumber: !this.season
        ? getFirstMissedNumber (
            contentSeasons.map (season => season.primaryInfo.seasonNumber)
          )
        : actualSeason.primaryInfo.seasonNumber,
    };
  }

  getDataFromStores () {
    let Country = this.rights.getData();
    if(!this.rightsAdd){
    return {
      Seasonid:null,
      contentId: this.contentId,
      primaryInfo: this.primaryInfo.getData (),
      seasonGenres: this.contentGenres.getData (),
      varianceTrailers: this.varianceTrailers.getData (),
      aboutTheContent: this.aboutTheContent.getData (),
      introStart: this.aboutTheContent.getData ().introStart,
      translation: this.translation.getData (),
      nonTextualData: this.nonTextualData.getData (),
      cast: this.cast.getData (),
      music: this.music.getData (),
      tagInfo: {tags: this.tags.getData ()},
      rights: this.rights.getData (),
      countryCheck: Country.digitalRightsRegions.length == 248? true:false,
      products: this.products.getProductNames (),
      seoDetails: this.seoDetails.getData (),
    };
  }else{
    return {
      Seasonid:this.actualSeasonId,
      contentId: this.contentId,
      primaryInfo: this.primaryInfo.getData (),
      seasonGenres: this.contentGenres.getData (),
      varianceTrailers: this.varianceTrailers.getData (),
      aboutTheContent: this.aboutTheContent.getData (),
      introStart: this.aboutTheContent.getData ().introStart,
      translation: this.translation.getData (),
      nonTextualData: this.nonTextualData.getData (),
      cast: this.cast.getData (),
      music: this.music.getData (),
      tagInfo: {tags: this.tags.getData ()},
      rights: this.rights.getData (),
      products: this.products.getProductNames (),
      seoDetails: this.seoDetails.getData (),
      
    };
    
  }

  }

  /**
     * Clear data
     */
  @action clearData () {
    super.clearData ();
    this.actualSeason = null;
    this.seasonId = null;
    this.contentSeasons = null;
    this.titlePrimaryInfo = null;
    this.season = null;
    this.setContentId ('');
    this.primaryInfo.clearData ();
    this.contentGenres.clearData ();
    this.varianceTrailers.clearData ();
    this.translation.clearData ();
    this.rights.clearData ();
    this.products.clear ();
    this.nonTextualData.clearData ();
    this.aboutTheContent.clearData ();
    this.cast.clearData ();
    this.music.clearData ();
    this.tags.clearData ();
    this.seoDetails.clearData ();
  }

 @action addVariance(){
  // alert("Please add New rights")
   console.log(this.titles)
   const title = this.titles;
   let contentId= this.contentId;
   let nonTextualData = this.nonTextualData;

   this.rightsAdd=true;
  // this.titles = title
  //this.fetchTitles();
  this.rights.clearData ();
  this.subscriptionPlans = [];
  
 }

 
 @action resetVarianceStatus(){
  this.rightsAdd=false;
 }

  /**
     * Fetch multi tier content titles
     * @returns {Promise}
     */
  fetchTitles () {
    return this.Transport
      .callApi (endpoints.GET_MULTI_TIER_CONTENT_TITLES)
      .then (res => {
        res && res.data && this.setTitles (res.data);
      });
  }

  /**
     * Fetch multi tier content titles by id
     * @param {String} contentId - content title id
     * @returns {Promise}
     */
  // fetchTitle (contentId, seasonId) {
  //   return this.Transport
  //     .callApi (endpoints.GET_MULTI_TIER_CONTENT_TITLE, null, [contentId])
  //     .then (res => {
  //       res && res.data && this.setData (res.data, contentId);
  //       seasonId && this.getSeasonData (seasonId);
  //     });
  // }
  fetchTitle (contentId, seasonId, updateOnlyPrimaryInfo) {
    return this.Transport
      .callApi (endpoints.GET_MULTI_TIER_CONTENT_TITLE, null, [contentId])
      .then (res => {
        if (updateOnlyPrimaryInfo) {
          this.primaryInfo.setData (res.data.primaryInfo);
        } else {
          res && res.data && this.setData (res.data, contentId);
          seasonId && this.getSeasonData (seasonId);
        }
      });
  }

  /**
     * Fetch multi tier content titles by id
     * @param {String} contentId - content title id
     * @returns {Promise}
     */
  @action fetchSeason (seasonId) {
    this.seasonId = seasonId.id;
    return this.Transport
      .callApi (endpoints.GET_SEASON_DATA, null, [seasonId])
      .then (res => {
        this.season = res.data;
        this.setContentId (res.data.contentId);
        this.fetchTitle (res.data.contentId);
      });
  }

  /**
     * Create multi tier content season published
     * @returns {Promise}
     */
  createContentPublished () {
    return this.Transport.callApi (
      endpoints.CREATE_MULTI_TIER_SEASON_PUBLISHED,
      this.getDataFromStores (),
      // this.subscriptionPlans = []
    );
  }

  /**
     * Create multi tier content draft
     * @returns {Promise}
     */
  createContentDraft () {
    return this.Transport
      .callApi (
        endpoints.CREATE_MULTI_TIER_SEASON_DRAFT,
        this.getDataFromStores ()
      )
      .then (res => {
        res && res.data && this.fetchSeason (res.data);
      });
  }

  /**
     * Update multi tier content published
     * @returns {Promise}
     */
  // addVariancePublished() {
  //   return this.Transport.callApi (
  //     endpoints.UPDATE_MULTI_TIER_SEASON_VARIANCE,
  //     this.getDataFromStores (),
  //     this.rights.clearData()
  //     [this.actualseasonId]
  //   );
  // }


  updateContentPublished () {
    if(!this.rightsAdd){
      console.log('first condition')
    return this.Transport.callApi (
      endpoints.UPDATE_MULTI_TIER_SEASON_PUBLISHED,
      this.getDataFromStores (),
      [this.actualSeasonId]
    );
    }else{
      console.log(this.actualSeasonId)
      console.log('second condition')
      return this.Transport.callApi (
        endpoints.UPDATE_MULTI_TIER_SEASON_PUBLISHED_VARIENCE,
        this.getDataFromStores ()
        // [this.actualSeasonId]       
      );
    }
  }

  /**
     * Update multi tier content draft
     * @returns {Promise}
     */
  updateContentDraft () {
    return this.Transport
      .callApi (
        endpoints.UPDATE_MULTI_TIER_SEASON_DRAFT,
        this.getDataFromStores (),
        [this.actualSeasonId]
      )
      .then (res => {
        res && res.data && this.fetchSeason (res.data);
      });
  }

  /**
     * Set stores
     * @param {Object} data - content title object
     */
  setStores (data) {
    super.setStores (data);
    this.titlePrimaryInfo = data.primaryInfo;
    data.primaryInfo && this.primaryInfo.setData (data.primaryInfo);
    data.contentGenres && this.contentGenres.setData (data.contentGenres);
    data.varianceTrailers && this.varianceTrailers.setData (data.varianceTrailers);
    data.aboutTheContent && this.aboutTheContent.setData (data.aboutTheContent);
    data.translation && this.translation.setData (data.translation);
    data.rights && this.rights.setData (data.rights);
    data.products && this.products.setProductNames (data.products);
    data.subscriptionPlans && this.subscriptionPlans.setPlanNames (data.subscriptionPlans);
    this.contentSeasons = null;
    data.nonTextualData && this.nonTextualData.setData (data.nonTextualData);
    data.cast && this.cast.setData (data.cast);
    data.music && this.music.setData (data.music);
    data.tags && this.tags.setData (data.tags);
    data.seoDetails && this.seoDetails.setData (data.seoDetails);
  }
}

export default MultiTierContentSeasonStore;
