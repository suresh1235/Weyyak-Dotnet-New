import React, { Component } from 'react';
import { Provider, inject, observer } from 'mobx-react';
import constants from 'constants/constants';
import Content from 'components/core/Content';
import { sendUpdateNotification } from 'components/core/Utils';
import appRoutes from 'components/app.routes.config';
import CollapsiblePanel from 'components/core/CollapsiblePanel';
import PublishOn from 'components/sitemanagement/shared/PublishOn';
import Loader from 'components/core/Loader';

import Details from 'components/sitemanagement/shared/Details';
import PlaylistCriteria from 'components/sitemanagement/playlistconstructor/PlaylistCriteria';
import Scheduling from 'components/sitemanagement/shared/Scheduling';
import { SiteManagement } from 'constants/contentFields';
import SearchableSelectGroup from 'components/core/SearchableSelectGroup';

/**
 * The class defines a playlist constructor of site
 */
@inject('appStore')
@observer
class PlaylistConstructor extends Component {

    /**
     * Construct manage content component
     * @param {Array} props - components properties
     */
    constructor(props) {
        super(props);

        this.state = { showLoader: false };

        this.breadCrumbs = [
            { name: constants.SITE_MANAGEMENT, path: appRoutes.PLAYLISTS_MANAGEMENT },
            { name: constants.PLAYLISTS_MANAGEMENT, path: appRoutes.PLAYLISTS_MANAGEMENT },
            { name: constants.CREATE_PLAYLIST }
        ];

        this.handlePublish = this.handlePublish.bind(this);
        this.handleConfirmCancelPopup = this.handleConfirmCancelPopup.bind(this);
        this.handleSuccessPublishing = this.handleSuccessPublishing.bind(this);
        this.renderPageFreezeLoader = this.renderPageFreezeLoader.bind(this);
    }

    /**
     * Cancel content creating or editing handler
     */
    handleConfirmCancelPopup() {
        const { router, appStore } = this.props;
        router.push(appRoutes.PLAYLISTS_MANAGEMENT);
    }

    /**
     * Handle a tab selection
     */
    handlePublish() {
        const { route: { store } } = this.props;
        const publishingPromise = store.id ? store.updatePlaylist() : store.createPlaylist();
        this.setState({ showLoader: true });
        publishingPromise
            .then(this.handleSuccessPublishing)
            .finally(() => this.setState({ showLoader: false }));
    }

    /**
     * Success publishing handler
     */
    handleSuccessPublishing() {
        const { router, appStore } = this.props;
        router.push(appRoutes.PLAYLISTS_MANAGEMENT);
        appStore.setDisableNotificationReset(true);
        sendUpdateNotification(appStore);
    }

    /**
     * @see Component#componentWillUnmount()
     */
    componentWillUnmount() {
        const { route: { store } } = this.props;
        store.clearStore();
    }

    /**
    * Show freeze screen loader
    */
    renderPageFreezeLoader() {
        const { showLoader } = this.state;
        if (showLoader) {
            return (
                <div className="freeze-spinner">
                    <span className="select-loader">
                        <Loader className="bo-essel-loader" />
                    </span>
                </div>
            )
        }
    }

    /**
     * @see Component#render()
     */
    render() {
        const { router, route: { store }, editMode } = this.props;
        const {
            playlistDetails,
            playlistCriteria,
            scheduling,
            publishOn,
            playlisttype,
            pages: pagesStore
        } = store;
       console.log(playlistCriteria)
        const { pages } = pagesStore;
        const {
            playlistDetails: { fields: playlistDetailsFields },
            scheduling: { fields: schedulingFields },
            pages: { fields: pagesFields },
            publishOn: publishOnFields,
        } = SiteManagement.playlistCreator;
        
        const saveButtonText = editMode ? 'Update Playlist' : 'Create Playlist';

        return (
            <div>
                {this.renderPageFreezeLoader()}
                <Provider>
                    <Content
                        router={router}
                        breadCrumbs={this.breadCrumbs}
                        name="playlistConstructor"
                        onCancel={this.handleConfirmCancelPopup}
                        onPublish={this.handlePublish}
                        saveButtonText={saveButtonText}>
                        <CollapsiblePanel name="Playlist Details">
                            <Details
                                store={playlistDetails}
                                fields={playlistDetailsFields} />
                        </CollapsiblePanel>
                        <CollapsiblePanel name="Playlist Criteria">
                            <PlaylistCriteria
                                store={playlistCriteria} 
                                value={playlisttype} />
                        </CollapsiblePanel>
                        <CollapsiblePanel name="Attach to">
                            <SearchableSelectGroup
                                {...pagesFields}
                                value={pages}
                                onChange={pagesStore.setPages.bind(pagesStore)}
                                fetchOptions={pagesStore.fetchPages.bind(pagesStore)}
                            />
                        </CollapsiblePanel>
                        <CollapsiblePanel name="Scheduling">
                            <Scheduling
                                fields={schedulingFields}
                                store={scheduling}
                                optional />
                        </CollapsiblePanel>
                        <CollapsiblePanel name="Publish on:">
                            <PublishOn publishOnFields={publishOnFields} store={publishOn} />
                        </CollapsiblePanel>
                    </Content>
                </Provider>
            </div>
        );
    }
}

export default PlaylistConstructor;
