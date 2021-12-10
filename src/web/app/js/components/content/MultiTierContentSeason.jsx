import {Row, Col,Button} from 'react-bootstrap';
import React, {Component, PropTypes} from 'react';
import {inject, observer} from 'mobx-react';
import {
  getMultiTierSeasonGridLayout,
  MultiTierContentFields,
} from 'constants/contentFields';
import appRoutes from 'components/app.routes.config';
import Content from 'components/core/Content';
import CollapsiblePanel from 'components/core/CollapsiblePanel';
import {
  isSaveDraft,
  removeDataSaveDraftAttr,
  addDataSaveDraftAttr,
  sendUpdateNotification,
} from 'components/core/Utils';
import MultiTierContentSeasonStore
  from 'stores/content/MultiTierContentSeasonStore';
import constants from 'constants/constants';
import PrimaryInfo from 'components/content/PrimaryInfo';
import FieldWrapper from 'components/core/FieldWrapper';
import ContentGenres from 'components/content/ContentGenres';
import NonTextualData from 'components/content/NonTextualData';
import Cast from 'components/content/Cast';
import Music from 'components/content/Music';
import Tags from 'components/content/Tags';
import Notification from 'components/core/Notification';
import AboutTheContent from 'components/content/AboutTheContent';
import SeasonTranslation from 'components/content/SeasonTranslation';
import RightsSectionMultitierSession from 'components/content/RightsSectionMultitierSession';
import ProductName from 'components/content/ProductName';
import PlanName from 'components/content/PlanName';
import Confirm from 'components/core/Confirm';
import {buildFullSeasonName} from 'components/core/Utils';
import SeoDetails from 'components/content/SeoDetails';
import MultiTeirTrailers from 'components/content/MultiTeirTrailers';
import Loader from 'components/core/Loader';
import ContentGridMultiTier from 'components/content/ContentGridMultiTier';

/**
 * The class represents multi tier content season component
 */
@inject ('appStore')
@observer
class MultiTierContentSeason extends Component {
  /** The component properties */
  static propTypes = {
    route: PropTypes.shape ({
      store: PropTypes.instanceOf (MultiTierContentSeasonStore),
    }).isRequired,
    router: PropTypes.shape ().isRequired,
  };

  /**
     * Construct a multi tier content season component
     * @param {Array} props component's arguments
     */
  constructor (props) {
    super (props);

    const {appStore,router, route: {store, store: {products}}} = this.props;
    this.customErrorMessage = constants.SEASONS_ARE_EMPTY;
    this.currentLocation = {};
    this.titleOptionValue = null;

    this.state = {
      loader:false,
      confirmPopup: {
        show: false,
        html: '',
        handler: null,
      },
      titleOptionValue: null
    };

    this.breadCrumbs = [
      {name: constants.CONTENT_MANAGEMENT, path: appRoutes.MANAGE_CONTENT},
      {name: constants.MANAGE_CONTENT, path: appRoutes.MANAGE_CONTENT},
      {name: constants.CREATE_N_SCHEDULE_CONTENT},
      {name: constants.MULTI_TIER_CONTENT_SEASON},
    ];
    this.handleCancel = this.handleCancel.bind (this);
    this.handlePublish = this.handlePublish.bind (this);
    this.handleSaveDraft = this.handleSaveDraft.bind (this);
    this.handleTitleChanged = this.handleTitleChanged.bind (this);
    this.getTitleOptions = this.getTitleOptions.bind (this);
    this.handleRightSectionChanged = this.handleRightSectionChanged.bind (this);
    this.sendUpdateNotification = sendUpdateNotification.bind (null, appStore);
    this.setProductName = products.setProductNames.bind (products);
    this.handleAboutTheContentChanged = this.handleAboutTheContentChanged.bind (
      this
    );
    this.handleSuccessPublishing = this.handleSuccessPublishing.bind (this);
    this.handleLocationChange = this.handleLocationChange.bind (this);

    this.handleLeave = this.handleLeave.bind (this);
    this.handleCloseConfirmPopup = this.handleCloseConfirmPopup.bind (this);
    this.handleConfirmPopup = this.handleConfirmPopup.bind (this);
    this.updateContentSeasons = store.updateContentSeasons.bind (store);
    this.addVariance = store.addVariance.bind(store);
    this.renderPageFreezeLoader = this.renderPageFreezeLoader.bind(store)
  }

