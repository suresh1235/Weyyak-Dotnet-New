import React, {Component} from 'react';
import {Provider, inject, observer} from 'mobx-react';
import constants from 'constants/constants';
import Details from 'components/sitemanagement/shared/Details';
import Content from 'components/core/Content';
import CollapsiblePanel from 'components/core/CollapsiblePanel';
import appRoutes from 'components/app.routes.config';
import SearchableSelectGroup from 'components/core/SearchableSelectGroup';
import Confirm from 'components/core/Confirm';

import {SiteManagement} from 'constants/contentFields';
import {sendUpdateNotification} from 'components/core/Utils';
import PageOrderNumberSelect
  from 'components/sitemanagement/pageconstructor/PageOrderNumberSelect';
import SeoDetails from 'components/sitemanagement/pageconstructor/SeoDetails';
import PublishOn from 'components/sitemanagement/shared/PublishOn';
import {Row, Col} from 'react-bootstrap';
import NonTextualData from 'components/content/NonTextualData';


/**
 * The class defines a page constructor of site
 */
@inject ('appStore')
@observer
class PageConstructor extends Component {
  static PropTypes = {};

  /**
   * Construct one tier management component
   * @param {Object} props - a component's arguments
   */
  constructor (props) {
    super (props);

    this.breadCrumbs = [
      {name: constants.SITE_MANAGEMENT, path: appRoutes.PAGES_MANAGEMENT},
      {name: constants.PAGES_MANAGEMENT, path: appRoutes.PAGES_MANAGEMENT},
      {name: constants.CREATE_PAGE},
    ];

    this.state = {
      confirmPopup: {
        show: false,
        html: '',
        handler: null,
      },
    };

    this.handlePublish = this.handlePublish.bind (this);
    this.handleConfirmCancelPopup = this.handleConfirmCancelPopup.bind (this);
    this.handleSuccessPublishing = this.handleSuccessPublishing.bind (this);
    this.handleCloseConfirmPopup = this.handleCloseConfirmPopup.bind (this);
    this.handleConfirmPopup = this.handleConfirmPopup.bind (this);
    this.handlePageDetailsChanged = this.handlePageDetailsChanged.bind (this);
    this.updateOrderWithinMenu = this.updateOrderWithinMenu.bind (this);

    this.confirmPlatformConflicts = this.confirmPlatformConflicts.bind (this);
    this.publishPage = this.publishPage.bind (this);
  }

  /**
   * @see Component#componentDidMount()
   */
  componentDidMount () {
    const {store} = this.props;
    store.fetchPages ();
  }

  /**
   * @see Component#componentWillUnmount()
   */
  componentWillUnmount () {
    const {route: {store}} = this.props;
    store.clearStore ();
  }

  /**
   * Cancel content creating or editing handler
   */
  handleConfirmCancelPopup () {
    const {router} = this.props;
    router.push (appRoutes.PAGES_MANAGEMENT);
  }

  updateOrderWithinMenu () {
    const {store} = this.props;
    store
      .updateOrderWithinMenu ()
      .then (() => {
        const {appStore} = this.props;
        appStore.setDisableNotificationReset (true);
        sendUpdateNotification (appStore);
        store.fetchPages ();
      })
      .catch (res => {});
  }

  /**
   * Handle a tab selection
   */
  handlePublish () {
    const {store} = this.props;
    const {homePagesPlatformConflicts} = store;
    const {pageDetails: {data: {isHomePage}}} = store;

    if (isHomePage && homePagesPlatformConflicts) {
      this.confirmPlatformConflicts (homePagesPlatformConflicts);
    } else {
      this.publishPage ();
    }
  }

  confirmPlatformConflicts (platformConflicts) {
    this.setState ({
      confirmPopup: {
        show: true,
        html: `By saving this home page all other home pages connected
                        to the next platforms will be overwritten: ${platformConflicts.join (', ')}.`,
        handler: this.publishPage,
        cancelText: 'Cancel',
        confirmText: 'Confirm',
        title: 'Other home pages platform overwritting confirmation',
      },
    });
  }

