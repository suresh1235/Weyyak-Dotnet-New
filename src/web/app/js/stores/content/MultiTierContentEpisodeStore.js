import {observable, action, toJS} from 'mobx';

import endpoints from 'transport/endpoints';
import {getSetterName, getFirstMissedNumber} from 'components/core/Utils';
import {isEqual} from 'lodash';

import ContentStoreBase from 'stores/content/ContentStoreBase';
import constants from 'constants/constants';
import PrimaryInfoEpisodeMTCStore
  from 'stores/content/PrimaryInfoEpisodeMTCStore';
import NonTextualDataStore from 'stores/content/NonTextualDataStore';
import CastStore from 'stores/content/CastStore';
import MusicStore from 'stores/content/MusicStore';
import TagStore from 'stores/content/TagStore';
import RightsStore from 'stores/content/RightsStore';
import PublishingPlatformsStore from 'stores/shared/PublishingPlatformsStore';
import moment from 'moment';
import ContentGridMultiTierStore
  from 'stores/content/ContentGridMultiTierStore';
import SeoDetails from 'stores/content/SeoDetailsStore';

/**
 * The Multi tier content episode store
 */
class MultiTierContentEpisodeStore extends ContentStoreBase {
  @observable schedulingDateTime = null;

  @observable contentId = null;

  @observable titles = null;

  @observable seasons = null;

  @observable seasonId = null;

  @observable introStart = null;
  @observable outroStart = null;

  @observable contentSeasons = null;

  @observable currentSeason = null;

  @observable status = null;

  @observable episodeId = null;

  @observable episode = null;

  @observable savedEpisodes = null;

  @observable savedEpisodesAndTitles = null;

  // @observable plans = null;
  @observable subscriptionPlans = []