  /**
     * @see Component#componentDidMount()
     */
  componentDidMount () {
    const {appStore, router, route: {store}} = this.props;
    const seasonvariance=this.props.route.path.split("/").slice(-1)[0]
    router.setRouteLeaveHook (this.props.route, nextLocation =>
      this.isRedirectAvailable (nextLocation)
    );
    let that = this;
    if(seasonvariance === "seasonvariance"){
      setTimeout(function(){
        that.addVariance()
      }, 10000)
    }
    else{
      store.resetVarianceStatus();
    }
  }

  /**
     * Checks is redirect without confirmation possible
     * @param {Object} nextLocation - next location
     * @returns {bool} is redirect possible
     */
  isRedirectAvailable (nextLocation) {
    if (
      nextLocation.pathname == this.currentLocation.pathname ||
      nextLocation.pathname.indexOf ('season/') == -1 ||
      nextLocation.pathname.indexOf ('/editSeason') != -1
    ) {
      return true;
    } else {
      this.handleLocationChange (nextLocation);
      return false;
    }
  }

  /**
     * Handles location chane
     * @param {Object} nextLocation - next location
     */
  handleLocationChange (nextLocation) {
    const {router, route: {store}} = this.props;
    if (store.isDataChanged ()) {
      this.handleLeave ();
    } else {
      this.currentLocation = nextLocation ? nextLocation : {};
      nextLocation && router.push (nextLocation);
      return true;
    }
  }

  renderPageFreezeLoader () {
    const {scrollToExpandedVariance, editMode} = this.props;
    if (!scrollToExpandedVariance && editMode) {
      return (
        <div className="freeze-spinner">
          <span className="select-loader">
            <Loader className="bo-essel-loader" />
          </span>
        </div>
      );
    }
  }

  /**
     * @see Component#componentWillMount()
     */
  componentWillMount () {
    const {route: {store}} = this.props;
    store.fetchTitles ();
  }

  /**
     * @see Component#componentWillUnmount()
     */
  componentWillUnmount () {
    const {route: {store}} = this.props;
    store.clearData ();
  }

  /**
     * Handle cancel
     */
  handleCancel () {
    const {router} = this.props;
    router.push (appRoutes.MANAGE_CONTENT);
  }

  /**
     * Handle publish
     */
  handlePublish () {
    this.setState({ loader: true })
    const {route: {store}} = this.props;
    const resultPromise = store.status
      ? store.updateContentPublished ()
      : store.createContentPublished ();

    resultPromise.then (this.handleSuccessPublishing);

  }

  /**
     * Success publishing handler
     */
  handleSuccessPublishing () {
    const {route: {store}} = this.props;
    store.clearData ();
    this.redirect();
    store.resetVarianceStatus();
    this.setState({loader: false})
  }

  /**
     * Redirects to Manage content
     */
  redirect () {
    const {router, appStore, route: {store}} = this.props;
    router.push (appRoutes.MANAGE_CONTENT);
    appStore.setNotificationAfterRedirect (
      Notification.Notifications.info,
      constants.SEASON_NOTIFICATION_MESSAGE
    );
  }

  /**
     * Handle save draft
     */
  handleSaveDraft () {
    const {appStore, router, route: {store}} = this.props;
    const resultPromise = store.status
      ? store.updateContentDraft ()
      : store.createContentDraft ();
    resultPromise.then (() => {
      router.push (appRoutes.EDIT_SEASON.replace (':seasonId', store.seasonId));
      appStore.setNotificationAfterRedirect (
        Notification.Notifications.info,
        constants.SEASON_NOTIFICATION_MESSAGE
      );
    });
  }

  /**
     * Title changed handler
     * @param {Object} titleOption - title dropdown option
     */
  handleTitleChanged(titleOption) {
    const titleOptionValue = (titleOption && titleOption.value) ? titleOption.value : null;

    const { route: { store } } = this.props;
    store.setContentId(titleOption.value);
    this.handleLeave();
    this.setState({
      titleOptionValue: titleOptionValue
    })
    // if (this.handleLocationChange()) {
    //     this.setTitleOptionValue(this.titleOptionValue);
    // }
}

