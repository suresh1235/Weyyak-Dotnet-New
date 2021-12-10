import React, { Component } from 'react';

import { Provider } from 'mobx-react';
import { Router, Route, IndexRoute } from 'react-router';
import { scrollUp } from 'components/core/Utils';

import appRoutes from './app.routes.config';

import App from 'components/App';
import Login from 'components/auth/Login';
import ResetPassword from 'components/auth/ResetPassword'
import UsersDetails from 'components/user/UsersDetails';
import UserDevicesConfiguration from 'components/user/UserDevicesConfiguration';
import EditorsList from 'components/editor/EditorsList';
import ManageContent from 'components/content/ManageContent';
import ContentManagement from 'components/content/ContentManagement';
import MultiTierContentTitle from 'components/content/MultiTierContentTitle';
import MultiTierContentSeason from 'components/content/MultiTierContentSeason';
import MultiTierContentEpisode from 'components/content/MultiTierContentEpisode';
import MultiTierContentManagementTitle from 'components/content/MultiTierContentManagementTitle';
import MultiTierContentManagementSeason from 'components/content/MultiTierContentManagementSeason';
import MultiTierContentManagementEpisode from 'components/content/MultiTierContentManagementEpisode';
import DemoSearch from 'components/demosearch/DemoSearch';

import PagesManagement from 'components/sitemanagement/PagesManagement';
import PageConstructorMode from "components/sitemanagement/PageConstructorMode";
import PlaylistsManagement from 'components/sitemanagement/PlaylistsManagement';
import PlaylistConstructorMode from 'components/sitemanagement/PlaylistConstructorMode';
import SlidersManagement from 'components/sitemanagement/SlidersManagement';
import SliderConstructorMode from 'components/sitemanagement/SliderConstructorMode';

import NotFound from 'components/auth/NotFound';

import UsersDetailsStore from 'stores/user/UsersDetailsStore';
import UserDevicesStore from 'stores/user/UserDevicesStore';
import EditorsStore from 'stores/editor/EditorsStore';
import OneTierContentStore from 'stores/content/OneTierContentStore';
import ManageContentStore from 'stores/content/ManageContentStore';
import MultiTierContentStore from 'stores/content/MultiTierContentStore';
import DemoSearchStore from 'stores/demosearch/DemoSearchStore';

import PagesManagementStore from 'stores/sitemanagement/PagesManagementStore';
import PageConstructorStore from 'stores/sitemanagement/PageConstructorStore';
import PlaylistsManagementStore from 'stores/sitemanagement/PlaylistsManagementStore';
import PlaylistConstructorStore from 'stores/sitemanagement/PlaylistConstructorStore';
import SlidersManagementStore from 'stores/sitemanagement/SlidersManagementStore';
import SliderConstructorStore from 'stores/sitemanagement/SliderConstructorStore';


/**
 * The component defines all application routes
 */
class AppRouter extends Component {

    /** The application stores */
    static stores = [
        { property: 'usersDetailsStore', class: UsersDetailsStore },
        { property: 'userDevicesStore', class: UserDevicesStore },
        { property: 'editorsStore', class: EditorsStore },
        { property: 'oneTierContentStore', class: OneTierContentStore },
        { property: 'manageContentStore', class: ManageContentStore },
        { property: 'multiTierContentStore', class: MultiTierContentStore },
        { property: 'demoSearchStore', class: DemoSearchStore },
        { property: 'pagesManagementStore', class: PagesManagementStore },
        { property: 'pageConstructorStore', class: PageConstructorStore },
        { property: 'playlistsManagementStore', class: PlaylistsManagementStore },
        { property: 'playlistConstructorStore', class: PlaylistConstructorStore },
        { property: 'slidersManagementStore', class: SlidersManagementStore },
        { property: 'sliderConstructorStore', class: SliderConstructorStore },
    ];

    /**
     * Construct an application router
     */
    constructor(...args) {
        super(...args);

        this.createStores();

        this.handleRouteAccess = this.handleRouteAccess.bind(this);
    }

