import {Row, Col} from 'react-bootstrap';
import React, {Component, PropTypes} from 'react';
import {inject, observer} from 'mobx-react';
import appRoutes from 'components/app.routes.config';
import Content from 'components/core/Content';
import CollapsiblePanel from 'components/core/CollapsiblePanel';
import {
  isSaveDraft,
  removeDataSaveDraftAttr,
  addDataSaveDraftAttr,
  sendUpdateNotification,
} from 'components/core/Utils';
import MultiTierContentEpisodeStore
  from 'stores/content/MultiTierContentEpisodeStore';
import constants from 'constants/constants';
import FieldWrapper from 'components/core/FieldWrapper';
import NonTextualData from 'components/content/NonTextualData';
import Cast from 'components/content/Cast';
import Music from 'components/content/Music';
import Tags from 'components/content/Tags';
import Notification from 'components/core/Notification';
import {
  getMultiTierEpisodeGridLayout,
  MultiTierContentFields,
} from 'constants/contentFields';
import PrimaryInfo from 'components/content/PrimaryInfo';
import RightsSection from 'components/content/RightsSection';
import Scheduling from 'components/content/Scheduling';
import PublishingPlatforms from 'components/shared/PublishingPlatforms';
import {buildFullName, getTranslation} from 'components/core/Utils';
import Confirm from 'components/core/Confirm';
import SeoDetails from 'components/content/SeoDetails';

import ContentGridMultiTier from 'components/content/ContentGridMultiTier';

/**
 * The class represents multi tier content episode component
 */
@inject ('appStore')
@observer
class MultiTierContentEpisode extends Component {
  /** The component properties */
  static propTypes = {
    route: PropTypes.shape ({
      store: PropTypes.instanceOf (MultiTierContentEpisodeStore),
    }).isRequired,
    router: PropTypes.shape ().isRequired,
  };

  /**
     * Construct a multi tier content episode component
     * @param {Array} props component's arguments
     */
  constructor (props) {
    super (props);

    const {appStore, route: {store}} = this.props;

    this.customErrorMessage = constants.EPISODES_ARE_EMPTY;

    this.state = {
      confirmPopup: {
        show: false,
        html: '',
        handler: null,
      },
    };

    this.currentLocation = {};

    this.breadCrumbs = [
      {name: constants.CONTENT_MANAGEMENT, path: appRoutes.MANAGE_CONTENT},
      {name: constants.MANAGE_CONTENT, path: appRoutes.MANAGE_CONTENT},
      {name: constants.CREATE_N_SCHEDULE_CONTENT},
      {name: constants.MULTI_TIER_CONTENT_EPISODE},
    ];
    this.handleCancel = this.handleCancel.bind (this);
    this.handlePublish = this.handlePublish.bind (this);
    this.handleSaveDraft = this.handleSaveDraft.bind (this);
    this.handleTitleChanged = this.handleTitleChanged.bind (this);
    this.handleSeasonChanged = this.handleSeasonChanged.bind (this);
    this.getTitleOptions = this.getTitleOptions.bind (this);
    this.getSeasonOptions = this.getSeasonOptions.bind (this);
    this.sendUpdateNotification = sendUpdateNotification.bind (null, appStore);
    this.setNotification = this.setNotification.bind (this);
    this.handleSuccessPublishing = this.handleSuccessPublishing.bind (this);
    this.handleSchedulingChanged = this.handleSchedulingChanged.bind (this);
    this.handleTogglePlatforms = this.handleTogglePlatforms.bind (this);
    this.handleSelectPlatform = this.handleSelectPlatform.bind (this);
    this.handleLeave = this.handleLeave.bind (this);
    this.handleCloseConfirmPopup = this.handleCloseConfirmPopup.bind (this);
    this.handleConfirmPopup = this.handleConfirmPopup.bind (this);
    this.updateEpisodeData = store.updateEpisodeData.bind (store);
  }

  /**
     * @see Component#componentDidUpdate()
     */
  componentDidUpdate () {
    const {appStore, router, route: {store}} = this.props;
    router.setRouteLeaveHook (this.props.route, nextLocation =>
      this.isRedirectAvailable (nextLocation)
    );
  }

  /**
     * Checks is redirect without confirmation possible
     * @param {Object} nextLocation - next location
     * @returns {bool} is redirect possible
     */
  isRedirectAvailable (nextLocation) {
    if (
      nextLocation.pathname == this.currentLocation.pathname ||
      nextLocation.pathname.indexOf ('season/') !== -1 ||
      nextLocation.pathname === '/multi-tier-content-episode' ||
      nextLocation.pathname === '/manage-content'
    ) {
      return true;
    } else {
      this.handleLocationChange (nextLocation);
      return false;
    }
  }