  publishPage () {
    const {store} = this.props;
    const publishingPromise = store.id
      ? store.updatePage ()
      : store.createPage ();
    publishingPromise.then (this.handleSuccessPublishing);
  }

  /**
   * Success publishing handler
   */
  handleSuccessPublishing () {
    const {router, appStore} = this.props;
    router.push (appRoutes.PAGES_MANAGEMENT);
    appStore.setDisableNotificationReset (true);
    sendUpdateNotification (appStore);
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

  handlePageDetailsChanged () {
    const {route: {store}} = this.props;
    const {pageDetails, seoDetails} = store;
    const {data: {arabicTitle, englishTitle}} = pageDetails;
    seoDetails.syncSeoDetails (arabicTitle, englishTitle);
  }

  /**
   * Render platform conflict confirmation popup
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
    const {router, route: {store}, editMode} = this.props;

    const {pageDetails, seoDetails, publishOn, pageSliders,nonTextualData} = store;

    const {playlists, isHomePage, data: {englishTitle}} = pageDetails;
    const {defaultSlider, sliders} = pageSliders;

    const {
      pageDetails: {fields: pageDetailsFields, playlistsField},
      seoDetails: {fields: seoDetailsFields},
      publishOn: publishOnFields,
      contentFields: {fields: contentFields},
      pageSliders: {defaultSlider: defaultSliderField, sliders: slidersField},
    } = SiteManagement.pageCreator;

    const saveButtonText = editMode ? 'Update Page' : 'Create Page';

    return (
      <Provider>
        <Content
          router={router}
          breadCrumbs={this.breadCrumbs}
          name="pageConstructor"
          onCancel={this.handleConfirmCancelPopup}
          onPublish={this.handlePublish}
          saveButtonText={saveButtonText}
        >
          <CollapsiblePanel name="Page Details">
            <Details
              store={pageDetails}
              fields={pageDetailsFields}
              onChange={this.handlePageDetailsChanged}
            />
            <div className="forms">
              <Row>
                <Col md={12} className="page-order-number-select">
                  <PageOrderNumberSelect
                    englishTitle={englishTitle}
                    store={pageDetails}
                    updateOrderWithinMenu={this.updateOrderWithinMenu}
                    publishOn={publishOn}
                    editMode={editMode}
                  />
                </Col>
                <Col md={12}>
                  <SearchableSelectGroup
                    {...playlistsField}
                    value={playlists}
                    onChange={pageDetails.setPlaylists.bind (pageDetails)}
                    fetchOptions={pageDetails.fetchPlaylists.bind (pageDetails)}
                  />
                </Col>
                {isHomePage &&
                  <Col md={12}>
                    <SearchableSelectGroup
                      {...defaultSliderField}
                      value={defaultSlider}
                      onChange={pageSliders.setDefaultSlider.bind (pageSliders)}
                      fetchOptions={pageSliders.fetchSliders.bind (pageSliders)}
                    />
                  </Col>}
                <Col md={12}>
                  <SearchableSelectGroup
                    {...slidersField}
                    value={sliders}
                    onChange={pageSliders.setSliders.bind (pageSliders)}
                    fetchOptions={pageSliders.fetchSliders.bind (pageSliders)}
                  />
                </Col>
              </Row>
            </div>
          </CollapsiblePanel>
          <CollapsiblePanel name="Non-Textual Data">
              <NonTextualData store={nonTextualData} fields={contentFields} />
          </CollapsiblePanel>
          <CollapsiblePanel name="Page SEO Details">
            <SeoDetails
              store={seoDetails}
              fields={seoDetailsFields}
              editMode={editMode}
            />
          </CollapsiblePanel>
          <CollapsiblePanel name="Publish on:">
            <PublishOn publishOnFields={publishOnFields} store={publishOn} />
          </CollapsiblePanel>
          {this.renderConfirmationView ()}
        </Content>
      </Provider>
    );
  }
}

export default PageConstructor;
