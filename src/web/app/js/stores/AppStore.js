import { observable, action } from 'mobx';

import Store from 'stores/Store';
import endpoints from 'transport/endpoints';
import appRoutes from 'components/app.routes.config';

/**
 * The application store/context.
 * Responsibilities:
 * - possess information about the application itself;
 * - store a user authentication token;
 * - store a global application errors;
 * - store country and language names.
 */
class AppStore extends Store {

    /** A user authentication token */
    @observable
    appState = {
        userAuthToken: JSON.parse(localStorage.getItem(AppStore.USER_AUTH_TOKEN_KEY)),
        countries: null,
        languages: null,
        notification: null,
        disableNotificationReset: false,
        serverValidationErrors: null
    };

    /** The user authentication token key */
    static USER_AUTH_TOKEN_KEY = 'userAuthToken';

    /**
     * Construct an application store instance
     */
    constructor() {
        if (appStoreSingleton) {
            throw new Error('Application store is a singleton. Multiple instances not allowed.');
        }

        super();
        window.addEventListener('storage', this.handleTokenUpdate.bind(this));
        window.addEventListener('unload', () => window.removeEventListener('storage', this.handleTokenUpdate));

        this.clearErrorMessages = this.clearErrorMessages.bind(this);
    }

    /**
     * Get an instance of the application store
     * @returns {AppStore} the instance of the application store
     */
    static getInstance() {
        return appStoreSingleton;
    }

    /**
     * Checks whether a user is authenticated or not
     * @returns {Boolean} true if a user is authenticated otherwise false
     */
    isUserAuthenticated() {
        return this.appState.userAuthToken != null;
    }

    /**
     * Get a user authentication token
     * @returns {Object} a user authentication token
     */
    getUserAuthToken() {
        return this.appState.userAuthToken;
    }

    /**
     * Set a user authentication token
     * @param {Object} userAuthToken a user authentication token
     */
    @action
    setUserAuthToken(userAuthToken) {
        if (userAuthToken) {
            localStorage.setItem(AppStore.USER_AUTH_TOKEN_KEY, JSON.stringify(userAuthToken));
        } else {
            localStorage.removeItem(AppStore.USER_AUTH_TOKEN_KEY);
        }
        this.appState.userAuthToken = userAuthToken;
    }

    /**
     * Get an application notification
     * @returns {Object} an application notification
     */
    getNotification() {
        return this.appState.notification;
    }

    /**
     * Set server validation errors
     * @param {Object} responseData server's reject data
     */
    @action
    setErrors(responseData) {
        this.appState.serverValidationErrors = responseData;
    }

    /**
     * Resets server validation errors
     */
    @action
    clearErrorMessages(dontClearServerErrorMessages) {
        !this.appState.disableNotificationReset && this.setNotification(null);
        !dontClearServerErrorMessages && (this.appState.serverValidationErrors = null);
    }

    /**
     * Clear current validation
     * @param {String} errorName - server error name
     */
    @action
    deleteServerErrorMessage(errorName) {
        if (this.appState.serverValidationErrors) {
            delete this.appState.serverValidationErrors.invalid[errorName];
        }
    }

    /**
     * Disables notification reset and sets notificaton
     * @param {Object} defaultNotification - a default application notification
     * @param {String} message - a notification message
     * @param {Object} data - an additional notification data
     * @param {String} view - override view
     */
    setNotificationAfterRedirect(defaultNotification, message = null, data = null, view = null) {
        this.setDisableNotificationReset(true);
        this.setNotification(defaultNotification, message, data, view);
    }

    /**
     * Set an application notification
     * @param {Object} defaultNotification - a default application notification
     * @param {String} message - a notification message
     * @param {Object} data - an additional notification data
     * @param {String} view - override view
     */
    @action
    setNotification(defaultNotification, message = null, data = null, view = null) {
        if (!defaultNotification) {
            this.appState.notification = null;
            this.appState.disableNotificationReset = false;
            return;
        }

        const notification = {
            ...defaultNotification,
            data
        };
        message && (notification.message = message);
        view && (notification.view = view);

        this.appState.notification = notification;
    }

