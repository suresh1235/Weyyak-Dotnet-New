import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';

import { useStrict } from 'mobx';
import { observer } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';

import AppStore from 'stores/AppStore';
import Transport from 'transport/Transport';
import AppRouter from 'components/AppRouter';

const initializeApplication = () => {
    // The MobX actions have to be explicitly specified
    useStrict(true);

    // Setup and render the application router
    const routerStore = new RouterStore();
    const routerHistory = syncHistoryWithStore(browserHistory, routerStore);

    const appStore = AppStore.getInstance();
    appStore.Router = routerHistory;

    const transport = new Transport(appStore);
    appStore.Transport = transport;

    const appRouterProps = {
        routerStore,
        routerHistory,
        appStore,
        transport
    };
    render(<AppRouter {...appRouterProps} />, document.getElementById('app'));
};

// Initialize and render the application when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApplication);