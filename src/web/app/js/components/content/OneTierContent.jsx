import React, {Component, PropTypes} from 'react';
import {Provider, inject} from 'mobx-react';
import constants from 'constants/constants';
import PrimaryInfo from 'components/content/PrimaryInfo';
import ContentGenres from 'components/content/ContentGenres';
import ContentVariances from 'components/content/ContentVariances';
import ContentVariance from 'components/content/ContentVariance';
import ContentVersions from 'components/content/ContentVersions';
import AboutTheContent from 'components/content/AboutTheContent';
import Cast from 'components/content/Cast';
import Music from 'components/content/Music';
import Tags from 'components/content/Tags';
import NonTextualData from 'components/content/NonTextualData';
import Loader from 'components/core/Loader';
import SeoDetails from 'components/content/SeoDetails';
import CollapsiblePanel from 'components/core/CollapsiblePanel';
import Content from 'components/core/Content';
import {Button} from 'react-bootstrap';
import {
  isSaveDraft,
  removeDataSaveDraftAttr,
  addDataSaveDraftAttr,
  scrollUp,
  sendUpdateNotification,
} from 'components/core/Utils';

import appRoutes from 'components/app.routes.config';
import {OneTierContentFields} from 'constants/contentFields';

import content from 'css/content';

/**
 * The class contains logic of managing the one tier content
 */
@inject ('appStore')
class OneTierContent extends Component {
  static PropTypes = {};

  /**
     * List of field names which must validates in case of 'Publish'
     */
  static validationsFormPerType = [
    'languageType',
    'englishSynopsis',
    'ageGroup',
    'arabicSynopsis',
    'mainActorId',
    'contentType',
    'originType',
    'dubbingLanguage',
    'subtitling',
    'subtitlingLanguage',
    'dubbedDialects',
    'videoContentId',
    'arabicTitle',
    'transliteratedTitle',
    'genreId',
    'subgenresId',
    'originalLanguage',
  ];

  /**
     * Construct one tier management component
     * @param {Object} props - a component's arguments
     */
  constructor (props) {
    super (props);
    this.state = {
      loader:false
    };

    this.breadCrumbs = [
      {name: constants.CONTENT_MANAGEMENT, path: appRoutes.MANAGE_CONTENT},
      {name: constants.MANAGE_CONTENT, path: appRoutes.MANAGE_CONTENT},
      {name: constants.CREATE_N_SCHEDULE_CONTENT},
      {name: constants.ONE_TIER_CONTENT},
    ];

    this.handlePublish = this.handlePublish.bind (this);
    this.handleSaveDraft = this.handleSaveDraft.bind (this);
    this.handleConfirmCancelPopup = this.handleConfirmCancelPopup.bind (this);
    this.handleSuccessPublishing = this.handleSuccessPublishing.bind (this);
    this.handleSuccessSaveDraft = this.handleSuccessSaveDraft.bind (this);
    this.renderPageFreezeLoader = this.renderPageFreezeLoader.bind (this);
    this.onClone= this.onClone.bind(this);
    this.state={copyElements:''};
  }

  /**
     * Cancel content creating or editing handler
     */
  handleConfirmCancelPopup () {
    const {router} = this.props;
    router.push (appRoutes.MANAGE_CONTENT);
  }

  /**
     * Save draft content handler
     */
  handleSaveDraft () {
    const {store} = this.props;
    const savingDraftPromise = store.id
      ? store.updateOneTierDraft ()
      : store.createOneTierDraft ();
    savingDraftPromise.then (this.handleSuccessSaveDraft);
  }

  clone () {
    const clone = React.cloneElement(<ContentVariances />)
  }

  /**
     * Handle a tab selection
     */
  handlePublish () {
    this.setState({ loader: true })
    const {store} = this.props;
    const publishingPromise = store.id
      ? store.updateOneTierPublished ()
      : store.createOneTierPublished ();
    publishingPromise.then (this.handleSuccessPublishing);
  }

  /**
     * Success save draft handler
     */
  handleSuccessSaveDraft () {
    const {router, store, appStore} = this.props;
    router.push (
      appRoutes.EDIT_ONE_TIER_CONTENT.replace (':contentId', store.id)
    );
    scrollUp ();
    appStore.setDisableNotificationReset (true);
    sendUpdateNotification (appStore);
    this.setState({ loader: true })
  }

