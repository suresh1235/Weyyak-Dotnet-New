import React, { Component } from 'react';
import { Provider, inject, observer } from 'mobx-react';
import constants from 'constants/constants';
import Content from 'components/core/Content';
import { sendUpdateNotification } from 'components/core/Utils';
import appRoutes from 'components/app.routes.config';
import CollapsiblePanel from 'components/core/CollapsiblePanel';
import Confirm from 'components/core/Confirm';

import { SiteManagement } from "constants/contentFields";
import SliderDetails from 'components/sitemanagement/sliderconstructor/SliderDetails';
import PublishOn from 'components/sitemanagement/shared/PublishOn';
import Scheduling from 'components/sitemanagement/shared/Scheduling';
import AssignPlaylists from 'components/sitemanagement/sliderconstructor/AssignPlaylists';
import SearchableSelectGroup from 'components/core/SearchableSelectGroup';

/**
 * The class defines a slider constructor of site
 */
@inject('appStore')
@observer
class SliderConstructor extends Component {

    /**
     * Construct manage content component
     * @param {Array} props - components properties
     */
    constructor(props) {
        super(props);

        this.breadCrumbs = [
            { name: constants.SITE_MANAGEMENT, path: appRoutes.SLIDERS_MANAGEMENT },
            { name: constants.SLIDERS_MANAGEMENT, path: appRoutes.SLIDERS_MANAGEMENT },
            { name: constants.CREATE_SLIDER }
        ];

        this.handlePublish = this.handlePublish.bind(this);
        this.handleConfirmCancelPopup = this.handleConfirmCancelPopup.bind(this);
        this.handleSuccessPublishing = this.handleSuccessPublishing.bind(this);

        this.state = {
            platformsMismatchConfirmPopup: {
                show: false
            }
        }
    }

    /**
    * @see Component#componentWillUnmount()
    */
    componentWillUnmount() {
        const { route: { store } } = this.props;
        store.clearStore();
    }

    /**
     * Cancel content creating or editing handler
     */
    handleConfirmCancelPopup() {
        const { router } = this.props;
        router.push(appRoutes.SLIDERS_MANAGEMENT);
    }

    /**
     * Handle a tab selection
     */
    handlePublish() {
        const { route: { store } } = this.props;
        const { sliderPagesPlatformsMismatches } = store;

        if (sliderPagesPlatformsMismatches.filter((page) => !page.isHome).length) {
            this.showPlatformsMismatchConfirmPopup(true);
        }
        else {
            this.publish();
        }
    }
    
    /**
     * Success publishing handler
     */
    handleSuccessPublishing() {
        const { router, appStore } = this.props;
        router.push(appRoutes.SLIDERS_MANAGEMENT);
        appStore.setDisableNotificationReset(true);
        sendUpdateNotification(appStore);
    }

    publish() {
        const { route: { store } } = this.props;
        const publishingPromise = store.id ? store.updateSlider() : store.createSlider();
        return publishingPromise.then(this.handleSuccessPublishing);
    }

    showPlatformsMismatchConfirmPopup(visible) {
        this.setState({
            platformsMismatchConfirmPopup: {
                show: visible
            }
        });
    }
   
    /**
     * Render cancel confirmation popup
     * @returns {ReactNode} popup node
     */
    renderPlatformsMismatchConfirmationView() {
        const { route: { store: { sliderPagesPlatformsMismatches: mismatches } } } = this.props;
        const { show } = this.state.platformsMismatchConfirmPopup;

        let html = '';

        if (show) {
            var notHomePagesMismatches = mismatches.filter((page) => !page.isHome);
            if (notHomePagesMismatches.length) {
                html = `The slider will be ignored for the next pages due to platforms mismatch: ${
                    notHomePagesMismatches.map(page => `${page.englishTitle} (${page.availableOn || 'no platforms'})`).join(', ')
                }.`;
            }
        }

        return (
            <Confirm
                key="confirm"
                onConfirm={this.publish.bind(this)}
                onClose={this.showPlatformsMismatchConfirmPopup.bind(this, false)}
                body={html}
                visible={show}
                cancelText={constants.POPUPS.SHARED.CANCEL}
                confirmText={constants.POPUPS.SHARED.CONFIRM}
                title="Slider and pages platforms mismatch."
            />
        );
    }
    
    /**
     * @see Component#render()
     */
    render() {
        const { router, store, editMode } = this.props;

        const {
            sliderDetails: sliderDetailsFields,
            publishOn: publishOnFields,
            scheduling: { fields: schedulingFields },
            assignPlaylists: assignPlaylistsFields,
            pages: pagesFields,
        } = SiteManagement.sliderCreator;

        const { sliderDetails, publishOn, scheduling, assignPlaylists, pages: pagesStore, sliderPagesPlatformsMismatches } = store;

        const { pages } = pagesStore;

        const saveButtonText = editMode ? 'Update Slider' : 'Create Slider';

        return (
            <Provider sliderDetailsStore={sliderDetails}>
                <Content
                    router={router}
                    breadCrumbs={this.breadCrumbs}
                    name='sliderConstructor'
                    onCancel={this.handleConfirmCancelPopup}
                    onPublish={this.handlePublish}
                    saveButtonText={saveButtonText}>

                    <CollapsiblePanel name="Slider Details">
                        <SliderDetails
                            fields={sliderDetailsFields}
                            store={sliderDetails}
                            editMode={editMode}/>
                    </CollapsiblePanel>
                    <CollapsiblePanel name="Assign Playlists">
                        <AssignPlaylists
                            store={assignPlaylists}
                            fields={assignPlaylistsFields} />
                        <SearchableSelectGroup
                            {...pagesFields}
                            value={pages}
                            onChange={pagesStore.setPages.bind(pagesStore)}
                            fetchOptions={pagesStore.fetchPages.bind(pagesStore)}
                        />
                    </CollapsiblePanel>
                    <CollapsiblePanel name="Scheduled for:">
                        <Scheduling
                            fields={schedulingFields}
                            store={scheduling} />
                    </CollapsiblePanel>
                    <CollapsiblePanel name="Publish on:">                       
                        <PublishOn
                            publishOnFields={publishOnFields}
                            store={publishOn}
                        />
                    </CollapsiblePanel>
                    {this.renderPlatformsMismatchConfirmationView()}
                </Content>
            </Provider>
        );
    }
}

export default SliderConstructor;