  /**
     * Sets store data
     * @param {Object} titleOptionValue - title dropdown option
     */
    setTitleOptionValue(titleOptionValue) {
      const { router, route: { store } } = this.props;
      if (titleOptionValue) {
        store.fetchTitle(titleOptionValue, null, true);
      } else {
          store.clearData();
      }
      // router.push(appRoutes.MULTI_TIER_CONTENT_SEASON);
  }


  /**
     * Get title dropdown options
     * @returns {Array}
     */
  getTitleOptions () {
    const {route: {store}} = this.props;

    return store.titles
      ? store.titles.map (title => ({
          label: title.transliteratedTitle,
          value: title.id,
        }))
      : null;
  }

  /**
     * Handle right section changed
     * @param {String} name - data property name
     * @param {Object} value - data property value
     */
  handleRightSectionChanged (name, value) {    
    const {route: {store: {rights}}} = this.props; 
      if(name!='subscriptionPlans') 
        rights.setDataByName (name, value);
        else
        rights.updateDataByName (name, value);

  }

  /**
     * About the content change handler
     * @param {Object} field - field config
     * @param {Object} event - event object
     */
  handleAboutTheContentChanged (field, event) {
    const {route: {store: {translation}}} = this.props;
    if (field.name == 'seasonNumber' || field.name == 'transliteratedTitle') {
      translation.clearData ();
    }
  }

  addItem(){
    let html = '',
    title = "Please add New rights",
    handler = this.addVariance;
    this.setState ({
      confirmPopup:{
        show:true,
        html,
        handler,
        title


      }
    })
  }

  /**
     * Leave handler
     * @param {Object} item - content item
     */
  handleLeave (nextLocation) {
    const {contentType} = this.props;
    let html = '',
      title = '',
      cancelText = 'No',
      confirmText = 'Yes',
      handler = this.leavePage.bind (this, nextLocation);

    title = constants.TITLE_CONFIRMATION.TITLE;
    html = constants.TITLE_CONFIRMATION.TEXT;
    this.setState ({
      confirmPopup: {
        show: true,
        html,
        handler,
        cancelText,
        confirmText,
        title,
      },
    });
  }

  /**
     * Leave page
     * @param {Object} nextLocation - next location
     */
  leavePage (nextLocation) {
    const {router} = this.props;
    this.handleCloseConfirmPopup ();
    this.currentLocation = nextLocation.pathname ? nextLocation : {};
    if (nextLocation.pathname) {
      router.push (this.currentLocation);
    } else {
      this.setTitleOptionValue (this.state.titleOptionValue);
    }
  }
  

  /**
     *  Confirm popup handler
     */
  handleConfirmPopup () {
    const {handler} = this.state.confirmPopup;
    handler && handler ();
  }

  /**
     * Close confirm popup handler
     */
  handleCloseConfirmPopup () {
    this.setState ({
      confirmPopup: {
        show: false,
        html: '',
        handler: null,
      },
    });
  }

  /**
     * Render leave confirmation popup
     * @returns {ReactNode} popup node
     */
  renderConfirmationView () {
    const {
      html,
      show,
      cancelText,
      confirmText,
      title,
    } = this.state.confirmPopup;
    return (
      <Confirm
        key="confirm"
        onConfirm={this.handleConfirmPopup}
        onClose={this.handleCloseConfirmPopup}
        body={html}
        visible={show}
        cancelText={cancelText}
        confirmText={confirmText}
        title={title}
      />
    );
  }

