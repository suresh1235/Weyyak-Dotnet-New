import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Provider } from 'mobx-react';
import { mount } from 'enzyme';

import Login from 'components/auth/Login';

describe('Unit tests for Login React component', () => {
    var login, promise, resolvePromise;
    const appStore = {
        setUserAuthToken: () => {},
        authenticateUser: () => {setTimeout(() => resolvePromise(), 100); return promise; }
    };
    const router = {
        replace: () => {}
    };
    const spiedAppStore = sinon.spy(appStore, 'authenticateUser');
    const spiedRouter = sinon.spy(router, 'replace');

    beforeEach(() => {
        promise = new Promise((resolve, reject) => resolvePromise = resolve);
        login = mount(
            <Provider appStore={appStore} >
                <Login router={router} location={{}} />
            </Provider>
        );
    });

    afterEach(() => {
        spiedAppStore.reset();
        spiedRouter.reset();
    });

    it('check html markup', () => {
        assert.isOk(login.hasClass('bo-essel-login'), 'Login component is rendered');
        assert.isOk(login.find('.bo-essel-form-validation-wrapper').exists(),
            'Form validation wrapper is present');
    });

    it('check form validations', () => {
        login.find('[type="submit"]').simulate('submit');

        const errors = login.find('.bo-essel-error.error');
        assert.isOk(errors.length == 2, 'Form validations appeared');
        errors.forEach(error => {
            assert.isDefined(error.node.textContent, 'Error content defined');
        });

        assert.isFalse(spiedAppStore.called, 'Authentication call wasn\'t made');
        assert.isFalse(spiedRouter.called, 'User wasn\'t redirected to main page');
    });

    it('check form submission', () => {
        const email = login.find('[name="email"]');
        const password = login.find('[name="password"]');

        email.simulate('change', {target: {name: 'email', value: 'z@z'}});
        password.simulate('change', {target: {name: 'password', value: '123456'}});

        login.find('[type="submit"]').simulate('submit');

        const errors = login.find('.bo-essel-error.error');
        assert.isOk(errors.length == 0, 'No validation errors happened');

        return promise.then(() => {
            assert.isOk(spiedAppStore.calledWithExactly('z@z', '123456'), 'Authentication call made correctly');
            assert.isOk(spiedRouter.calledWithExactly('/'), 'User redirected to main page correctly');
        });
    });
});