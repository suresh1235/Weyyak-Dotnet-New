import { observable, action, asMap } from 'mobx';

import Store from 'stores/Store';
import endpoints from 'transport/endpoints';

/**
 * The user details store
 */
class UsersDetailsStore extends Store {

    /** The users details */
    @observable
    usersDetails = null;
    @observable
    usersFilters = null;
    @observable
    usersActivity = asMap();
    @observable
    usersRatingsFilters = null;
    @observable
    usersActivitiesFilters = null;
    @observable
    userWatchingIssues = asMap();

    /**
     * Get users details
     * @returns {Array} users details
     */
    getUsersDetails() {
        return this.usersDetails;
    }

    /**
     * Get user's filters
     * @returns {Array} users' filters
     */
    getUsersFilters() {
        return this.usersFilters;
    }

    /**
     * Get users' ratings filters
     * @returns {Object} users' ratings filters
     */
    getUsersRatingsFilters() {
        return this.usersRatingsFilters;
    }

    /**
     * Get users' activities filters
     * @returns {Object} users' activities filters
     */
    getUsersActivitiesFilters() {
        return this.usersActivitiesFilters;
    }

    /**
     * Get user's activity either ratings or view activity
     * @param {String} userId - a user identifier
     * @returns {Object} user's activity data
     */
    getUsersActivity(userId) {
        return this.usersActivity.get(userId);
    }

    /**
     * Get user's watching issues
     * @param {String} viewActivityId - a view activity identifier
     * @returns {Object} user's watching issues
     */
    getUsersWatchingIssues(viewActivityId) {
        return this.userWatchingIssues.get(viewActivityId);
    }

    /**
     * Set users details
     * @param {Array} usersDetails - users details to be set
     */
    @action
    setUsersDetails(usersDetails) {
        this.usersDetails = usersDetails;
    }

    /**
     * Set users filters
     * @param {Array} usersFilters - users filters to be set
     */
    @action
    setUsersFilters(usersFilters) {
        this.usersFilters = usersFilters;
    }

    /**
     * Set user's activity
     * @param {String} userId - a user identifier
     * @param {Object} userActivity - a user's activity data
     */
    @action
    setUsersActivity(userId, userActivity) {
        this.usersActivity.set(userId, userActivity);
    }

    /**
     * Set user's watching issues
     * @param {String} viewActivityId - a user identifier
     * @param {Object} watchingIssues - a user's watching issues
     */
    @action
    setUsersWatchingIssues(viewActivityId, watchingIssues) {
        this.userWatchingIssues.set(viewActivityId, watchingIssues.data);
    }

    /**
     * Set user's ratings filters
     * @param {Object} filters - users' ratings filters
     */
    @action
    setUsersRatingsFilterData(filters) {
        this.usersRatingsFilters = filters;
    }

    /**
     * Set user's activities filters
     * @param {Object} filters - user's activities filters
     */
    @action
    setUsersActivitiesFilterData(filters) {
        this.usersActivitiesFilters = filters;
    }

    /**
     * Fetch users details
     * @params {Object} params - a call api
     * @returns {Promise} a call api promise
     */
    fetchUsersDetails(params) {
        this.setUsersDetails(null);
        return this.Transport.callApi(endpoints.GET_USERS_DETAILS, null, params).
            then(this.setUsersDetails.bind(this));
    }

    /**
     * Fetch users filters
     * @returns {Promise} a call api promise
     */
    fetchUsersFilters() {
        return this.Transport.callApi(endpoints.GET_USERS_FILTERS).then(this.setUsersFilters.bind(this));
    }

    /**
     * Fetch user's ratings
     * @param {String} userId - a user identifier
     * @param {Object} params - call api params
     * @returns {Promise} a call api promise
     */
    fetchUsersRatings(userId, params = null) {
        const sendParams = params ? [userId, params] : [userId];
        return this.Transport.callApi(endpoints.GET_USER_RATINGS, null, sendParams).then(
            this.setUsersActivity.bind(this, userId)
        );
    }

    /**
     * Fetch user's ratings filters
     * @returns {Promise} a call api promise
     */
    fetchUsersRatingsFilters() {
        return this.Transport.callApi(endpoints.GET_USERS_RATINGS_FILTERS).then(
            this.setUsersRatingsFilterData.bind(this)
        );
    }

    /**
     * Fetch user's activities filters
     * @returns {Promise} a call api promise
     */
    fetchUsersActivitiesFilters() {
        return this.Transport.callApi(endpoints.GET_USERS_ACTIVITIES_FILTERS).then(
            this.setUsersActivitiesFilterData.bind(this)
        );
    }

    /**
     * Fetch user's activities
     * @param {String} userId - a user identifier
     * @param {Object} params - call api params
     * @returns {Promise} a call api promise
     */
    fetchUsersActivities(userId, params = null) {
        const sendParams = params ? [userId, params] : [userId];
        return this.Transport.callApi(endpoints.GET_USER_ACTIVITIES, null, sendParams).then(
            this.setUsersActivity.bind(this, userId)
        );
    }

    /**
     * Fetch user's watching issues
     * @param {String} viewActivityId - a user identifier
     * @returns {Promise} a call api promise
     */
    fetchUsersWatchingIssues(viewActivityId) {
        return this.Transport.callApi(endpoints.GET_WATCHING_ISSUES, null, viewActivityId).then(
            this.setUsersWatchingIssues.bind(this, viewActivityId)
        );
    }

    /**
     * Update users data
     * @param {String} userDetailsId - user's details identifier
     * @param {Object} userDetails - user's details to be updated
     */
    @action
    updateUserData(userDetailsId, userDetails) {
        const usersData = this.usersDetails.data;
        for (var i = 0; i < usersData.length; i++) {
            const userData = usersData[i];
            if (userData.id == userDetailsId) {
                Object.keys(userDetails).
                    forEach(attribute => userData[attribute] = userDetails[attribute]);
                return;
            }
        }
    }

    /**
     * Update users details
     * @param {String} userDetailsId - user's details identifier
     * @param {Object} updatedUserDetails - updated user's details
     */
    updateUserDetails(userDetailsId, updatedUserDetails) {
        const { countryName, languageName, ...userDetailsForSubmit } = updatedUserDetails;
        return this.Transport.callApi(endpoints.UPDATE_USERS_DETAILS, userDetailsForSubmit, [userDetailsId]).
            then(this.updateUserData.bind(this, userDetailsId, updatedUserDetails));
    }

    /**
     * Export users details
     */
    exportUsersDetails(format,params) {
        return this.Transport.callApi(endpoints.EXPORT_USERS_DETAILS, null, params);
        // return this.Transport.callApi(endpoints.EXPORT_USERS_DETAILS, null, [format]);
    }
}

export default UsersDetailsStore;