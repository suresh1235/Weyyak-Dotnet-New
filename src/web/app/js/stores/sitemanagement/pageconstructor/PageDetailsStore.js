import {observable, action, toJS, computed} from 'mobx';
import cloneDeep from 'lodash.clonedeep';
import Store from 'stores/Store';
import {getSetterName} from 'components/core/Utils';
import endpoints from 'transport/endpoints';
import constants from 'constants/constants';

/**
 * The details base class store
 * Should be implemented in inheritors
 */
class PageDetailsStore extends Store {
  /** Custom data observable object */
  @observable data = {
    englishTitle: '',
    arabicTitle: '',
    pageOrderNumber: null,
    isHomePage: false,
    playlists: [],
  };

  @observable publishingPlatformsOrder = {};
  @observable originalPublishingPlatformsOrder = {};

  pageId = '';

  @computed get playlists () {
    return toJS (this.data.playlists);
  }

  @computed get isHomePage () {
    return toJS (this.data.isHomePage);
  }

  @computed get getPublishingPlatformsOrder () {
    return toJS (this.publishingPlatformsOrder);
  }

  @computed get getOriginalPublishingPlatformsOrder () {
    return toJS (this.originalPublishingPlatformsOrder);
  }

  /**
   * Set page english title
   * @param {String} englishTitle - page english title
   */
  @action setEnglishTitle (englishTitle) {
    const prevTitle = this.data.englishTitle;
    this.data.englishTitle = englishTitle;
    this.syncIsHomeByEnglishTitle (prevTitle, englishTitle);
  }

  /**
   * Set page arabic title
   * @param {String} arabicTitle - page arabic title
   */
  @action setArabicTitle (arabicTitle) {
    this.data.arabicTitle = arabicTitle;
  }

  syncIsHomeByEnglishTitle (prevTitle, newTitle) {
    prevTitle = (prevTitle || '').trim ().toLowerCase ();
    newTitle = (newTitle || '').trim ().toLowerCase ();

    if (prevTitle === newTitle) {
      return;
    }

    const isHomePageByEnglishTitle = newTitle === 'home';
    const isHomePage = this.data.isHomePage;

    if (isHomePageByEnglishTitle === isHomePage) {
      return;
    }

    this.setIsHomePage (isHomePageByEnglishTitle);

    //Changed from home page to simple one.
    if (isHomePageByEnglishTitle == false) {
      const newPageOrderNumber =
        this.prevPageOrderNumber || this.nextAvaiableOrderNumber - 1;
      newPageOrderNumber && this.setPageOrderNumber (newPageOrderNumber);
    } else {
      //Changed from simple page to home one.
      //Save current page order number before converting it
      //into home to give the user a chance for a fallback.
      if (!!this.data.pageOrderNumber) {
        this.prevPageOrderNumber = this.data.pageOrderNumber;
      }
      this.setPageOrderNumber (0);
    }
  }

  setPageId (pageId) {
    this.pageId = pageId;
  }

  /**
   * Set if home page
   * @param {boolean} isHome - if home page
   */
  @action setIsHomePage (isHome) {
    this.data.isHomePage = isHome;
  }
  
  @action setOriginalPublishingPlatformsOrder (publishingPlatformsOrder) { 
    this.originalPublishingPlatformsOrder = publishingPlatformsOrder;
  }

  @action setPublishingPlatformsOrder (publishingPlatformsOrder) {    
    this.publishingPlatformsOrder = publishingPlatformsOrder;
  }

  @action setPlaylists (ids) {
    this.data.playlists = ids || [];
  }

  /**
   * Base fetch data method for implementation in inheritors
   */
  @action fetchData () {}

  /**
   * Set data
   * @param {Object} data - data
   */
  @action setData (data) {
    this.data = data;
  }

  /**
   * Get pages order numbers
   * @returns {Array} pagesOrderNumbers
   */
  getPagesOrderNumbers () {
    return toJS (this.pagesOrderNumbers);
  }

  @action fetchPlaylists (searchText) {
    return this.Transport.callApi (
      endpoints.PLAYLISTS.GET_PLAYLISTS_SUMMARY,
      null,
      [searchText || '', 0, constants.MULTISELECT_SEARCH.SEARCH_LIMIT, false]
    );
    /*.then(res => {
            this.setPlaylists.call(this, res.data);
        })*/
  }

  @action clearPlaylists () {
    this.setPlaylists ([]);
  }

  /**
   * Retrieve normalized data object for the store
   * @returns {Object} normalized data
   */
  getData () {
    return toJS (this.data);
  }

  /**
   * Empties all props in data object
   */
  @action clearData () {
    this.pagesOrderNumbers = null;
    this.prevPageOrderNumber = null;
    Object.keys (this.data).forEach (prop => {
      if (!!this.data[prop] || this.data[prop] === 0) {
        if (this[getSetterName (prop)]) {
          this[getSetterName (prop)] ('');
        }
      }
    });
  }
}

export default PageDetailsStore;
