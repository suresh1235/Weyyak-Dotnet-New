import React, { Component } from 'react';
import { inject } from 'mobx-react';
import constants from 'constants/constants';
import { Grid, Row, Col } from 'react-bootstrap';
import PageTable from 'components/core/PageTable';
import BreadCrumbs from 'components/core/BreadCrumbs';
import Action from 'components/core/Action';
import ActionLink from 'components/core/ActionLink';
import Confirm from 'components/core/Confirm';
import appRoutes from 'components/app.routes.config';
import moment from 'moment';
import { formatString } from 'components/core/Utils';
import InvalidationNotifications from 'components/shared/InvalidationNotifications';

/**
 * The class defines a playlists management of site
 */
@inject('appStore')
class PlaylistsManagement extends Component {
    constructor(props) {
        super(props);

        const {route: {store}} = props;

        this.fetchData = store.fetchPlaylists.bind(store);
        this.getData = store.getData.bind(store);       
        this.renderEditItemAction = this.renderEditItemAction.bind(this);
        this.renderDeleteItemAction = this.renderDeleteItemAction.bind(this);
        this.handleCloseConfirmPopup = this.handleCloseConfirmPopup.bind(this);
        this.handleConfirmPopup = this.handleConfirmPopup.bind(this);

        this.breadCrumbs = [
            { name: constants.SITE_MANAGEMENT, path: appRoutes.PLAYLISTS_MANAGEMENT },
            { name: constants.PLAYLISTS_MANAGEMENT }
        ];

        this.state = {
            confirmPopup: {
                show: false,
                html: '',
                handler: null
            }
        };

        this.layout = {
            columns: [
                {
                    key: 'englishTitle',
                    name: 'Playlist Name',
                    className: 'text-center'
                },
                {
                    key: 'availableOn',
                    name: 'Available On',
                    className: 'text-center'
                },
                {
                    key: 'foundIn',
                    name: 'Found In',
                    className: 'text-center'
                },
                {
                    key: 'schedulingEndDate',
                    name: 'Valid till',
                    className: 'text-center',
                    format: value => !!value ? moment(value).format('DD/MM/YYYY') : ''
                },
                {
                    name: 'Actions',
                    key: 'actions',
                    actions: item => {
                        return [
                            this.renderShowHideItemAction(item),
                            this.renderEditItemAction(item),
                            this.renderDeleteItemAction(item)
                        ];
                    }
                }
            ]
        };

        this.filters = [
            {
                name: 'searchText',
                type: 'search',
                defaultValue: '',
                placeholder: 'Search'
            }
        ];
    }

    /**
     *  Confirm popup handler
     */
    handleConfirmPopup() {
        const { handler } = this.state.confirmPopup;
        handler && handler();
    }

    /**
     * Close confirm popup handler
     */
    handleCloseConfirmPopup() {
        this.setState({
            confirmPopup: {
                show: false,
                html: '',
                handler: null
            }
        })
    }

    /**
     * Delete item
     * @param {Object} item - item
     */
    handleDelete(item) {
        let html, title, cancelText, confirmText, handler;

        title = formatString(constants.POPUPS.DELETE.TITLE, item.englishTitle);

        if (!!item.theOnlyPlaylistFor) {
            handler = this.handleCloseConfirmPopup.bind(this);
            cancelText = '';
            confirmText = constants.POPUPS.SHARED.OK;
            html = formatString(
                    constants.POPUPS.DELETE.REJECT_BODY,
                    item.englishTitle, 
                    `Playlist is the only one for the next pages: ${ item.theOnlyPlaylistFor }.`);
        }
        else {
            handler = this.deleteItem.bind(this, item);
            cancelText = constants.POPUPS.SHARED.CANCEL;
            confirmText = constants.POPUPS.SHARED.CONFIRM;
            html = formatString(constants.POPUPS.DELETE.ALLOW_BODY, item.englishTitle);

            if (!!item.foundIn) {
                let pagesWarning = `The playlist is attached to the following pages: ${item.foundIn}.`;
                html = `${html} ${pagesWarning}`;
            }
        }

        this.setState({
            confirmPopup: {
                show: true,
                html,
                handler,
                cancelText,
                confirmText,
                title
            }
        });
    }

