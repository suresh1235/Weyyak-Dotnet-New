import Store from 'stores/Store';
import endpoints from 'transport/endpoints';
import {action, computed, toJS, observable} from 'mobx';
import PageDetailsStore
  from 'stores/sitemanagement/pageconstructor/PageDetailsStore';
import SeoDetailsStore
  from 'stores/sitemanagement/pageconstructor/SeoDetailsStore';
import PublishOnStore from 'stores/sitemanagement/shared/PublishOnStore';
import PageSlidersStore
  from 'stores/sitemanagement/pageconstructor/PageSlidersStore';
import NonTextualDataStore from 'stores/content/NonTextualDataStore';


/**
 * The Page Constructor Store.
 */
class PageConstructorStore extends Store {
  id = null;

  @observable pages = [];

  constructor (...args) {
    super (...args);
    this.pageDetails = new PageDetailsStore (...args);
    this.seoDetails = new SeoDetailsStore (...args);
    this.publishOn = new PublishOnStore (...args);
    this.pageSliders = new PageSlidersStore (...args);
    this.nonTextualData = new NonTextualDataStore (...args);
  }

  @computed get homePagesPlatformConflicts () {
    const {publishingPlatforms: {data: {publishingPlatforms}}} = this.publishOn;

    const assignedPlatformsArrays = toJS (this.pages)
      .filter (p => p.id != this.id && p.isHome)
      .map (p => p.publishingPlatforms);

    const assignedPlatforms = assignedPlatformsArrays.length
      ? assignedPlatformsArrays.reduce ((a, b) => a.concat (b))
      : [];

    return assignedPlatforms
      .filter (pp => publishingPlatforms.indexOf (pp.id) > -1)
      .map (pp => pp.name)
      .sort ()
      .filter ((el, i, a) => i === a.indexOf (el));
  }

  createPage () {
    const data = this.collectData ();
    // console.log(data)
    return this.Transport
      .callApi (endpoints.PAGES.CREATE_PAGE, data)
      .then (res => {
        // TODO: handle in future versions
      });
  }

  updatePage () {
    const data = this.collectData ();
    return this.Transport
      .callApi (endpoints.PAGES.UPDATE_PAGE, data, [this.id])
      .then (res => {
        // TODO: handle in future versions
      });
  }

  collectData () {
    const {
      englishTitle,
      arabicTitle,
      pageOrderNumber,
      publishingPlatformsOrder,
      isHomePage,
      playlists,
    } = this.pageDetails.getData ();

    const {
      englishPageFriendlyUrl,
      arabicPageFriendlyUrl,
      englishMetaTitle,
      arabicMetaTitle,
      englishMetaDescription,
      arabicMetaDescription,
    } = this.seoDetails.getData ();

    const {publishingPlatforms, regions} = this.publishOn.getData ();

    const {defaultSlider, sliders} = this.pageSliders.getData ();

    const nonTextualData = this.nonTextualData.getData()
    // console.log(nonTextualData)
    // console.log(nonTextualData.mobileMenuPosterImage)
    const non={
      menuPosterImage: nonTextualData.menuPosterImage,
      mobileMenuPosterImage: nonTextualData.mobileMenuPosterImage ,
      mobileMenu: nonTextualData.mobileMenu
    }

    

    return {
      englishTitle,
      arabicTitle,
      pageOrderNumber,
      publishingPlatformsOrder,
      isHome: isHomePage,
      playlistsIds: (playlists || []).map (x => x.id),
      englishPageFriendlyUrl,
      arabicPageFriendlyUrl,
      englishMetaTitle,
      arabicMetaTitle,
      englishMetaDescription,
      arabicMetaDescription,
      publishingPlatforms,
      regions,
      defaultSliderId: isHomePage && !!defaultSlider ? defaultSlider.id : null,
      nonTextualData:non,
      slidersIds: (sliders || []).map (x => x.id),
    };
  }

  @action fetchPage (pageId) {
    return this.Transport
      .callApi (endpoints.PAGES.GET_PAGE, null, pageId)
      .then (res => {
        this.setStores (res);
      });
  }

  /**
   * Fetch pages ordering and platforms information.
   * @returns {Promise} a call api promise
   */
  @action fetchPages () {
    return this.Transport
      .callApi (endpoints.PAGES.GET_PAGES_ORDERED)
      .then (res => {
        const items = res.data;
        this.setPages (items);
        this.pageDetails.setPublishingPlatformsOrder (items);
        this.pageDetails.setOriginalPublishingPlatformsOrder (items);
      });
  }

  @action updateOrderWithinMenu () {
    const items = this.pageDetails.getPublishingPlatformsOrder;
    return this.Transport
      .callApi (endpoints.PAGES.UPDATE_PAGES_ORDERED, items);
  }

  @action setPages (data) {
    this.pages = data;
  }

  @action setStores (content) {
    if (content) {
      this.id = content.data.id;
      const nonTextualData = content.data.nonTextualData;
      // console.log(nonTextualData)
      
      const {
        englishTitle,
        arabicTitle,
        pageOrderNumber,
        isHome,
        playlists,
      } = content.data;

      const {
        englishPageFriendlyUrl,
        arabicPageFriendlyUrl,
        englishMetaTitle,
        arabicMetaTitle,
        englishMetaDescription,
        arabicMetaDescription,
      } = content.data;

      const {publishingPlatforms, regions} = content.data;

      const {defaultSlider, sliders} = content.data;
      
      this.pageDetails.setData ({
        englishTitle,
        arabicTitle,
        pageOrderNumber,
        isHomePage: isHome,
        playlists: playlists,
      });

      this.seoDetails.setData (
        {
          englishPageFriendlyUrl,
          arabicPageFriendlyUrl,
          englishMetaTitle,
          arabicMetaTitle,
          englishMetaDescription,
          arabicMetaDescription,
        },
        {
          arabicTitle,
          englishTitle,
        }
      );

      this.nonTextualData.setData (nonTextualData, {
        menuPosterImage: nonTextualData.menuPosterImage ? 'success' : '',
        mobileMenuPosterImage: nonTextualData.mobileMenuPosterImage ? 'success' : '',
        mobileMenu: nonTextualData.mobileMenu
          ? 'success'
          : '',
      });

      this.publishOn.setStores ({
        publishingPlatforms: publishingPlatforms || [],
        regions: regions || [],
      });

      this.pageSliders.setData ({
        defaultSlider,
        sliders,
      });
    }
  }

  /**
   * Clear store
   */
  @action clearStore () {
    this.id = null;
    this.pages = [];
    this.pageDetails.clearData ();
    this.seoDetails.clearData ();
    this.publishOn.clearStore ();
    this.pageSliders.clearData ();
    this.nonTextualData.clearData ();
  }
}

export default PageConstructorStore;
