import React, { Component } from 'react';
import { inject } from 'mobx-react';
import { Link } from 'react-router'

import {
    Form,
    FormGroup,
    FormControl,
    Button,
    ButtonGroup,
    Label
} from 'react-bootstrap';

import FormValidationWrapper from 'components/core/FormValidationWrapper';
import appRoutes from 'components/app.routes.config';
import validationMessages from 'validations/validationMessages';
import authStyles from 'css/auth';

/**
 * The class defines a login component
 */
@inject('appStore')
class Login extends Component {

    /**
     * Construct a login component
     * @param {Array} args component's arguments
     */
    constructor(...args) {
        super(...args);

        this.state = {
            email: '',
            password: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleUserRedirect = this.handleUserRedirect.bind(this);
    }

    /**
     * Handle a form submission
     */
    handleSubmit() {
        const { appStore } = this.props;
        const { email, password } = this.state;
        appStore.authenticateUser(email, password).then(this.handleUserRedirect);
    }

    /**
     * Handle a user redirect
     */
    handleUserRedirect() {
        const { router, location: { state } } = this.props;
        const nextPathname = (state && state.nextPathname) || appRoutes.ROOT;
        router.replace(nextPathname);
    }

    /**
     * Handle a change of a controlled input
     * @param {Object} event - an event to be handled
     */
    handleInputChange(event) {
        const { name, value } = event.target;
        this.setState({[name]: value});
    }

    /**
     * Render a login component
     * @see Component#render()
     */
    render() {
        return (
            <div className="bo-essel-login">
                <FormValidationWrapper>
                    <Form className="bo-essel-form" horizontal onSubmit={this.handleSubmit}>
                        <FormGroup className="bo-essel-login-header" controlId="formHeader">
                            <h5><Label bsClass="">Welcome to</Label></h5>
                            <h1><Label bsClass="">Z5 BackOffice</Label></h1>
                            <h5><Label bsClass="">Please login to access the system</Label></h5>
                        </FormGroup>
                        <FormGroup bsSize="lg">
                            <FormControl name="email" type="text" placeholder="Email"
                                         value={this.state.email}
                                         onChange={this.handleInputChange}
                                         validations={[
                                            {name: 'required', customMessage: validationMessages.enterEmail},
                                            {name: 'maxLength', args: [255], msgArgs: [255]},
                                            'email'
                                         ]}
                            />
                        </FormGroup>
                        <FormGroup bsSize="lg">
                            <FormControl name="password" type="password" placeholder="Password"
                                         value={this.state.password}
                                         onChange={this.handleInputChange}
                                         validations={[
                                            {name: 'required', customMessage: validationMessages.enterPassword},
                                            {
                                                name: 'dataInRange',
                                                customMessage: validationMessages.passwordRange,
                                                args: [6, 255],
                                                msgArgs: [6, 255]
                                            }
                                         ]}
                            />
                        </FormGroup>
                        <FormGroup className="bo-essel-login-controls" controlId="formControls">
                            <Link to={appRoutes.RESET_PASSWORD}>
                                Forgot your password?
                            </Link>
                            <Button bsSize="lg" className="pull-right" type="submit">
                                Login
                            </Button>
                        </FormGroup>
                    </Form>
                </FormValidationWrapper>
            </div>
        );
    }
}

export default Login;