    /**
     * Delete item
     * @param {Object} item - item
     */
    deleteItem(item) {
        const { route: {store} } = this.props;
        let deletePromise = store.deletePlaylist(item.id);
        deletePromise.then(this.handleCloseConfirmPopup.bind(this));
    }

    handleAvailability(item, available) {
        let html = formatString(available
            ? constants.POPUPS.AVAILABILITY.SHOW_BODY
            : constants.POPUPS.AVAILABILITY.HIDE_BODY, item.englishTitle),
            title = formatString(constants.POPUPS.AVAILABILITY.TITLE, item.englishTitle),
            cancelText = constants.POPUPS.SHARED.CANCEL,
            confirmText = constants.POPUPS.SHARED.CONFIRM,
            handler = this.changeAvailability.bind(this, item, available);

        this.setState({
            confirmPopup: {
                show: true,
                html,
                handler,
                cancelText,
                confirmText,
                title
            }
        });
    }

    changeAvailability(item, available) {
        const { route: { store } } = this.props;
        let changePromise = store.changePlaylistAvailability(item.id, available);
        changePromise.then(this.handleCloseConfirmPopup.bind(this), this.handleCloseConfirmPopup.bind(this));
    }
    
    /**
     * Render edit action for item
     * @param {Object} item - item
     */
    renderEditItemAction(item) {
        return (
            <ActionLink key="edit"
                        to={appRoutes.EDIT_PLAYLIST.replace(':playlistId', item.id)}
                        title={`Edit ${item.englishTitle}`}
                        icon="edit"/>
        );
    }

    /**
     * Render edit action for item
     * @param {Object} item - content item
     */
    renderDeleteItemAction(item) {
        // if (item.isAssignedToAnyHomePage) return null;

        return (
            <Action key="remove"
                    icon="remove"
                    title={`Delete ${item.englishTitle}`}
                    onClick={this.handleDelete.bind(this, item)}/>
        );
    }

    renderShowHideItemAction(item) {
        if (item.isDisabled) {
            return (
                <Action key="show"
                    icon="eye-slash"
                    title={`Show ${item.englishTitle}`}
                    onClick={this.handleAvailability.bind(this, item, true)} />
            );
        }
        else if (!item.isAssignedToAnyHomePage || item.isAssignedToAnyHomePage) {
            return (
                <Action key="hide"
                    icon="eye"
                    title={`Hide ${item.englishTitle}`}
                    onClick={this.handleAvailability.bind(this, item, false)} />
            );
        }
    }

    /**
     * Render cancel confirmation popup
     * @returns {ReactNode} popup node
     */
    renderConfirmationView() {
        const { html, show, cancelText, confirmText, title } = this.state.confirmPopup;
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
    render() {
        const { router } = this.props;
        const { route: { store: { invalidationNotificationStore } } } = this.props;

        return (
            <Grid>
                <Row className="bread-crumbs">
                    <Col className="col" xs={12} md={8}>
                        <BreadCrumbs router={router} crumbs={this.breadCrumbs} />
                    </Col>
                </Row>
                <Row>
                    <Col className="col" xs={12} md={12}>
                        <InvalidationNotifications
                            store={invalidationNotificationStore}>
                        </InvalidationNotifications>
                    </Col>
                </Row>
                <Row>
                    <Col className="col" xs={12} md={8}>
                        <ActionLink 
                            key="add"
                            className="action-manage"
                            to={appRoutes.CREATE_PLAYLIST}
                            text={'Add New Playlist'}
                            title={'Add New Playlist'}
                            icon="plus"/>
                    </Col>
                </Row>
                <Row className="main-content">
                    <PageTable
                        layout={this.layout}
                        filters={this.filters}
                        fetchData={this.fetchData}
                        getData={this.getData}>
                    </PageTable>
                </Row>
                {this.renderConfirmationView()}
            </Grid>
        );
    }
}

export default PlaylistsManagement;
