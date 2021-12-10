import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import update from 'react-addons-update';
import classNames from 'classnames';

import { Grid, Row, Col, Modal, Button, OverlayTrigger, Popover } from 'react-bootstrap';

import moment from 'moment';

import UsersDetailsStore from 'stores/user/UsersDetailsStore';

import BreadCrumbs from 'components/core/BreadCrumbs';
import PageTable from 'components/core/PageTable';
import Action from 'components/core/Action';
import Notification from 'components/core/Notification';

import EditUserDetails from './EditUserDetails';
import WatchingIssues from './WatchingIssues';

import constants from 'constants/constants';
import appRoutes from 'components/app.routes.config';
import usersStyles from 'css/users.less';
import Loader from 'components/core/Loader';

/**
 * The class represents users and their details
 */
@inject('appStore')
@observer
class UsersDetails extends Component {

    /** The component properties */
    static propTypes = {
        route: PropTypes.shape({
            store: PropTypes.instanceOf(UsersDetailsStore)
        })
    };

    /** The export formats */
    static exportFormats = {
        xlsx: 'xlsx',
        csv: 'csv'
    };

    /** The default size of activity/ratings table */
    static DEFAULT_ACTIVITY_PAGE_SIZE = 10;

    /**
     * Construct a component
     * @param args - component arguments
     */
    constructor(...args) {
        super(...args);

        const [props] = args;
        const { route: { store, store: { getUsersDetails, fetchUsersDetails } } } = props;

        this.getUsersDetails = getUsersDetails.bind(store);
        this.fetchUsersDetails = fetchUsersDetails.bind(store);
        this.state = {
            loader: false,
        };

        this.usersDetailsLayout = {
            columns: [
                {
                    name: 'First Name',

                    key: 'firstName'
                },
                {
                    name: 'Last Name',
                    key: 'lastName'
                },
                {
                    name: 'Status',
                    key: 'statusName'
                },
                {
                    name: 'Country',
                    key: 'countryName'
                },
                {
                    name: 'Registration Date',
                    key: 'registeredAt',
                    format: value => moment(value).format('DD/MM/YYYY')
                },
                {
                    name: 'Email Address',
                    key: 'email'
                },
                {
                    name: 'Phone Number',
                    key: 'phoneNumber'
                },
                {
                    name: 'Tailored Genres',
                    key: 'tailoredGenres'
                },
                {
                    name: 'Active Devices',
                    key: 'activeDevicePlatformNames'
                },
                {
                    name: '# of Active Devices',
                    key: 'numberOfActiveDevices'
                },
                {
                    name: 'Language',
                    key: 'languageName'
                },
                {
                    name: 'Newsletter',
                    key: 'newslettersEnabledDisplayName'
                },
                {
                    name: 'Promotions',
                    key: 'promotionsEnabledDisplayName'
                },
                {
                    name: 'Source',
                    key: 'registrationSourceName'
                },
                {
                    name: 'Lead Device',
                    key: 'userLead'
                },
                {
                    name: 'Verification Status',
                    key: 'verificationEnabledDisplayName'
                },
                {
                    name: 'Actions',
                    key: 'actions',
                    actions: item => {
                        const activityState = this.state.userActivity[item.id];
                        return [
                            <Action key="editUser"
                                icon="pencil-square-o"
                                title="Edit User"
                                onClick={this.toggleEditUserView.bind(this, item)} />,
                            <Action key="ratings"
                                icon="star"
                                title="Ratings"
                                className={classNames({
                                    active: activityState &&
                                        activityState.on &&
                                        activityState.type == this.activity.ratings.type
                                })}
                                onClick={this.toggleUserRatingsView.bind(this, item.id)} />,
                            <Action key="viewActivity"
                                icon="list-ul"
                                title="View Activity List"
                                className={classNames({
                                    active: activityState &&
                                        activityState.on &&
                                        activityState.type == this.activity.activity.type
                                })}
                                onClick={this.toggleUserActivitiesView.bind(this, item.id)} />
                        ];
                    }
                }
            ]
        };
        this.usersFilters = [
            {
                name: 'userStatus',
                type: 'select',
                key: 'userStatuses',
                defaultValue: 'All statuses'
            },
            {
                name: 'RegistrationSourceType',
                type: 'select',
                key: 'sourceTypes',
                defaultValue: 'All source'
            },
            {
                name: 'NewsLetter',
                type: 'Adselect',
                key: 'newsLetters',
                defaultValue: 'All Newsletter'
            },
            {
                name: 'PromotionsEnabled',
                type: 'Adselect',
                key: 'promotionEnabled',
                defaultValue: 'All Promotions'
            },
            {
                name: 'VerificationStatus',
                type: 'Adselect',
                key: 'verificationStatuses',
                defaultValue: 'All verifications'
            },
            {
                name: 'UserLead',
                type: 'LeadSelect',
                key: 'userLeads',
                defaultValue: 'All Lead Devices'
            },
            {
                name: 'activeDevicePlatform',
                type: 'select',
                key: 'devicePlatforms',
                defaultValue: 'All Active Devices'
            },
            {
                name: 'countryId',
                type: 'select',
                key: 'countries',
                defaultValue: 'All Counties'
            },
            {
                name: 'searchText',
                type: 'search',
                defaultValue: '',
                placeholder: 'Search'
            },
            {
                name: 'dateFilter',
                type: 'Date',
                defaultValue: '',
                placeholder: 'Date'
            },
        ];
        this.breadCrumbs = [
            { name: constants.USERS_MANAGEMENT, path: appRoutes.USERS },
            { name: constants.MANAGE_USERS_DETAILS }
        ];

        this.state = {
            editUserView: { on: false, userData: null },
            userActivity: {},
            watchingIssues: { on: false, viewActivityId: null },
            AppliedfiltersData:null,
            ExportErrorMessage:""
        };

        this.initActivityConfiguration(store);

        this.handleSaveUserDetails = this.handleSaveUserDetails.bind(this);
        this.handleCloseUserDetails = this.handleCloseUserDetails.bind(this);
        this.sendUpdateNotification = this.sendUpdateNotification.bind(this);
    }