    /**
     * Create stores
     */
    createStores() {
        const { transport } = this.props;
        AppRouter.stores.forEach(store => this[store.property] = new store.class(transport));
    }

    /**
     * Handle an access to an application route
     * @param {Object} nextState a router state
     * @param {Function} replace a router replace function
     */
    handleRouteAccess(nextState, replace) {
        const { appStore } = this.props;
        !appStore.isUserAuthenticated() && replace({
            pathname: appRoutes.LOGIN,
            state: { nextPathname: nextState.location.pathname }
        });
    }

    /**
     * Render an application router
     * @see Component#render()
     */
    render() {
        const { routerStore, appStore, routerHistory } = this.props;
        const { title, season, episode } = this.multiTierContentStore;
        routerHistory.listen(() => appStore.clearErrorMessages());
        return (
              <Provider {...{routerStore, appStore}}>
                     <Router history={routerHistory} onUpdate={() => scrollUp()}>
                            <Route path={appRoutes.ROOT} component={App}>
                                   <IndexRoute component={UsersDetails}
                                          onEnter={this.handleRouteAccess}
                                          store={this.usersDetailsStore}
                                   />
                                   <Route path={appRoutes.LOGIN} component={Login}/>
                                   <Route path={appRoutes.RESET_PASSWORD} component={ResetPassword}/>
                                   <Route path={appRoutes.PASSWORD}
                                          component={ResetPassword}
                                          tokenQueryParam="token"
                                          resetPasswordFormLabel="Password setup"
                                          lastBreadcrumb="Password setup"
                                   />
                                   <Route path={appRoutes.USERS}
                                          component={UsersDetails}
                                          onEnter={this.handleRouteAccess}
                                          store={this.usersDetailsStore}/>
                                   <Route path={appRoutes.DEVICES}
                                          component={UserDevicesConfiguration}
                                          onEnter={this.handleRouteAccess}
                                          store={this.userDevicesStore}/>
                                   <Route path={appRoutes.EDITORS}
                                          component={EditorsList}
                                          onEnter={this.handleRouteAccess}
                                          store={this.editorsStore}/>
                                   <Route path={appRoutes.ONE_TIER_CONTENT}
                                          component={ContentManagement}
                                          onEnter={this.handleRouteAccess}
                                          store={this.oneTierContentStore}
                                          mode={ContentManagement.mode.CREATE_CONTENT}
                                   />
                                   <Route path={appRoutes.ADD_VARIANCE}
                                          component={ContentManagement}
                                          onEnter={this.handleRouteAccess}
                                          store={this.oneTierContentStore}
                                          mode={ContentManagement.mode.ADD_VARIANCE}
                                   />
                                   <Route path={appRoutes.EDIT_ONE_TIER_CONTENT}
                                          component={ContentManagement}
                                          onEnter={this.handleRouteAccess}
                                          store={this.oneTierContentStore}
                                          mode={ContentManagement.mode.EDIT_CONTENT_MODE}
                                          />
                                   <Route path={appRoutes.EDIT_VARIANCE}
                                          component={ContentManagement}
                                          onEnter={this.handleRouteAccess}
                                          store={this.oneTierContentStore}
                                          mode={ContentManagement.mode.EDIT_CONTENT_MODE}
                                          />
                                   <Route path={appRoutes.MANAGE_CONTENT}
                                          component={ManageContent}
                                          onEnter={this.handleRouteAccess}
                                          store={this.manageContentStore}
                                          />

                                   {/* <Route path={appRoutes.SEARCH_DEMO}
                                          component={DemoSearch}
                                          onEnter={this.handleRouteAccess}
                                          store={this.demoSearchStore}
                                          /> */}

                                   <Route path={appRoutes.MULTI_TIER_CONTENT_TITLE}
                                          component={MultiTierContentTitle}
                                          onEnter={this.handleRouteAccess}
                                          store={title} />
                                   <Route path={appRoutes.EDIT_TITLE}
                                          component={MultiTierContentManagementTitle}
                                          onEnter={this.handleRouteAccess}
                                          store={title} />
                                   <Route path={appRoutes.MULTI_TIER_CONTENT_SEASON}
                                          component={MultiTierContentSeason}
                                          onEnter={this.handleRouteAccess}
                                          store={season} />
                                   <Route path={appRoutes.MULTI_TIER_CONTENT_SEASON_VARIANCE}
                                          component={MultiTierContentSeason}
                                          onEnter={this.handleRouteAccess}
                                          store={season} />

                                   <Route path={appRoutes.ADD_SEASON}
                                          component={MultiTierContentManagementSeason}
                                          onEnter={this.handleRouteAccess}
                                          store={season} />
                                   <Route path={appRoutes.EDIT_SEASON}
                                          component={MultiTierContentManagementSeason}
                                          onEnter={this.handleRouteAccess}
                                          store={season} />
                                   <Route path={appRoutes.EDIT_SEASON_VARIANCE}
                                          component={MultiTierContentManagementSeason}
                                          onEnter={this.handleRouteAccess}
                                          store={season} />
                                   <Route path={appRoutes.MULTI_TIER_CONTENT_EPISODE}
                                          component={MultiTierContentEpisode}
                                          onEnter={this.handleRouteAccess}
                                          store={episode} />
                                   <Route path={appRoutes.ADD_EPISODE}
                                          component={MultiTierContentManagementEpisode}
                                          onEnter={this.handleRouteAccess}
                                          store={episode}
                                          />
                                   <Route path={appRoutes.EDIT_EPISODE}
                                          component={MultiTierContentManagementEpisode}
                                          onEnter={this.handleRouteAccess}
                                          store={episode}
                                          />

                                   <Route path={appRoutes.PAGES_MANAGEMENT}
                                          component={PagesManagement}
                                          onEnter={this.handleRouteAccess}
                                          store={this.pagesManagementStore}
                                          />
                                   <Route path={appRoutes.CREATE_PAGE}
                                          component={PageConstructorMode}
                                          onEnter={this.handleRouteAccess}
                                          store={this.pageConstructorStore}
                                          />
                                   <Route path={appRoutes.EDIT_PAGE}
                                          component={PageConstructorMode}
                                          onEnter={this.handleRouteAccess}
                                          store={this.pageConstructorStore}
                                   />
                                   <Route path={appRoutes.PLAYLISTS_MANAGEMENT}
                                          component={PlaylistsManagement}
                                          onEnter={this.handleRouteAccess}
                                          store={this.playlistsManagementStore}
                                          />
                                   <Route path={appRoutes.CREATE_PLAYLIST}
                                          component={PlaylistConstructorMode}
                                          onEnter={this.handleRouteAccess}
                                          store={this.playlistConstructorStore}
                                          />
                                   <Route path={appRoutes.EDIT_PLAYLIST}
                                          component={PlaylistConstructorMode}
                                          onEnter={this.handleRouteAccess}
                                          store={this.playlistConstructorStore}
                                          />
                                   <Route path={appRoutes.SLIDERS_MANAGEMENT}
                                          component={SlidersManagement}
                                          onEnter={this.handleRouteAccess}
                                          store={this.slidersManagementStore}
                                          />
                                   <Route path={appRoutes.CREATE_SLIDER}
                                          component={SliderConstructorMode}
                                          onEnter={this.handleRouteAccess}
                                          store={this.sliderConstructorStore}
                                          />
                                   <Route path={appRoutes.EDIT_SLIDER}
                                          component={SliderConstructorMode}
                                          onEnter={this.handleRouteAccess}
                                          store={this.sliderConstructorStore}
                                          />

                       <Route path={appRoutes.NOT_FOUND} component={NotFound} />
                    </Route>
                </Router>
            </Provider>
        );
    }
}

export default AppRouter;