  /**
     * Success publishing handler
     */
  handleSuccessPublishing () {
    const {router, appStore} = this.props;
    router.push (appRoutes.MANAGE_CONTENT);
    appStore.setDisableNotificationReset (true);
    sendUpdateNotification (appStore);
  }

   onClone() {
   this.setState({copyElements:React.cloneElement (<contentVariances/>)});

   }

  
  onAdd () {
    const {
      publishOn: {plans: {plansList}},
    } = this.props;
    let count = 0;
    for (let i = 0; i < this.pageOrderData.length; i++) {
      count += this.pageOrderData[i].platforms.length;
    }
    if (count === publishingPlatformsList.length) {
      const {appStore} = this.props;
      appStore.setDisableNotificationReset (true);
      appStore.setNotification (
        Notification.Notifications.validation,
        constants.CANNOT_ADD_MORE
      );
      return;
    }

    const copy = cloneDeep (this.pageOrderData[0]);
    copy.plans = [EMPTY_PLATFORM_PAGE_ORDER_INDEX];
    this.pageOrderData.push (copy);
    const publishingPlatformsOrder = this.convertPageOrderToPublishingPlatforms ();
    this.props.store.setPublishingPlatformsOrder (publishingPlatformsOrder);
  }


  /**
     * Show freeze screen loader
     */
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
     * @see Component#render()
     */
  render () {
    const {router, store, scrollToExpandedVariance} = this.props;
    const {
      textualData: {
        primaryInfo,
        seoDetails,
        contentGenres,
        contentVariances,
        contentVersions,
        clonedComponent,
        cast,
        music,
        tags,
        aboutTheContent,
      },
      nonTextualData,
    } = store;

    const {
      primaryInfo: {fields: primaryInfoFields},
      seoDetails: {fields: seoDetailsFields},
      contentGenres: {fields: contentGenresFields},
      contentFields: {fields: contentFields},
      aboutTheContent: {fields: aboutTheContentFields},
    } = OneTierContentFields;



    return (
      <div>
        {this.renderPageFreezeLoader ()}
        <Provider PrimaryInfoOTCStore={primaryInfo}>
          <Content
            router={router}
            breadCrumbs={this.breadCrumbs}
            name="oneTierForm"
            onCancel={this.handleConfirmCancelPopup}
            onPublish={this.handlePublish}
            onSaveDraft={this.handleSaveDraft}
            isPublished={store.status == constants.CONTENT.STATUSES.PUBLISHED}
            validationsFormPerType={OneTierContent.validationsFormPerType}
          >
           {this.state.loader &&
           <span className="bo-essel-loader-bounce bo-essel-loader-center">
             <Loader className="bo-essel-loader-center"/>
            </span>
            }
            <CollapsiblePanel name="Primary Info">
              <PrimaryInfo store={primaryInfo} fields={primaryInfoFields} />
            </CollapsiblePanel>

            <CollapsiblePanel name="Content Genres">
              <ContentGenres
                store={contentGenres}
                fields={contentGenresFields}
              />
            </CollapsiblePanel>
            <CollapsiblePanel name="Non-Textual Data">
              <NonTextualData store={nonTextualData} fields={contentFields} />
            </CollapsiblePanel>
            {/* <CollapsiblePanel name="Video Details">
              <ContentVersions              
                store={contentVariances}
              />
            </CollapsiblePanel> */}
            <CollapsiblePanel name="Content Versions">
              <ContentVariances
                store={contentVariances}
                plansStore={store}
                scrollToExpandedVariance={scrollToExpandedVariance}
              />
            </CollapsiblePanel>            
            <CollapsiblePanel name="About the Content">
              <AboutTheContent
                store={aboutTheContent}
                fields={aboutTheContentFields}
              />
            </CollapsiblePanel>
            <CollapsiblePanel name="Content SEO Details">
              <SeoDetails store={seoDetails} fields={seoDetailsFields} />
            </CollapsiblePanel>
            <CollapsiblePanel name="Cast">
              <Cast store={cast} isValidationFormPerType={true} />
            </CollapsiblePanel>
            <CollapsiblePanel name="Music">
              <Music store={music} />
            </CollapsiblePanel>
            <CollapsiblePanel name="Tags">
              <Tags store={tags} />
            </CollapsiblePanel>
          </Content>
        </Provider>
      </div>
    );
  }
}

export default OneTierContent;