    /**
     * Initialize a user's activity configuration
     */
    initActivityConfiguration(store) {
        const baseActivityLayout = dateKey => [
            {
                name: 'Date',
                key: dateKey,
                format: value => moment(value).format('DD/MM/YYYY')
            },
            {
                name: 'Time',
                key: dateKey,
                reactKey: 'time',
                format: value => moment(value).format('HH:mm:ss')
            },
            {
                name: 'Title',
                key: 'title'
            },
            {
                name: 'Content Type',
                key: 'contentType'
            },
            {
                name: 'Genre',
                key: 'genres',
                format: value => value && value.join(', ')
            }
        ];
        const filters = [
            {
                name: 'contentType',
                type: 'select',
                key: 'contentTypes',
                defaultValue: 'All Content Types'
            },
            {
                name: 'searchText',
                type: 'search',
                defaultValue: '',
                placeholder: 'Search'
            }
        ];

        this.activity = {
            ratings: {
                type: 'ratings',
                layout: {
                    columns: baseActivityLayout('ratedAt').concat([
                        {
                            name: 'Rated On',
                            key: 'ratedOnPlatformName'
                        },
                        {
                            name: 'Rating',
                            key: 'rating',
                            actions: item => new Array(5).fill(null).map((value, rating) =>
                                <Action key={`ratings-${rating}`}
                                    icon="star"
                                    title="Ratings"
                                    className={
                                        classNames({
                                            'bo-essel-user-ratings-action': true,
                                            active: item.rating > rating
                                        })
                                    }
                                />)
                        }
                    ])
                },
                filters,
                fetchFilters: store.fetchUsersRatingsFilters.bind(store),
                getFilters: store.getUsersRatingsFilters.bind(store),
                fetchData: store.fetchUsersRatings,
                getData: store.getUsersActivity
            },
            activity: {
                type: 'activity',
                layout: {
                    columns:
                        [{
                            name: '',
                            key: 'error',
                            actions: item => item.hasWatchingIssues ?
                                <Action className="bo-essel-watching-issues-action"
                                    icon="circle"
                                    title="Watching issues"
                                    onClick={this.toggleWatchingIssuesView.bind(this, item.viewActivityId)} /> :
                                null
                        }].concat(baseActivityLayout('viewedAt'), [
                            {
                                name: 'Viewed on',
                                key: 'viewedOnPlatformName'
                            },
                            {
                                name: 'Status',
                                key: ['lastWatchPositionSeconds', 'durationSeconds'],
                                format: (lastWatchPosition, duration) => {
                                    const lastWatchPositionDuration = moment.duration(lastWatchPosition, 'seconds');
                                    const durationDuration = duration ? moment.duration(duration, 'seconds') : null;
                                    const formatDuration = duration => {
                                        const emptyDuration = '--:--:--';
                                        if (duration) {
                                            var hours = duration.hours().toString();
                                            var minutes = duration.minutes().toString();
                                            var seconds = duration.seconds().toString();
                                            hours.length == 1 && (hours = `0${hours}`);
                                            minutes.length == 1 && (minutes = `0${minutes}`);
                                            seconds.length == 1 && (seconds = `0${seconds}`);
                                            return `${hours}:${minutes}:${seconds}`;
                                        }

                                        return emptyDuration;

                                    };
                                    return `${formatDuration(lastWatchPositionDuration)}/${formatDuration(durationDuration)}`;
                                }
                            }
                        ])
                },
                filters,
                fetchFilters: store.fetchUsersActivitiesFilters.bind(store),
                getFilters: store.getUsersActivitiesFilters.bind(store),
                fetchData: store.fetchUsersActivities,
                getData: store.getUsersActivity
            }
        };
    }

