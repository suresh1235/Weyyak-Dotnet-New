import React, {Component} from 'react';
import {inject} from 'mobx-react';

import {
    Form,
    FormGroup,
    FormControl,
    Button,
    Label,
    Grid,
    Row,
    Col
} from 'react-bootstrap';

import FormValidationWrapper from 'components/core/FormValidationWrapper';
import appRoutes from 'components/app.routes.config';
import validationMessages from 'validations/validationMessages';
import BreadCrumbs from 'components/core/BreadCrumbs';
import Notification from 'components/core/Notification';
import classNames from 'classnames';
import authStyles from 'css/auth';
import endpoints from 'transport/endpoints';

/**
 * The class defines a reset password component
 */
@inject('appStore')
class ResetPassword extends Component {
    static defaultProps = {
        defaultTokenQueryParam: 'resetPasswordToken',
        defaultLastBreadcrumb: 'Forgot password',
        defaultResetPasswordFormLabel: 'Reset password'
    };

    /**
     * Construct a reset password component
     * @param {Array} args component's arguments
     */
    constructor(...args) {
        super(...args);
        const [ props ] = args;
        const {
            defaultLastBreadcrumb,
            defaultTokenQueryParam,
            route: {
                tokenQueryParam = defaultTokenQueryParam,
                lastBreadcrumb = defaultLastBreadcrumb
            }, location: {query}
        } = props;

        this.breadCrumbs = [
            {name: 'Login', path: appRoutes.LOGIN},
            {name: lastBreadcrumb}
        ];

        this.state = {
            email: '',
            password: '',
            confirm: ''
        };
        this.isConfirm = (query && query[tokenQueryParam]) ? true : false;

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleResetSubmit = this.handleResetSubmit.bind(this);
        this.handleUpdatePasswordSubmit = this.handleUpdatePasswordSubmit.bind(this);
        this.sendNotification = this.sendNotification.bind(this);
    }

    /**
     * Handle a change of a input value
     * @param {Object} event - a change event
     */
    handleInputChange(event) {
        const {name, value} = event.target;
        this.setState({[name]: value});
    }

    /**
     * Handle reset password form submit
     */
    handleResetSubmit() {
        const {appStore} = this.props;
        appStore.resetPasswordRequest(this.state.email).then(this.validateResponse.bind(this));
    }

    /**
     * Handle update password form submit
     * @returns {boolean}
     */
    handleUpdatePasswordSubmit() {
        const {
            appStore,
            defaultTokenQueryParam,
            router,
            location: {query},
            route: {tokenQueryParam = defaultTokenQueryParam}
        } = this.props;

        if (!query['email'] || !query[tokenQueryParam]) {
            return false;
        }

        const endpoint = (tokenQueryParam == defaultTokenQueryParam) ?
            endpoints.UPDATE_PASSWORD_REQUEST : endpoints.UPDATE_PASSWORD_FIRST_LOGIN;

        const params = query;

        params.password = this.state.password;
        appStore.updatePasswordRequest({...params}, endpoint)
            .then(appStore.authenticateUser.bind(appStore, params.email, params.password))
            .then(router.replace.bind(this, appRoutes.ROOT));
    }

    /**
     * Send a notification
     * @param {String} message - notification message
     * @param {String} type - notification type
     */
    sendNotification(message, type = Notification.Notifications.info) {
        this.props.appStore.setNotification(type, message, null, Notification.Views.base);
    }

    /**
     * determine if user should be instructed after resetting password
     *
     * @param {Object} data - response object
     * @returns {boolean}
     */
    validateResponse() {
        const { router } = this.props;

        router.replace(appRoutes.ROOT);
        this.sendNotification('Email with instructions has been sent to your email address.');
    }

    /**
     * Get form header depending on state
     * @returns {ReactNode} - form header
     */
    renderFormHeader() {
        const {
            defaultResetPasswordFormLabel,
            route: {
                resetPasswordFormLabel = defaultResetPasswordFormLabel
            }
        } = this.props;

        const labels = this.isConfirm ?
            [resetPasswordFormLabel, 'Please enter your password'] :
            ['Forgot Password?', 'Please enter your email address'];

        return (
            <FormGroup className="bo-essel-reset-password-header" controlId="formHeader">
                <h1><Label bsClass="">{labels[0]}</Label></h1>
                <h5><Label bsClass="">{labels[1]}</Label></h5>
            </FormGroup>
        );
    }

    /**
     * Get update password form
     * @returns {ReactNode} - update password form
     */
    renderUpdatePasswordForm() {
        return (
            <Form className="bo-essel-form" horizontal onSubmit={this.handleUpdatePasswordSubmit}>
                {this.renderFormHeader()}
                <FormGroup bsSize="lg">
                    <FormControl id="password" name="password" type="password" placeholder="New password"
                                 value={this.state['password']}
                                 onChange={this.handleInputChange}
                                 validations={[
                                     {name: 'required', customMessage: validationMessages.enterNewPassword},
                                     {
                                         name: 'dataInRange',
                                         customMessage: validationMessages.passwordRange,
                                         args: [6, 255],
                                         msgArgs: [6, 255]
                                     }
                                 ]}
                    />
                </FormGroup>
                <FormGroup bsSize="lg">
                    <FormControl id="password-confirm" name="confirm" type="password" placeholder="New password again"
                                 value={this.state['confirm']}
                                 onChange={this.handleInputChange}
                                 validations={[
                                     {name: 'required', customMessage: validationMessages.confirmNewPassword},
                                     {
                                         name: 'match',
                                         customMessage: validationMessages.passwordMismatch,
                                         args: this.state.password,
                                         msgArgs: ['New password', 'New password again']
                                     }
                                 ]}
                    />
                </FormGroup>
                <FormGroup className="bo-essel-login-controls" controlId="formControls">
                    <Button bsSize="lg" className="pull-right" type="submit">
                        Continue
                    </Button>
                </FormGroup>
            </Form>
        );
    }

    /**
     * Render reset password form
     * @returns {ReactNode} - render a reset password form
     */
    renderResetPasswordForm() {
        return (
            <Form className="bo-essel-form" horizontal onSubmit={this.handleResetSubmit}>
                {this.renderFormHeader()}
                <FormGroup bsSize="lg">
                    <FormControl name="email" type="text" placeholder="Email"
                                 value={this.state['email']}
                                 onChange={this.handleInputChange}
                                 validations={[
                                     {name: 'required', customMessage: validationMessages.enterEmail},
                                     {name: 'maxLength', args: [255], msgArgs: [255]},
                                     'email'
                                 ]}
                    />
                </FormGroup>
                <FormGroup className="bo-essel-login-controls" controlId="formControls">
                    <Button bsSize="lg" className="pull-right" type="submit">
                        Continue
                    </Button>
                </FormGroup>
            </Form>
        )
    }

    /**
     * Render a form
     * @returns {ReactNode} React element
     */
    renderForm() {
        return this.isConfirm ? this.renderUpdatePasswordForm() : this.renderResetPasswordForm();
    }

    /**
     * Render a reset password component
     * @see Component#render()
     */
    render() {
        const { router } = this.props;

        return (
            <Grid className="bo-essel-reset-password-container">
                <Row>
                    <Col className="col" xs={12} md={8}>
                        <BreadCrumbs className router={router} crumbs={this.breadCrumbs}/>
                    </Col>
                </Row>
                <Row>
                    <div className="bo-essel-reset-password">
                        <FormValidationWrapper>
                            { this.renderForm() }
                        </FormValidationWrapper>
                    </div>
                </Row>
            </Grid>
        );
    }
}

export default ResetPassword;