  /**
     * Checks is data was changed
     * @param {Array} props - a store's arguments
     */
  @action isDataChanged () {
    let episode = toJS (this.episode);
    let formData = toJS (this.getData ());
    let dirty = false;

    episode &&
      Object.keys (formData).forEach (key => {
        let currentData = toJS (formData[key]);
        let templateData = toJS (episode[key]);

        if (key == 'primaryInfo') {
          delete currentData.savedEpisodes;
          delete templateData.savedEpisodes;
          delete currentData.savedEpisodesAndTitles;
          delete templateData.savedEpisodesAndTitles;
        }

        // TODO NOT REMOVE
        // Chenge format of digital rights start date to compare
        if (key == 'rights') {
          currentData = JSON.stringify (formData[key]);
          templateData = JSON.stringify (episode[key]);
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
     * Construct a multi tier content episode store
     * @param {Array} props - a store's arguments
     */
  constructor (props) {
    super (props);
    this.contentGridMultiTierStore = new ContentGridMultiTierStore (props);
    this.primaryInfo = new PrimaryInfoEpisodeMTCStore (props);
    this.nonTextualData = new NonTextualDataStore (props);
    this.cast = new CastStore (props);
    this.music = new MusicStore (props);
    this.tags = new TagStore (props);
    this.rights = new RightsStore (props);
    this.platforms = new PublishingPlatformsStore (props);
    this.seoDetails = new SeoDetails (...props);
  }

  /**
     * Fetch One Tier Content
     * @param {String} one tier content id
     * @param {Object} variances configuration object
     * @returns {*|Promise.<TResult>}
     */
  @action fetchPlans () {
    return this.Transport
      .callApi (endpoints.PLANS)
      .then (res => {
        // TODO remove hardcode
        // res = [
        //   {name: 'plan 1', id: 1},
        //   {name: 'plan 2', id: 2},
        //   {name: 'plan 3', id: 3},
        //   {name: 'plan 4', id: 4},
        // ];
        this.setPlans (res);
      })
      .catch (err => console.log (err));
  }

  @action setPlans (plans) {    
    this.plans = plans;
  }


  // @action setPlans(plans) {
  //   this.subscriptionPlans = plans;
  // }

  getPlans () {
    return toJS (this.plans);
  }

  // getPlans() {
  //   return toJS(this.subscriptionPlans)
  // }

  /**
     * Set scheduling date time
     * @param {Moment} dateTime - scheduling date time
     */
  @action setsSchedulingDateTime (dateTime) {
    this.schedulingDateTime = dateTime;
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
     * Set content season data
     * @param {Object} contentSeasons - content object
     * @param {String} contentId - content title id
     */
  @action setSeasonData (contentSeasons, contentId) {
    this.clearData ();
    this.seasons = contentSeasons;
    this.setContentId (contentId);
  }

  /**
     * Updates list of episode numbers and sets actual number
     * @param {Object} item - current item
     */
  @action updateEpisodeData (item) {
    this.savedEpisodes.splice (
      this.savedEpisodes.indexOf (item.primaryInfo.number),
      1
    );
    let savedEpisodesUpdate = getFirstMissedNumber (
      this.savedEpisodes ? this.savedEpisodes.toJS () : null
    );
    this.primaryInfo.data.number = this.episodeId
      ? this.episode.primaryInfo.number
      : savedEpisodesUpdate;
  }

  /**
     * Set content episode data
     * @param {String} contentId - content title id
     */
  @action setEpisode (contentId, episodeData) {
    this.seoDetails.data = episodeData
      ? episodeData.seoDetails
      : JSON.parse (
          '{"englishMetaTitle": "", "arabicMetaTitle": "", "englishMetaDescription": "", "arabicMetaDescription": ""}'
        );
    this.currentSeason = this.seasons.find (season => season.id == contentId);
    const {episodes} = this.currentSeason;
    this.savedEpisodes = episodes.length
      ? episodes
          .map (episode => episode.primaryInfo.number)
          .sort ((a, b) => a - b)
      : null;

    const existingNumber = episodeData ? episodeData.primaryInfo.number : 0;

    this.savedEpisodesAndTitles = episodes
      .filter (episode => existingNumber != episode.primaryInfo.number)
      .map (episode => ({
        number: episode.primaryInfo.number,
        transliteratedTitle: episode.primaryInfo.transliteratedTitle,
      }));

    let actualEpisode = getFirstMissedNumber (
      this.savedEpisodes ? this.savedEpisodes.toJS () : null
    );

    this.seasonId = contentId;

    const {
      primaryInfo,
      contentGenres,
      contentSeasons,
      nonTextualData,
      cast,
      music,
      tagInfo,
      publishingPlatforms,
    } = episodeData
      ? episodeData
      : this.seasons.find (season => season.id == contentId);

    const {rights} = this.seasons.find (season => season.id == contentId);

    this.primaryInfo.setData ({
      savedEpisodes: this.savedEpisodes,
      savedEpisodesAndTitles: this.savedEpisodesAndTitles,

      originalTitle: primaryInfo.originalTitle,
      alternativeTitle: primaryInfo.alternativeTitle,
      arabicTitle: primaryInfo.arabicTitle,
      transliteratedTitle: primaryInfo.transliteratedTitle,
      notes: primaryInfo.notes,

      number: !episodeData ? actualEpisode : primaryInfo.number,
      videoContentId: !episodeData ? '' : primaryInfo.videoContentId,
      synopsisEnglish: !episodeData ? '' : primaryInfo.synopsisEnglish,
      synopsisArabic: !episodeData ? '' : primaryInfo.synopsisArabic,
      introStart: !episodeData ? '' : primaryInfo.introStart,
      outroStart: !episodeData ? '' : primaryInfo.outroStart,
    });

    this.cast.setData (toJS (cast));
    this.music.setData (toJS (music));
    this.tags.setData (tagInfo.tags);

    this.episodeId = !episodeData ? null : episodeData.id;
    this.status = !episodeData ? null : episodeData.status;
    this.schedulingDateTime = !episodeData
      ? null
      : episodeData.schedulingDateTime &&
          moment (episodeData.schedulingDateTime);

    episodeData &&
      (this.platforms.data.publishingPlatforms = publishingPlatforms);

    episodeData
      ? this.nonTextualData.setData (episodeData.nonTextualData, {
          posterImage: episodeData.nonTextualData.posterImage ? 'success' : '',
          dubbingScript: episodeData.nonTextualData.dubbingScript
            ? 'success'
            : '',
          subtitlingScript: episodeData.nonTextualData.subtitlingScript
            ? 'success'
            : '',
        })
      : this.nonTextualData.clearData ();

    this.contentSeasons = contentSeasons;
    this.rights.setData (
      Object.assign ({}, rights, {
        digitalRightsStartDate: rights.digitalRightsStartDate &&
          moment (rights.digitalRightsStartDate),
        digitalRightsEndDate: rights.digitalRightsEndDate &&
          moment (rights.digitalRightsEndDate),
      })
    );
    this.episode = this.getDataJS ();
  }

  /**
     * Resets store data.
     */
  @action clearData () {
    this.contentSeasons = null;
    this.seasons = null;
    this.setContentId ('');
    this.clearSeasonData ();
  }

  /**
     * Resets episode data.
     */
  @action clearSeasonData () {
    this.seasonId = null;
    this.introStart = null;
    this.outroStart = null;
    this.currentSeason = null;
    this.clearEpisodeData ();
  }

  /**
     * Resets episode data.
     */
  @action clearEpisodeData () {
    super.clearData ();
    this.schedulingDateTime = null;
    this.episodeId = null;
    this.status = null;
    this.episode = null;
    this.savedEpisodes = null;
    this.savedEpisodesAndTitles = null;
    this.primaryInfo.clearData ();
    this.nonTextualData.clearData ();
    this.cast.clearData ();
    this.music.clearData ();
    this.tags.clearData ();
    this.rights.clearData ();
    this.platforms.clearData ();
    this.seoDetails.clearData ();
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
     * @param {String} seasonId - content season id
     * @param {String} episodeData - episode data
     * @param {Bool} editMode - is page in edit mode
     * @returns {Promise}
     */
  fetchTitle (contentId, seasonId, episodeData, editMode) {
    return this.Transport
      .callApi (endpoints.GET_MULTI_TIER_CONTENT_TITLE, null, [contentId])
      .then (res => {
        res &&
          res.data &&
          this.setSeasonData (res.data.contentSeasons, contentId);
        seasonId && this.setEpisode (seasonId, episodeData);
      });
  }

  /**
     * Fetch multi tier content episode by id
     * @param {String} contentId - content episode id
     * @param {Bool} editMode - is page in edit mode
     * @returns {Promise}
     */
  fetchEpisode (episodeId, editMode) {
    return this.Transport
      .callApi (endpoints.GET_EPISODES_DATA, null, [episodeId])
      .then (res => {
        if (res && res.data) {
          this.fetchTitle (
            res.data.contentId,
            res.data.seasonId,
            res.data,
            editMode
          );
        }
      });
  }

  /**
     * Get not obsererable store data
     * @returns {{seasonId: *,seoDetails:Object, primaryInfo: Object, nonTextualData: Object, cast: Object, music: Object, tagInfo: {tags: Object}, schedulingDateTime: *, publishingPlatformsList}} - store data
     */
  getDataJS () {
    return {
      seasonId: toJS (this.seasonId),
      introStart: toJS (this.introStart),
      outroStart: toJS (this.outroStart),
      primaryInfo: toJS (this.primaryInfo.getData ()),
      nonTextualData: toJS (this.nonTextualData.getData ()),
      cast: toJS (this.cast.getData ()),
      music: toJS (this.music.getData ()),
      tagInfo: {tags: toJS (this.tags.getData ())},
      schedulingDateTime: toJS (this.schedulingDateTime),
      publishingPlatforms: toJS (this.platforms.getData ().publishingPlatforms),
      seoDetails: toJS (this.seoDetails.getData ()),
    };
  }

  /**
     * Get store data
     * @returns {{seasonId: *, primaryInfo: Object, nonTextualData: Object, cast: Object, music: Object, tagInfo: {tags: Object}, schedulingDateTime: *, publishingPlatformsList}} - store data
     */
  getData () {
    return {
      seasonId: this.seasonId,
      primaryInfo: this.primaryInfo.getData (),
      nonTextualData: this.nonTextualData.getData (),
      cast: this.cast.getData (),
      music: this.music.getData (),
      tagInfo: {tags: this.tags.getData ()},
      schedulingDateTime: this.schedulingDateTime,
      publishingPlatforms: this.platforms.getData ().publishingPlatforms,
      seoDetails: this.seoDetails.getData (),
    };
  }

  /**
     * Create multi tier content season published
     * @returns {Promise}
     */
  createContentPublished () {
    return this.Transport.callApi (
      endpoints.CREATE_MULTI_TIER_EPISODE_PUBLISHED,
      this.getData ()
    );
  }

  /**
     * Create multi tier content draft
     * @returns {Promise}
     */
  createContentDraft () {
    return this.Transport.callApi (
      endpoints.CREATE_MULTI_TIER_EPISODE_DRAFT,
      this.getData ()
    );
  }

  /**
     * Update multi tier content published
     * @returns {Promise}
     */
  updateContentPublished () {
    return this.Transport.callApi (
      endpoints.UPDATE_MULTI_TIER_EPISODE_PUBLISHED,
      this.getData (),
      [this.episodeId]
    );
  }

  /**
     * Update multi tier content draft
     * @returns {Promise}
     */
  updateContentDraft () {
    return this.Transport.callApi (
      endpoints.UPDATE_MULTI_TIER_EPISODE_DRAFT,
      this.getData (),
      [this.episodeId]
    );
  }

  /**
     * Set stores
     * @param {Object} data - content title object
     */
  setStores (data) {
    super.setStores (data);
    data.primaryInfo && this.primaryInfo.setData (data.primaryInfo);
    this.contentSeasons = null;
    data.nonTextualData && this.nonTextualData.setData (data.nonTextualData);
    data.cast && this.cast.setData (data.cast);
    data.music && this.music.setData (data.music);
    data.tags && this.tags.setData (data.tags);
    data.rights && this.rights.setData (data.rights);
    data.seoDetails && this.seoDetails.setData (data.seoDetails);
  }
}

export default MultiTierContentEpisodeStore;
