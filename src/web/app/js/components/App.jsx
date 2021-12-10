import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { inject, observer } from 'mobx-react';
import classNames from 'classnames';
import DevTools from 'mobx-react-devtools';

import appRoutes from './app.routes.config';

import SideMenu from 'components/menu/SideMenu';
import Notification from 'components/core/Notification';
import Logout from 'components/auth/Logout';

import constants from 'constants/constants';

import appStyles from 'css/app';

/**
 * The class defines an application component
 */
@inject('appStore')
@observer
class App extends Component {

    /** The menu layout */
    static menuConfig = {
        name: 'BackOffice',
        icons: {
            showMenu: 'arrow-right',
            hideMenu: 'arrow-left',
            showSubMenu: 'plus-square-o',
            hideSubMenu: 'minus-square-o'
        },
        menu: [
            {
                name: 'Users Management',
                icon: 'users',
                key: 'usersManagement',
                items: [
                    {
                        name: 'Manage Users Details',
                        path: appRoutes.USERS
                    },
                    {
                        name: 'Devices Configuration',
                        path: appRoutes.DEVICES
                    }
                ]
            },
            {
                name: 'Editors Management',
                icon: 'user-plus',
                key: 'editorsManagement',
                items: [
                    {
                        name: 'Manage Editors',
                        path: appRoutes.EDITORS
                    }
                ]
            },
            {
                name: 'Content Management',
                icon: 'file',
                key: 'contentManagement',
                items: [
                    {
                        name: 'Manage Content',
                        path: appRoutes.MANAGE_CONTENT
                    },
                    {
                        icons: {
                            showSubMenu: 'plus-square-o',
                            hideSubMenu: 'minus-square-o'
                        },
                        menu: [
                            {
                                name: 'Create & Schedule',
                                icon: 'calendar-minus-o',
                                key: 'createContent',
                                items: [
                                    {
                                        name: 'One Tier Content',
                                        path: appRoutes.ONE_TIER_CONTENT
                                    },
                                    {
                                        name: 'Multi Tier Content Title',
                                        path: appRoutes.MULTI_TIER_CONTENT_TITLE
                                    },
                                    {
                                        name: 'Multi Tier Content Season',
                                        path: appRoutes.MULTI_TIER_CONTENT_SEASON
                                    },
                                    {
                                        name: 'Multi Tier Content Episode',
                                        path: appRoutes.MULTI_TIER_CONTENT_EPISODE
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: 'Site Management',
                icon: 'window-restore',
                key: 'siteManagement',
                items: [
                    {
                        name: 'Pages Management',
                        path: appRoutes.PAGES_MANAGEMENT
                    },
                    {
                        name: 'Create Page',
                        path: appRoutes.CREATE_PAGE
                    },
                    {
                        name: 'Playlists Management',
                        path: appRoutes.PLAYLISTS_MANAGEMENT
                    },
                    {
                        name: 'Create Playlist',
                        path: appRoutes.CREATE_PLAYLIST
                    },
                    {
                        name: 'Sliders Management',
                        path: appRoutes.SLIDERS_MANAGEMENT
                    },
                    {
                        name: 'Create Slider',
                        path: appRoutes.CREATE_SLIDER
                    },
                ]
            }
        ]
    };

    /**
     * Construct the application component
     */
    constructor() {
        super();

        this.state = { sideMenuOn: true };
    }

    /**
     * Determine whether a side menu to be rendered
     * @returns {Boolean} true if a side menu has to be rendered otherwise false
     */
    isSideMenuVisible() {
        return !this.isPublicPageActive();
    }

    /**
     * Get a notification view
     * @param {Object} notification - notification object
     * @returns {String} a notification view
     */
    getNotificationView(notification) {
        if (notification && notification.view) {
            return notification.view;
        } else {
            return this.isPublicPageActive() ? Notification.Views.raw : Notification.Views.base;
        }
    }

    /**
     * Determine whether an application is on a login page or not
     * @returns {Boolean} true if an application is on a login page otherwise false
     */
    isLoginPageActive() {
        const { router } = this.props;
        return router.isActive(appRoutes.LOGIN);
    }

    /**
     * Determine whether an application is on a reset password page or not
     * @returns {Boolean} true if an application is on a login page otherwise false
     */
    isResetPasswordPageActive() {
        const { router } = this.props;
        return router.isActive(appRoutes.RESET_PASSWORD || appRoutes.PASSWORD);
    }

    /**
     * Determine whether an application is on a public page or not
     * @returns {boolean}
     */
    isPublicPageActive() {
        const { location: { pathname } } = this.props;
        return pathname == appRoutes.LOGIN ||
            pathname == appRoutes.RESET_PASSWORD ||
            pathname == appRoutes.PASSWORD ||
            pathname == appRoutes.SEARCH_DEMO ||
            this.props.routes.some(route => route.path === '*');
    }

    /**
     * Checks whether an application runs under development environment
     * @returns {Boolean} true application is running in development mode, false otherwise
     */
    isDevEnvironment() {
        try {
            return __env__ == constants.environment.DEV;
        } catch (exception) {
            return false;
        }
    }

    /**
     * Render an application notification
     * @param {Object} notification - an application notification
     */
    renderNotification(notification) {
        // TO BE INVESTIGATED. Animation is buggy and not working
        //return (
        //    <ReactCSSTransitionGroup transitionName="bo-essel-notification-transition"
        //                             transitionEnterTimeout={100}
        //                             transitionLeaveTimeout={100}
        //                             component={props => React.Children.toArray(props.children)[0] || null}>
        //        { notification &&
        //            <Notification key="notification" view={this.getNotificationView()} notification={notification}/> }
        //    </ReactCSSTransitionGroup>
        //);
        return notification ?
            <Notification key="notification" view={this.getNotificationView(notification)} notification={notification}/> :
            null;
    }

    /**
     * Render the application container
     * @see Component#render()
     */
    render() {
        const { children, appStore, router, location: { pathname } } = this.props;
        const { sideMenuOn } = this.state;
        const notification = appStore.getNotification();
        const { name, menu, icons } = App.menuConfig;
        const sideMenuProps = {
            router,
            path: pathname != appRoutes.ROOT ? pathname : appRoutes.USERS,
            menu,
            name,
            icons,
            on: sideMenuOn,
            onToggle: on => this.setState({sideMenuOn: on})
        };

        const isSideMenuVisible = this.isSideMenuVisible();
        const containerClasses = { 'bo-essel-app-container': true };
        if (isSideMenuVisible) {
            containerClasses.sideMenuPresent = true;
            containerClasses.sideMenuOn = sideMenuOn;
            containerClasses.sideMenuOff = !sideMenuOn;
        }

        return (
            <div className={classNames(containerClasses)}>
                { isSideMenuVisible && <SideMenu {...sideMenuProps} /> }
                <div className="bo-essel-component-container" >
                    { children }
                    { this.renderNotification(notification) }
                </div>
                <Logout on={!this.isPublicPageActive()} router={router} />
                {/* { this.isDevEnvironment() && <DevTools /> } */}
            </div>
        );
    }
}

export default App;