    /**
     * Set notification reset disabler
     * @param {Boolean} disableNotificationReset - notification reset disabler
     */
    @action
    setDisableNotificationReset(disableNotificationReset) {
        this.appState.disableNotificationReset = disableNotificationReset;
    }

    /**
     * Handles auth token update in local storage
     * @param {StorageEvent} event Storage event
     */
    @action
    handleTokenUpdate(event) {
        if (event.key === AppStore.USER_AUTH_TOKEN_KEY) {
            this.appState.userAuthToken = JSON.parse(localStorage.getItem(AppStore.USER_AUTH_TOKEN_KEY));
            !event.newValue && this.appState.router.push(appRoutes.LOGIN);
        }
    }

    /**
     * Get an application router
     * @returns {Object} an application router
     */
    get Router() {
        return this.appState.router;
    }

    /**
     * Set an application router
     * @param {Object} router - an application router
     */
    set Router(router) {
        this.appState.router = router;
    }

    /**
     * Get supported languages
     * @returns {Array} supported languages
     */
    get Languages() {
        const languages = this.appState.languages;
        if (!languages && !this.fetchLanguagesPending) {
            const cleanUpPendingState = function() { delete this.fetchLanguagesPending }.bind(this);
            this.fetchLanguages().then(cleanUpPendingState, cleanUpPendingState);
            this.fetchLanguagesPending = true;
        }
        return languages;
    }

    /**
     * Set supported languages
     * @param {Array} languages - supported languages to be set
     */
    @action
    setLanguages(languages) {
        this.appState.languages = languages.data;
    }

    /**
     * Get countries
     * @returns {Array} countries
     */
    get Countries() {
        const countries = this.appState.countries;
        if (!countries && !this.fetchCountriesPending) {
            const cleanUpPendingState = function() { delete this.fetchCountriesPending }.bind(this);
            this.fetchCountries().then(cleanUpPendingState, cleanUpPendingState);
            this.fetchCountriesPending = true;
        }
        return countries;
    }

    /**
     * Set countries
     * @param {Array} countries - countries to be set
     */
    @action
    setCountries(countries) {
        this.appState.countries = countries.data;
    }

    /**
     * Authenticate a user
     * @param {String} email - a user email
     * @param {String} password - a user password
     * @returns {Promise} an API call promise
     */
    authenticateUser(email, password) {
        return this.Transport.callApi(endpoints.AUTHENTICATE, { username: email.trim(), password }).
            then(this.setUserAuthToken.bind(this));
    }

    /**
     * Ask for reset password
     * @param {String} email - a user email
     * @returns {Promise} an API call promise
     */
    resetPasswordRequest(email) {
        return this.Transport.callApi(endpoints.RESET_PASSWORD_REQUEST, { email: email.trim()});
    }

    /**
     * Update user's password
     * @param {Object} params - email, password, resetPasswordToken
     * @param {String} endpoint - endpoint to call
     * @returns {Promise} an API call promise
     */
    updatePasswordRequest(params, endpoint = endpoints.UPDATE_PASSWORD_REQUEST) {
        return this.Transport.callApi(endpoint, params);
    }

    /**
     * Invalidate a user session
     * @returns {Promise} an API call promise
     */
    invalidateSession() {
        return this.Transport.callApi(
            endpoints.INVALIDATE,
            { 'refresh_token': this.appState.userAuthToken.refresh_token }
        ).then(this.setUserAuthToken.bind(this, null));
    }

    /**
     * Fetch supported language names
     * @returns {Promise} an API call promise
     */
    fetchLanguages() {
        return this.Transport.callApi(endpoints.GET_LANGUAGE_NAMES).then(this.setLanguages.bind(this));
    }

    /**
     * Fetch country names
     * @returns {Promise} an API call promise
     */
    fetchCountries() {
        return this.Transport.callApi(endpoints.GET_COUNTRY_NAMES).then(this.setCountries.bind(this));
    }
}

/** The single instance of the application store */
const appStoreSingleton = new AppStore();

export default AppStore;
