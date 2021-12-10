import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import {Provider} from 'mobx-react';
import {mount} from 'enzyme';
import {httpStatus} from 'transport/httpConstants';

import ResetPassword from 'components/auth/ResetPassword';

describe('Unit tests for Reset password React component', () => {
    var reset, promise, resolvePromise;
    const appStore = {
        resetPasswordRequest: (email) => {
            setTimeout(() => resolvePromise(), 100);
            return promise;
        },
        setNotification: () => {
        }
    };
    const router = {
        replace: () => {
        }
    };

    const route = {};
    const appStoreSpy = sinon.spy(appStore, 'resetPasswordRequest');
    const routerSpy = sinon.spy(router, 'replace');

    beforeEach(() => {
        promise = new Promise((resolve, reject) => resolvePromise = resolve);
        reset = mount(
            <Provider appStore={appStore}>
                <ResetPassword route={route} router={router} location={{query: {}}}/>
            </Provider>
        );
    });

    afterEach(() => {
        appStoreSpy.reset();
        routerSpy.reset();
    });

    it('check html markup', () => {
        assert.isOk(reset.find('.bo-essel-form-validation-wrapper').exists(),
            'Form validation wrapper is present');
        assert.isOk(reset.find('.bo-essel-reset-password').exists(),
            'Form is present');
    });

    it('check form validations', () => {
        reset.find('[type="submit"]').simulate('submit');

        const errors = reset.find('.bo-essel-error.error');
        assert.isOk(errors.length == 1, 'Form validations appeared');
        errors.forEach(error => {
            assert.isDefined(error.node.textContent, 'Error content defined');
        });

        assert.isFalse(appStoreSpy.called, 'Reset password call was not made');
    });

    it('check form submission', () => {
        const email = reset.find('[name="email"]');

        email.simulate('change', {target: {name: 'email', value: 'test@test.com'}});

        reset.find('[type="submit"]').simulate('submit');

        const errors = reset.find('.bo-essel-error.error');
        assert.isOk(errors.length == 0, 'No validation errors happened');

        return promise.then(() => {
            assert.isOk(appStoreSpy.calledWithExactly('test@test.com'), 'Reset password made correctly');
            assert.isOk(routerSpy.calledWithExactly('/'), 'User redirected to main page correctly');
        });
    });
});

describe('Unit tests for ResetPassword React component at update step', () => {
    var reset, promise, resolvePromise;
    const appStore = {
        setUserAuthToken: () => {
        },
        updatePasswordRequest: () => {
            setTimeout(() => resolvePromise(), 100);
            return promise;
        },
        authenticateUser: () => {
            setTimeout(() => resolvePromise(), 100);
            return promise;
        },
    };

    const router = {
        replace: () => {
        }
    };
    const route = {};

    const updatePasswordSpy = sinon.spy(appStore, 'updatePasswordRequest');
    const authenticateUserSpy = sinon.spy(appStore, 'authenticateUser');
    const setUserAuthTokenSpy = sinon.spy(appStore, 'setUserAuthToken');
    const routerSpy = sinon.spy(router, 'replace');

    beforeEach(() => {
        promise = new Promise((resolve, reject) => resolvePromise = resolve);
        reset = mount(
            <Provider appStore={appStore}>
                <ResetPassword
                    route={route}
                    router={router}
                    location={{query: {email: 'email@email.com', resetPasswordToken: '21232'}}}/>
            </Provider>
        );
    });

    afterEach(() => {
        updatePasswordSpy.reset();
        authenticateUserSpy.reset();
        setUserAuthTokenSpy.reset();
        routerSpy.reset();
    });

    it('check html markup', () => {
        assert.isOk(reset.find('.bo-essel-form-validation-wrapper').exists(),
            'Form validation wrapper is present');
        assert.isOk(reset.find('.bo-essel-reset-password').exists(),
            'Form is present');
    });

    it('check form validations - required', () => {
        reset.find('[type="submit"]').simulate('submit');

        const errors = reset.find('.bo-essel-error.error');
        assert.isOk(errors.length == 2, 'Form validations appeared');

        errors.forEach(error => {
            assert.isDefined(error.node.textContent, 'Error content defined');
        });

        assert.isFalse(updatePasswordSpy.called, 'Reset password call was not made');
        assert.isFalse(routerSpy.called, 'No redirection made');
    });

    it('check form validations - dataInRange and match', () => {
        const password = reset.find('[name="password"]');
        const confirm = reset.find('[name="confirm"]');

        password.simulate('change', {target: {name: 'password', value: '1231'}});
        confirm.simulate('change', {target: {name: 'confirm', value: '12312'}});
        reset.find('[type="submit"]').simulate('submit');

        const errors = reset.find('.bo-essel-error.error');
        assert.isOk(errors.length == 2, 'Validation rejected');
        assert.isFalse(updatePasswordSpy.called, 'Reset password call was not made');
    });

    it('check form submission positive', () => {
        const password = reset.find('[name="password"]');
        const confirm = reset.find('[name="confirm"]');

        password.simulate('change', {target: {name: 'password', value: '123123'}});
        confirm.simulate('change', {target: {name: 'confirm', value: '123123'}});
        reset.find('[type="submit"]').simulate('submit');
        const errors = reset.find('.bo-essel-error.error');
        assert.isOk(errors.length == 0, 'No validation errors happened');

        return promise.then(() => {
            assert.isOk(updatePasswordSpy.calledWithExactly(
                {
                    email: 'email@email.com',
                    resetPasswordToken: '21232',
                    password: '123123'
                },
                'updatePasswordRequest'
            ), 'Update password made correctly');

            assert.isOk(updatePasswordSpy.calledBefore(authenticateUserSpy), 'The order of authenticate call is right');
            assert.isOk(authenticateUserSpy.called, 'Authentication called');
        });
    });
});