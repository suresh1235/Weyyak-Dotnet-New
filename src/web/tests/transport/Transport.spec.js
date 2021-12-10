import Transport from 'transport/Transport';
import transportConfig from 'transport/transport.config';
import { httpStatus } from 'transport/httpConstants';
import endpoints from 'transport/endpoints';
import AppStore from 'stores/AppStore';

describe('Unit tests for Transport level component', () => {
    const appStore = AppStore.getInstance();
    const transport = new Transport(appStore);

    it('check refresh token behaviour', () => {
        const stub = sinon.stub();
        window.fetch = stub;

        appStore.setUserAuthToken({
            access_token: '12345',
            refresh_token: '67890'
        });

        const getUsersDetails = transportConfig[endpoints.GET_USERS_DETAILS];
        const authenticate = transportConfig[endpoints.AUTHENTICATE];

        stub.withArgs(getUsersDetails.url).onFirstCall().
            returns(new Promise(resolve => resolve({status: httpStatus.UNAUTHORIZED})));

        var resolvePromise, promise = new Promise(resolve => resolvePromise = resolve) ;
        stub.withArgs(getUsersDetails.url).onSecondCall().returns(
            new Promise(resolve =>
                resolve({
                    status: httpStatus.OK,
                    text: () => { setTimeout(() => resolvePromise(""), 100); return promise; }
            })));

        stub.withArgs(authenticate.url).
            returns(new Promise(resolve => resolve({
                status: httpStatus.OK,
                text: () =>
                    new Promise(resolve => resolve("{\"access_token\": \"67890\",\"refresh_token\": \"12345\"}"))
        })));

        transport.callApi(endpoints.GET_USERS_DETAILS);

        return promise.then(() => {
            assert.isTrue(stub.callCount == 3, 'The refresh token round trip is correct');

            const userAuthToken = appStore.getUserAuthToken();
            assert.isOk(userAuthToken.access_token == '67890' && userAuthToken.refresh_token == '12345',
                'User auth token refreshed');
        });
    });

    //BUG ESSL-347 Multiple requests for a refresh token are issued
    it('check that only one request for a refresh token is issued', (done) => {
        const stub = sinon.stub();
        window.fetch = stub;

        const getUsersDetails = transportConfig[endpoints.GET_USERS_DETAILS];
        const getUsersFilters = transportConfig[endpoints.GET_USERS_FILTERS];
        const authenticate = transportConfig[endpoints.AUTHENTICATE];

        stub.withArgs(getUsersDetails.url).
            returns(new Promise(resolve => resolve({status: httpStatus.UNAUTHORIZED})));
        stub.withArgs(getUsersFilters.url).
            returns(new Promise(resolve => resolve({status: httpStatus.UNAUTHORIZED})));
        stub.withArgs(authenticate.url).returns(new Promise(resolve => resolve({status: httpStatus.OK})));

        transport.callApi(endpoints.GET_USERS_DETAILS);
        transport.callApi(endpoints.GET_USERS_FILTERS);

        setTimeout(() => {
            assert.isTrue(stub.callCount == 3, 'The refresh token round trip is correct');
            done();
        }, 100);
    });
});