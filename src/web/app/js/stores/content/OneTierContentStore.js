import cloneDeep from 'lodash.clonedeep';
import Store from 'stores/Store';
import endpoints from 'transport/endpoints';
import TextualDataStore from 'stores/content/TextualDataStore';
import NonTextualDataStore from 'stores/content/NonTextualDataStore';
import {observable, action, toJS} from 'mobx';
import constants from 'constants/constants';

/**
 * The One Tier Management store.
 */
class OneTierContentStore extends Store {
  id = null;

  @observable status = null;
  @observable subscriptionPlans=null;

  /**
     * Construct a one tier management store
     * @param {Array} args - a component's arguments
     */
  constructor (...args) {
    super (...args);
    this.textualData = new TextualDataStore (...args);
    this.nonTextualData = new NonTextualDataStore (...args);
  }

  /**
     * Fetch One Tier Content
     * @param {String} one tier content id
     * @param {Object} variances configuration object
     * @returns {*|Promise.<TResult>}
     */
  @action fetchOneTierContent (contentId, variancesConfig) {
    return this.Transport
      .callApi (endpoints.GET_ONE_TIER_CONTENT, null, [contentId])
      .then (res => {
         
        // console.log(res);
        // res.data.textualData.contentVariances.push (
        //   cloneDeep (res.data.textualData.contentVariances[0])
        // );
        

        this.setStores (res, variancesConfig);
      });
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
      
        this.setPlans (res);
      })
      .catch (err => console.log (err));
  }

  @action setPlans (plans) {
    this.subscriptionPlans = plans;
  }

  getPlans () {
    return toJS (this.subscriptionPlans);
  }


  /**
     * Set stores
     * @param {Object} content - one tier content object
     * @param {Object} variancesConfig - variances configuration object
     */
  @action setStores (content, variancesConfig) {
    if (content) {
      const nonTextualData = content.data.nonTextualData;

      this.id = content.data.id;
      this.status = content.data.status;
      this.textualData.setData (content.data.textualData, variancesConfig);
      this.nonTextualData.setData (nonTextualData, {
        posterImage: nonTextualData.posterImage ? 'success' : '',
        detailsBackground: nonTextualData.detailsBackground ? 'success' : '',
        mobileDetailsBackground: nonTextualData.mobileDetailsBackground
          ? 'success'
          : '',
      });
    }
  }

  @action setContentIdAndStatus (data, status) {
    this.id = data.id;
    this.status = status;
  }

  /**
     * Set content id
     * @param {Object} response
     */
  @action setContentId (response) {
    this.id = response && response.data ? response.data.id : null;
  }

  /**
     * Create draft
     */
  createOneTierDraft () {
    return this.Transport
      .callApi (endpoints.CREATE_ONE_TIER_DRAFT, {
        textualData: this.textualData.getData (),
        nonTextualData: this.nonTextualData.getData (),
      })
      .then (res => {
        res &&
          res.data &&
          this.setContentIdAndStatus (
            res.data,
            constants.CONTENT.STATUSES.DRAFT
          );
      });
  }

  /**
     * Update draft
     */
  updateOneTierDraft () {
    return this.Transport
      .callApi (
        endpoints.UPDATE_ONE_TIER_DRAFT,
        {
          textualData: this.textualData.getData (),
          nonTextualData: this.nonTextualData.getData (),
        },
        [this.id]
      )
      .then (res => {
        window.location.reload();
        res &&
          res.data &&
          this.setContentIdAndStatus (
            res.data,
            constants.CONTENT.STATUSES.DRAFT
          );
      });
  }

  /**
     * Create published item
     */
  createOneTierPublished () {
    return this.Transport
      .callApi (endpoints.CREATE_ONE_TIER_PUBLISHED, {
        textualData: this.textualData.getData (),
        nonTextualData: this.nonTextualData.getData (),
      })
      .then (res => {
        res &&
          res.data &&
          this.setContentIdAndStatus (
            res.data,
            constants.CONTENT.STATUSES.PUBLISHED
          );
      });
  }

  /**
     * Update published item
     */
  updateOneTierPublished () {
    
    let txtData =this.textualData.getData ();
    // let contentVariances = txtData.contentVariances;
    // let lastItem  = txtData.contentVariances[ txtData.contentVariances.length-1];
    // //txtData.contentVariances =contentVariances[contentVariances.length-1];
    // txtData.contentVariance = lastItem;
    return this.Transport
      .callApi (
        endpoints.UPDATE_ONE_TIER_PUBLISHED,
        {
          textualData: txtData,//this.textualData.getData (),
          nonTextualData: this.nonTextualData.getData (),
        },
        [this.id]
      )
      .then (res => {
        res &&
          res.data &&
          this.setContentIdAndStatus (
            res.data,
            constants.CONTENT.STATUSES.PUBLISHED
          );
      });
  }

  /**
     * Fetch all maps
     */
  fetchAllMaps () {
    return this.textualData.fetchAllMaps ();
  }

  /**
     * Clear store
     */
  @action clearStore () {
    this.id = null;
    this.status = null;
    this.textualData.clearData ();
    this.nonTextualData.clearData ();
  }
}

export default OneTierContentStore;
