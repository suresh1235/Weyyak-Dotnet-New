import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { mount } from 'enzyme';
import { Provider } from 'mobx-react';

import UsersDetails from 'components/user/UsersDetails';

const testData = [{
    "firstName": "firstName",
    "lastName": "lastName",
    "status": "status",
    "country": "country",
    "registrationDate": "2016-03-09T00:00:00Z",
    "emailAddress": "email@com",
    "tailoredGenres": "tg",
    "activeDevices": "wegf",
    "numberOfActiveDevices": "aerg",
    "language": "qeh",
    "newsletter": "bertbae",
    "promotions": "eb3",
    "source": "srhtw"
}];

describe('Unit tests for UsersDetails React component', () => {
    var usersDetails, promise, resolvePromise;
    const usersDetailsStore = {
        getUsersDetails: () => testData,
        setUserAuthToken: () => {},
        fetchUsersFilters: () => {},
        getUsersFilters: () => {},
        fetchUsersDetails: () => { setTimeout(() => resolvePromise(testData), 100); return promise; }
    };
    const spiedStore = sinon.spy(usersDetailsStore, 'fetchUsersDetails');

    beforeEach(() => {
        promise = new Promise((resolve, reject) => resolvePromise = resolve);
        usersDetails = mount(
            <Provider appStore={{ setNotification: () => {}}}>
                <UsersDetails route={{store: usersDetailsStore}} />
            </Provider>);
    });

    afterEach(() => {
        spiedStore.reset();
    });

    it('check html markup', () => {
        const pageTable = usersDetails.find('.bo-essel-page-table.default');
        assert.isOk(pageTable.exists(), 'The users details page rendered');

        return promise.then(() => {
            assert.isTrue(spiedStore.called, 'Fetch users details call made correctly');
        });
    });
});