  /**
     * @see Component#render()
     */
  render () {
    const {
      route: {
        store,
        store: {
          contentGridMultiTierStore,
          primaryInfo,
          contentGenres,
          varianceTrailers,
          nonTextualData,
          cast,
          music,
          tags,
          aboutTheContent,
          translation,
          rights,
          products,
          contentSeasons,
          titlePrimaryInfo,
          contentId,
          seoDetails,
        },
      },
      router,
    } = this.props;
    const {
      season: {
        primaryInfo: {fields: primaryInfoFields},
        contentGenres: {fields: contentGenresFields},
        title: titleField,
        aboutTheContent: {fields: aboutTheContentFields},
        seoDetails: {fields: seoDetailsFields},
        contentFields: {fields: contentFields},
        TrailerFields: {fields: TrailerFields},
        translation: {fields: translationFields},
        rightsSection: {fields: rightsSectionFields},
       // subscriptionPlans: {fields: subscriptionPlansFields},
        products: {fields: productsFields},
        gridData,
      },
    } = MultiTierContentFields;

    return (
      <div>
      <Content
        router={router}
        breadCrumbs={this.breadCrumbs}
        name="multiTierForm"
        onCancel={this.handleCancel}
        onPublish={this.handlePublish}
        onSaveDraft={this.handleSaveDraft}
        isPublished={store.status == constants.CONTENT.STATUSES.PUBLISHED}
      >
            {
          this.state.loader &&
          <span className="bo-essel-loader-bounce bo-essel-loader-center">
          <Loader className="bo-essel-loader-center"/>
          </span>
        }
        <div className="select-title-block">
          <div className="text-center table-title">
            {titlePrimaryInfo &&
              `${titlePrimaryInfo.contentType}: ${titlePrimaryInfo.transliteratedTitle}`}
          </div>
      
          <Row>
            <Col>
              <ContentGridMultiTier
                store={contentGridMultiTierStore}
                contentId={contentId}
                contentLevel="SEASONS"
                contentType="season"
                data={store.data}
                customErrorMessage={this.customErrorMessage}
                getMultiTierGridLayout={getMultiTierSeasonGridLayout}
                buildFullName={buildFullSeasonName}
                updateContentSeasons={this.updateContentSeasons}
              />
            </Col>
          </Row>
        </div>
        <div className="select-title-block">
          <Row>
            <Col md={6}>
              <FieldWrapper
                fieldConfig={titleField}
                handleChange={this.handleTitleChanged}
                value={this.state.titleOptionValue || store.contentId}
                getOptions={this.getTitleOptions}
              />
            </Col>
          </Row>
        </div>
        <CollapsiblePanel name="Primary Info">
          <PrimaryInfo
            store={primaryInfo}
            fields={primaryInfoFields}
            onChange={this.handleAboutTheContentChanged}
          />
        </CollapsiblePanel>
        <CollapsiblePanel name="Content Genres">
          <ContentGenres store={contentGenres} fields={contentGenresFields} />
        </CollapsiblePanel>
        <CollapsiblePanel name="Trailers">
         <MultiTeirTrailers store={varianceTrailers} fields={TrailerFields}/>
        </CollapsiblePanel>
        <CollapsiblePanel name="Non-Textual Data">
          <NonTextualData store={nonTextualData} fields={contentFields} />
        </CollapsiblePanel>
        <CollapsiblePanel name="About The Content">
          <AboutTheContent
            store={aboutTheContent}
            fields={aboutTheContentFields}
          />
          <SeasonTranslation
            store={translation}
            translations={store.createdSeasonsTranslations}
            fields={translationFields}
          />
        </CollapsiblePanel>
        <CollapsiblePanel name="Content SEO Details">
          <SeoDetails store={seoDetails} fields={seoDetailsFields} />
        </CollapsiblePanel>
        <CollapsiblePanel name="Cast">
          <Cast store={cast} />
        </CollapsiblePanel>
        <CollapsiblePanel name="Music">
          <Music store={music} />
        </CollapsiblePanel>
        <CollapsiblePanel name="Tags">
          <Tags store={tags} />
        </CollapsiblePanel>
        <CollapsiblePanel name="Rights section">
          <RightsSectionMultitierSession
            fields={rightsSectionFields}
            // seasonvariance={seasonvariance?true:null}
            values={rights.data}
            //values={seasonvariance[0]==="seasonvariance"?rights.data.clearData():rights.data}
            store={rights}
            onChange={this.handleRightSectionChanged}
          />
           {/* <button onClick={()=>this.addVariance()}>Add variance</button> */}

          {/* <PlanName
             field={subscriptionPlansFields}
             value={variance.subscriptionPlans? variance.subscriptionPlans.peek ():[]}
             store={store}
             onChange={this.handlePlansChanged}
            />           */}
          <ProductName
            field={productsFields}
            value={products.productNames ? products.productNames.peek () : []}
            store={products}
            onChange={this.setProductName}
          />
          {/* <div className="text-right">
             <button onClick={()=>this.addVariance()}>Add variance</button>
          </div> */}
        </CollapsiblePanel>
        {this.renderConfirmationView ()}
      </Content>
      </div>
    );
  }
}

export default MultiTierContentSeason;
