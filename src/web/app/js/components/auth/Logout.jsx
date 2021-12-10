import React, { Component, PropTypes } from 'react';
import { inject } from 'mobx-react';

import throttle from 'lodash.throttle';

import Action from 'components/core/Action';

import appRoutes from 'components/app.routes.config';

/**
 * The class defines a logout component
 */
@inject('appStore')
class Logout extends Component {

    /** The component's properties */
    static propTypes = {
        on: PropTypes.bool.isRequired,
        router: PropTypes.object.isRequired
    };

    /** The logout interval */
    static LOGOUT_INTERVAL = 1000 * 60 * 1; // 1min
    /** The logout timeout */
    static LOGOUT_TIMEOUT = 1000 * 60 * 30; // 30min
    /** The logout retry timeout */
    static LOGOUT_RETRY_TIMEOUT = 5000; // 5sec
    /** The maximum amount of retry attempts for logout */
    static MAX_RETRY_LOGOUT_ATTEMPTS = 3;
    /** The user activity throttle delay */
    static USER_ACTIVITY_THROTTLE_DELAY = 250;

    /**
     * Construct a component
     */
    constructor() {
        super();

        this.userActivityEventTypes = ['mousemove', 'keydown', 'scroll'];
        this.lastUserActivity = null;

        this.handleLogout = this.handleLogout.bind(this);
        this.handleResetUserInactivity = throttle(
            this.handleResetUserInactivity.bind(this),
            Logout.USER_ACTIVITY_THROTTLE_DELAY,
            {leading: true}
        );
        this.redirect = this.redirect.bind(this);
    }

    /**
     * Set or clean up a logout tracking
     * @see Component#componentWillMount()
     */
    componentWillMount() {
        this.toggleLogoutTracking(this.props.on);
    }

    /**
     * Clean up a logout tracking
     * @see Component#componentWillUnmount()
     */
    componentWillUnmount() {
        this.cleanUpLogoutTracking();
    }

    /**
     * Set or clean up a logout tracking
     * @see Component#compoentWillReceiveProps(nextProps)
     */
    componentWillReceiveProps(nextProps) {
        const { on } = nextProps;
        this.props.on != on && this.toggleLogoutTracking(on);
    }

    /**
     * Toggle a logout tracking
     * @param {Boolean} on - true if a logout tracking has to be set up otherwise it should be cleaned up
     */
    toggleLogoutTracking(on) {
        if (on) {
            this.setUpLogoutTracking();
        } else {
            this.cleanUpLogoutTracking();
        }
    }

    /**
     * Clean up resources needed for logout tracking
     */
    cleanUpLogoutTracking() {
        if (this.logoutInterval) {
            clearInterval(this.logoutInterval);
            this.logoutInterval = null;
            this.lastUserActivity = null;
            this.userActivityEventTypes.
                forEach(eventType => document.removeEventListener(eventType, this.handleResetUserInactivity));
        }
    }

    /**
     * Set up logout tracking mechanism
     */
    setUpLogoutTracking() {
        this.userActivityEventTypes.
            forEach(eventType => document.addEventListener(eventType, this.handleResetUserInactivity));
        this.lastUserActivity = new Date().getTime();
        this.logoutInterval = setInterval(() => {
            (new Date().getTime() - this.lastUserActivity) >= Logout.LOGOUT_TIMEOUT && this.performLogout(true);
        }, Logout.LOGOUT_INTERVAL);
    }

    /**
     * Handle logout action
     */
    handleLogout() {
        this.performLogout();
    }

    /**
     * Perform logout
     * - Invalidate a user session
     * - Redirect a user to a login page
     * @param {Boolean} auto - true if logout is issued automatically otherwise as a result of a user action
     */
    performLogout(auto = false) {
        const { appStore } = this.props;

        this.cleanUpLogoutTracking();
        if (auto) {
            appStore.invalidateSession().then(this.redirect, this.handleLogoutFail.bind(this, 1));
        } else {
            appStore.invalidateSession();
            this.redirect();
        }
    }

    /**
     * Handle a logout fail
     * @param {Number} attempt - a retry attempt
     */
    handleLogoutFail(attempt) {
        const { appStore } = this.props;
        if (attempt < Logout.MAX_RETRY_LOGOUT_ATTEMPTS) {
            setTimeout(
                () => {
                    appStore.invalidateSession().then(this.redirect, this.handleLogoutFail.bind(this, attempt + 1))
                },
                Logout.LOGOUT_RETRY_TIMEOUT);
        } else {
            appStore.setUserAuthToken(null);
            this.redirect();
        }
    }

    /**
     * Handle a user inactivity
     */
    handleResetUserInactivity() {
        this.lastUserActivity = new Date().getTime();
    }

    /**
     * Redirect to login page
     */
    redirect() {
        this.props.router.push(appRoutes.LOGIN);
    }

    /**
     * @see Component#render()
     */
    render() {
        const { on } = this.props;
        return on ?
            <Action className="logout"
                    icon="sign-out"
                    name="Logout"
                    title="Logout from application"
                    onClick={this.handleLogout}
            /> :
            null;
    }
}

export default Logout;