    /**
     * Fetch user's filters on a component mounting
     * @see Component#componentWillMount()
     */
    componentWillMount() {
        const { route: { store } } = this.props;
        store.fetchUsersFilters();
    }

    /**
     * Get users' filters
     * @param {Array} filters - filters
     * @param {Object} usersFiltersData - the users' filters data
     * @returns {Array} users filters
     */
    getUsersFilters(filters, usersFiltersData) {
        return usersFiltersData ?
            filters.map(usersFilter => {
                if (usersFilter.type == 'select') {
                    (usersFilter.data = usersFiltersData[usersFilter.key]);
                } else if (usersFilter.type == 'Adselect') {
                    (usersFilter.data = usersFiltersData[usersFilter.key]);
                } else if (usersFilter.type == 'LeadSelect') {
                    (usersFilter.data = usersFiltersData[usersFilter.key]);
                }
                return usersFilter;
            }
            )
            : filters;
    }

    /**
     * Get expandable items such as User's View Activity or User's Ratings
     * @returns {Object} a key value pair of a user id and an expandable item
     */
    getExpandableItems() {
        const { userActivity } = this.state;
        const { route: { store } } = this.props;

        return Object.
            keys(userActivity).
            filter(userId => userActivity[userId].on).
            reduce((value, userId) => {
                const { filters, getFilters, fetchData, getData, layout, type } = this.activity[userActivity[userId].type];
                value[userId] = <PageTable
                    key={`${userId}_${type}`}
                    filters={this.getUsersFilters(filters, getFilters())}
                    fetchData={fetchData.bind(store, userId)}
                    getData={getData.bind(store, userId)}
                    layout={layout}
                    tableClassName={classNames({ 'bo-essel-page-inner-table': true, [type]: true })}
                    isRowActive={value => !value.isHidden}
                    pageSize={UsersDetails.DEFAULT_ACTIVITY_PAGE_SIZE}
                />;
                return value;
            }, {});
    }

    /**
     * Open or close an edit user view
     * @param {Object} userData - a user data
     */
    toggleEditUserView(userData = null) {
        this.setState({ editUserView: { on: !this.state.editUserView.on, userData } });
    }

    /**
     * Open or close an activity errors view
     * @param {Object} viewActivityId - a view activity identifier
     */
    toggleWatchingIssuesView(viewActivityId = null) {
        this.setState({ watchingIssues: { on: !this.state.watchingIssues.on, viewActivityId } });
    }

    /**
     * Show or hide a user ratings view
     * @param {String} userId - a user identifier
     */
    toggleUserRatingsView(userId) {
        this.toggleUserActivityView(userId, this.activity.ratings);
    }

    /**
     * Show or hide a user activities view
     * @param {String} userId - a user identifier
     */
    toggleUserActivitiesView(userId) {
        this.toggleUserActivityView(userId, this.activity.activity);
    }

    /**
     * Show or hide a user activity view
     * @param {String} userId - a user identifier
     * @param {Object} activityData - an activity data
     */
    toggleUserActivityView(userId, activityData) {
        const { getFilters, fetchFilters, type } = activityData;
        !getFilters() && fetchFilters();

        const { userActivity } = this.state;
        const activityState = userActivity[userId];
        const on = activityState && activityState.on && activityState.type == type ? false : true;

        this.setState({
            userActivity: update(userActivity, { $merge: { [userId]: { on, type } } })
        });
    }

    /**
     * Send a notification of that a user's details were updated
     */
    sendUpdateNotification() {
        this.props.appStore.setNotificationAfterRedirect(Notification.Notifications.info, constants.UPDATE_NOTIFICATION_MESSAGE);
    }

    /**
     * Handle an update of a user's details
     * @param {Object} updatedUserDetails - updated user's details
     */
    handleSaveUserDetails(updatedUserDetails) {
        const { route: { store, store: { updateUserDetails } } } = this.props;
        updateUserDetails.
            call(store, this.state.editUserView.userData.id, updatedUserDetails).
            then(this.handleCloseUserDetails).
            then(this.sendUpdateNotification);
    }

    /**
     * Handle a close event for a modal dialog
     */
    handleCloseUserDetails() {
        this.toggleEditUserView()
    }

    redirect() {
        const { router, appStore, route: { store } } = this.props;
        router.push(appRoutes.USERS);
        appStore.setNotificationAfterRedirect(
            Notification.Notifications.info,
            "Email sent successfully.."
        );
    }

