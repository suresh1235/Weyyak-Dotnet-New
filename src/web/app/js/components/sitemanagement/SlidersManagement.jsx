import React, { Component } from 'react';
import { inject } from 'mobx-react';
import moment from 'moment';

import constants from 'constants/constants';
import appRoutes from 'components/app.routes.config';
import { Grid, Row, Col } from 'react-bootstrap';
import PageTable from 'components/core/PageTable';
import BreadCrumbs from 'components/core/BreadCrumbs';
import Action from 'components/core/Action';
import ActionLink from 'components/core/ActionLink';
import Confirm from 'components/core/Confirm';
import InvalidationNotifications from 'components/shared/InvalidationNotifications';
import { formatString } from 'components/core/Utils';

/**
 * The class defines a sliders management of site
 */
@inject('appStore')
class SlidersManagement extends Component {

    constructor(props) {
        super(props);

        const { route: { store } } = props;

        this.fetchData = store.fetchSliders.bind(store);
        this.getData = store.getData.bind(store);

        this.renderEditItemAction = this.renderEditItemAction.bind(this);
        this.renderDeleteItemAction = this.renderDeleteItemAction.bind(this);
        this.handleCloseConfirmPopup = this.handleCloseConfirmPopup.bind(this);
        this.handleConfirmPopup = this.handleConfirmPopup.bind(this);

        this.loadRegions = this.loadRegions.bind(this);
        this.showRegions = this.showRegions.bind(this);

        this.breadCrumbs = [
            { name: constants.SITE_MANAGEMENT, path: appRoutes.SLIDERS_MANAGEMENT },
            { name: constants.SLIDERS_MANAGEMENT }
        ];

        this.state = {
            confirmPopup: this.emptyConfirmPopupState
        }

        this.layout = {
            columns: [
                {
                    key: 'name',
                    name: 'Slider Name',
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
                    key: 'region',
                    name: 'Region',
                    className: 'text-center',
                    actions: item => {
                        return (
                            <span key={`${item.id}_region`}>
                                {item.region}
                                {item.hasMoreRegions && this.renderMoreRegionsAction(item)}
                            </span>);
                    }
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

    get emptyConfirmPopupState() {
        return {
            show: false,
            html: '',
            handler: null,
            cancelText: '',
            confirmText: '',
            title: ''
        };
    }

    componentWillUnmount() {
        const { route: { store } } = this.props;
        store.clearStore();
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
            confirmPopup: this.emptyConfirmPopupState
        });
    }

    /**
     * Delete item
     * @param {Object} item - item
     */
    handleDelete(item) {
        let html, handler, cancelText, confirmText, title;

        title = formatString(constants.POPUPS.DELETE.TITLE, item.name);
        handler = this.deleteItem.bind(this, item);
        cancelText = constants.POPUPS.SHARED.CANCEL;
        confirmText = constants.POPUPS.SHARED.CONFIRM;
        html = formatString(constants.POPUPS.DELETE.ALLOW_BODY, item.name);

        if (!!item.foundIn) {
            let pagesWarning = `The slider is attached to the following pages: ${item.foundIn}.`;
            html = `${html} ${pagesWarning}`;
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
    
    loadRegions(item) {
        const { route: { store: { entityRegionStore } } } = this.props;
        
        entityRegionStore
            .getRegion(item.id)
            .then((region) => this.showRegions(item, region));
    } 

    showRegions(item, region) {
        let html, handler, cancelText, confirmText, title;

        title = formatString(constants.POPUPS.REGIONS.TITLE, item.name);
        handler = this.handleCloseConfirmPopup;
        cancelText = '';
        confirmText = constants.POPUPS.SHARED.OK;
        html = `${formatString(region.map(x => x.name).join(', '))}.`;

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
        const { route: { store } } = this.props;
        let deletePromise = store.deleteSlider(item.id);
        deletePromise.then(this.handleCloseConfirmPopup.bind(this));
    }

    handleAvailability(item, available) {
        let html = formatString(available
            ? constants.POPUPS.AVAILABILITY.SHOW_BODY
            : constants.POPUPS.AVAILABILITY.HIDE_BODY, item.name),
            title = formatString(constants.POPUPS.AVAILABILITY.TITLE, item.name),
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
        let changePromise = store.changeSliderAvailability(item.id, available);
        changePromise.then(this.handleCloseConfirmPopup.bind(this), this.handleCloseConfirmPopup.bind(this));
    }

    /**
     * Render edit action for item
     * @param {Object} item - item
     */
    renderEditItemAction(item) {
        return (
            <ActionLink key="edit"
                to={appRoutes.EDIT_SLIDER.replace(':sliderId', item.id)}
                title={`Edit ${item.name}`}
                icon="edit" />
        );
    }

    /**
     * Render edit action for item
     * @param {Object} item - content item
     */
    renderDeleteItemAction(item) {
        if (item.isDefaultForAnyPage) return null;

        return (
            <Action key="remove"
                icon="remove"
                title={`Delete ${item.name}`}
                onClick={this.handleDelete.bind(this, item)} />
        );
    }

    renderMoreRegionsAction(item) {
        if (!item.hasMoreRegions) return null;

        return (
            <Action key="moreRegions"
                title="More"
                name="..."
                className="inline"
                onClick={this.loadRegions.bind(this, item)} />
        );
    }

    renderShowHideItemAction(item) {
        if (item.isDisabled) {
            return (
                <Action key="show"
                    icon="eye-slash"
                    title={`Show ${item.name}`}
                    onClick={this.handleAvailability.bind(this, item, true)} />
            );
        }
        else if (!item.isDefaultForAnyPage) {
            return (
                <Action key="hide"
                    icon="eye"
                    title={`Hide ${item.name}`}
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
                            to={appRoutes.CREATE_SLIDER}
                            text={'Add New Slider'}
                            title={'Add New Slider'}
                            icon="plus" />
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

export default SlidersManagement;