  /**
     * Handles location change
     * @param {Object} nextLocation - next location
     */
  handleLocationChange (nextLocation) {
    const {router, route: {store}} = this.props;
    if (store.isDataChanged ()) {
      this.handleLeave (nextLocation ? nextLocation : {});
    } else {
      this.currentLocation = nextLocation ? nextLocation : {};
      nextLocation && router.push (nextLocation);
      return true;
    }
  }

  /**
     * @see Component#componentWillMount()
     */
  componentWillMount () {
    const {route: {store}} = this.props;
    store.fetchTitles ();
    store.fetchPlans ();
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
     * Set notification
     */
  setNotification (data) {
    const {appStore, route: {store}, editMode} = this.props;
    store.fetchEpisode (data.id, editMode);
    appStore.setNotificationAfterRedirect (
      Notification.Notifications.info,
      constants.EPISODE_NOTIFICATION_MESSAGE
    );
  }

  /**
     * Handle publish
     */
  handlePublish () {
    const {route: {store}} = this.props;
    const resultPromise = store.status
      ? store.updateContentPublished ()
      : store.createContentPublished ();
    resultPromise.then (this.handleSuccessPublishing);
  }

  /**
     * Redirects to Manage content
     */
  handleSuccessPublishing () {
    const {router, appStore} = this.props;
    router.push (appRoutes.MANAGE_CONTENT);
    appStore.setNotificationAfterRedirect (
      Notification.Notifications.info,
      constants.EPISODE_NOTIFICATION_MESSAGE
    );
  }

  /**
     * Handle save draft
     */
  handleSaveDraft () {
    const {route: {store}} = this.props;
    const resultPromise = store.status
      ? store.updateContentDraft ()
      : store.createContentDraft ();
    resultPromise.then (res => this.setNotification (res.data));
  }

  /**
     * Title changed handler
     * @param {Object} titleOption - title dropdown option
     */
  handleTitleChanged (titleOption) {
    this.titleOptionValue = titleOption && titleOption.value
      ? titleOption.value
      : null;
    this.seasonOptionValue = 0;
    if (this.handleLocationChange ()) {
      this.setTitleOptionValue (this.titleOptionValue);
    }
  }

  /**
     * Change title
     * @param {Object} titleOption - title dropdown option
     */
  setTitleOptionValue (titleOptionValue) {
    const {router, route: {store}} = this.props;
    if (titleOptionValue) {
      store.fetchTitle (titleOptionValue);
    } else {
      store.clearData ();
    }
    router.push (appRoutes.MULTI_TIER_CONTENT_EPISODE);
  }

  /**
     * Season changed handler
     * @param {Object} seasonOption - title dropdown option
     */
  handleSeasonChanged (seasonOption) {
    this.seasonOptionValue = seasonOption && seasonOption.value
      ? seasonOption.value
      : null;
    if (this.handleLocationChange ()) {
      this.setSeasonOptionValue (this.seasonOptionValue);
    }
  }

  /**
     * Change season
     * @param {Object} seasonOption - title dropdown option
     */
  setSeasonOptionValue (seasonOptionValue) {
    const {router, route: {store}} = this.props;
    if (seasonOptionValue) {
      router.push (
        appRoutes.ADD_EPISODE
          .replace (':contentId', store.contentId)
          .replace (':seasonId', seasonOptionValue)
      );
    } else {
      store.clearSeasonData ();
      store.fetchTitle (store.contentId);
      router.push (appRoutes.MULTI_TIER_CONTENT_EPISODE);
    }
  }

  /**
     *
     * Scheduling changed handler
     * @param {Moment} dateTime - scheduling date time
     */
  handleSchedulingChanged (dateTime) {
    const {route: {store}} = this.props;
    store.setsSchedulingDateTime (dateTime);
  }

  /**
     * Toggle platforms handler
     */
  handleTogglePlatforms () {
    const {route: {store: {platforms}}} = this.props;
    platforms.togglePlatforms ();
  }

  /**
     * Select platform handler
     * @param {Number} platformId - platform id
     * @param {Boolean} isChecked - whether platform is checked
     */
  handleSelectPlatform (platformId, isChecked) {
    const {route: {store: {platforms}}} = this.props;
    platforms.togglePlatform (platformId, isChecked);
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
     * Get season dropdown options
     * @returns {Array}
     */
  getSeasonOptions () {
    const {route: {store}} = this.props;

    return store.seasons
      ? store.seasons.map (season => ({
          label: `${season.primaryInfo.seasonNumber}_` +
            `${season.primaryInfo.transliteratedTitle}` +
            `${season.translation.languageType != 'Original' ? `_${season.translation.languageType
                  .charAt (0)
                  .toUpperCase ()}` : ''}` +
            `${season.translation.subtitlingLanguage ? season.translation.subtitlingLanguage
                  .charAt (0)
                  .toUpperCase () : ''}` +
            `${season.translation.dubbingLanguage ? season.translation.dubbingLanguage
                  .charAt (0)
                  .toUpperCase () : ''}`,
          value: season.id,
        }))
      : [];
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
      this.seasonOptionValue !== 0
        ? this.setSeasonOptionValue (this.seasonOptionValue)
        : this.setTitleOptionValue (this.titleOptionValue);
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

    title = constants.LEAVE_CONFIRMATION.TITLE;
    html = constants.LEAVE_CONFIRMATION.TEXT;

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
     * @see Component#render()
     */
  render () {
    const {
      route: {
        store,
        store: {
          currentSeason,
          contentGridMultiTierStore,
          primaryInfo,
          nonTextualData,
          cast,
          music,
          tags,
          rights,
          rights: {data: {digitalRightsStartDate, digitalRightsEndDate}},
          schedulingDateTime,
          platforms,
          seoDetails,
          platforms: {data: {publishingPlatforms}},
        },
      },
      router,
    } = this.props;
    const {
      episode: {
        primaryInfo: {fields: primaryInfoFields},
        nonTextualData: {fields: nonTextualDataFields},
        title: titleField,
        season: seasonField,
        seoDetails: {fields: seoDetailsFields},
        rightsSection: {fields: rightsSectionFields},
        scheduling: schedulingField,
        platforms: platformsField,
      },
    } = MultiTierContentFields;
   

    return (
      <Content
        router={router}
        breadCrumbs={this.breadCrumbs}
        name="multiTierForm"
        onCancel={this.handleCancel}
        onPublish={this.handlePublish}
        onSaveDraft={this.handleSaveDraft}
        isPublished={store.status == constants.CONTENT.STATUSES.PUBLISHED}
      >
        <div className="select-title-block">
          <div className="text-center table-title">
            {currentSeason &&
              `${currentSeason.primaryInfo.transliteratedTitle}_${currentSeason.primaryInfo.seasonNumber}${getTranslation (currentSeason.translation)}`}
          </div>
          <Row>
            <Col>
              <ContentGridMultiTier
                store={contentGridMultiTierStore}
                contentId={store.seasonId}
                contentLevel="EPISODES"
                contentType="episode"
                data={store.data}
                customErrorMessage={this.customErrorMessage}
                buildFullName={buildFullName}
                getMultiTierGridLayout={getMultiTierEpisodeGridLayout}
                parentLevel={currentSeason}
                handleDataAfterDelete={this.updateEpisodeData}
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
                value={store.contentId}
                getOptions={this.getTitleOptions}
              />
            </Col>
          </Row>
        </div>
        <div className="select-title-block">
          <Row>
            <Col md={6}>
              <FieldWrapper
                fieldConfig={seasonField}
                handleChange={this.handleSeasonChanged}
                value={store.seasonId}
                getOptions={this.getSeasonOptions}
              />
            </Col>
          </Row>
        </div>
        <CollapsiblePanel name="Primary Info">
          <PrimaryInfo store={primaryInfo} fields={primaryInfoFields} />
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
        <CollapsiblePanel name="Non-Textual Data">
          <NonTextualData
            store={nonTextualData}
            fields={nonTextualDataFields}
          />
        </CollapsiblePanel>
        <CollapsiblePanel name="Rights section">
          <RightsSection
            fields={rightsSectionFields}
            values={rights.data}
            store={rights}
            plansStore={store}
          />
          <Scheduling
            field={schedulingField}
            value={schedulingDateTime}
            dateRange={{
              startDate: digitalRightsStartDate,
              endDate: digitalRightsEndDate,
            }}
            onChange={this.handleSchedulingChanged}
          />
          <PublishingPlatforms
            field={platformsField}
            markAll={platforms.markAllPlatforms}
            value={publishingPlatforms}
            store={platforms}
            onAllToggle={this.handleTogglePlatforms}
            onSelect={this.handleSelectPlatform}
          />
        </CollapsiblePanel>
        {this.renderConfirmationView ()}
      </Content>
    );
  }
}

export default MultiTierContentEpisode;