    /**
     * Perform an export of user's details
     * @param {String} format - a format of an export data
     */
    performExport(format) {

        let AppliedFilter = this.state.AppliedfiltersData
        
        let FilterData = null

        if(AppliedFilter !== null){
             FilterData =  Object.keys(AppliedFilter)
                                    .filter(key => AppliedFilter[key] !== '')
                                    .reduce((value, key) => { value[key] = AppliedFilter[key]; return value; }, {});

             FilterData.type = format
        }
    
        if(FilterData == null || FilterData.StartDate == null ||  FilterData.EndDate == null){
            this.setState({
                ExportErrorMessage:'Please select 6 months in filters'
            })
        }else{

        const { route: { store } } = this.props;
        this.setState({ showLoader: true });
        store.exportUsersDetails(format,FilterData).then(() => this.setState({ showLoader: false }));
        this.redirect();
        this.refs.exportPopup.hide();
        }
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
     * Render an edit user component
     */
    renderEditUserView() {
        const { editUserView: { on, userData } } = this.state;
        const submitBtnId = 'editUserDetails';
        return (
            <Modal className="bo-essel-modal" show={on} onHide={this.handleCloseUserDetails}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditUserDetails userData={userData}
                        submitBtnId={submitBtnId}
                        onSubmit={this.handleSaveUserDetails} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleCloseUserDetails}>Cancel</Button>
                    <Button type="submit"><label htmlFor={submitBtnId}>Save</label></Button>
                </Modal.Footer>
            </Modal>
        );
    }

    /**
     * Render a view activity errors
     */
    renderWatchingIssuesView() {
        const { watchingIssues: { on, viewActivityId } } = this.state;
        const { route: { store } } = this.props;
        return (
            <Modal className="bo-essel-modal" show={on} onHide={() => this.toggleWatchingIssuesView()}>
                <Modal.Header closeButton>
                    <Modal.Title>Error Report</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        viewActivityId &&
                        <WatchingIssues viewActivityId={viewActivityId}
                            getWatchingIssues={store.getUsersWatchingIssues.bind(store)}
                            fetchWatchingIssues={store.fetchUsersWatchingIssues.bind(store)}
                        />
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.toggleWatchingIssuesView()}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    /**
     * Render an export section
     * @returns {ReactNode} a rendered React element
     */
    renderExportSection() {
        const popover =
            <Popover className="bo-essel-export-format"
                id="bo-essel-export-id"
                title="Format">
                <span>
                    <a onClick={() => this.performExport(UsersDetails.exportFormats.xlsx)}>XLSX</a>
                    |
                    <a onClick={() => this.performExport(UsersDetails.exportFormats.csv)}>CSV</a>
                </span>
            </Popover>
        return (
            <OverlayTrigger trigger="click"
                placement="bottom"
                overlay={popover}
                rootClose={true}
                ref="exportPopup"
            >
                <Button className="bo-essel-export" title="Export user's details">
                    <span>
                        <i className="fa fa-share-square-o" />
                        <span>Export</span>
                    </span>
                </Button>
            </OverlayTrigger>
        );
    }

    /**
     * @see Component#render()
     */

    getAppliedFilters = (filters)=>{
        this.setState({
            AppliedfiltersData:filters
        })
     }

     ClearErrorValidation = ()=> {
        this.setState({
            ExportErrorMessage:""
        })
     }

    render() {
        const { router, route: { store } } = this.props;
        return (
            <div>
                {/* {
                this.state.loader &&
                <span className="bo-essel-loader-bounce bo-essel-loader-center">
                <Loader className="bo-essel-loader-center"/>
                </span>
                } */}
                {this.renderPageFreezeLoader()}
                <Grid>
                    <Row className="bread-crumbs">
                        <Col className="col" xs={12} md={8}>
                            <BreadCrumbs router={router} crumbs={this.breadCrumbs} />
                        </Col>
                        <Col className="col" xs={6} md={4}>
                            {this.renderExportSection()}
                        </Col>
                    </Row>
                    <Row className="main-content">
                        <PageTable
                            filters={this.getUsersFilters(this.usersFilters, store.getUsersFilters())}
                            ApplyFiltersInfo={this.getAppliedFilters}
                            ExportErrorMessage={this.state.ExportErrorMessage}
                            RemoveErrorMessage={this.ClearErrorValidation}
                            fetchData={this.fetchUsersDetails}
                            getData={this.getUsersDetails}
                            layout={this.usersDetailsLayout}
                            expandableItems={this.getExpandableItems()}
                        />
                    </Row>
                    <Row>
                        {this.renderEditUserView()}
                        {this.renderWatchingIssuesView()}
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default UsersDetails;
