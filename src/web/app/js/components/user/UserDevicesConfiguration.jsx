import React, { Component, PropTypes } from 'react';
import { inject } from 'mobx-react';

import { Grid, Row, Col, Button, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import BreadCrumbs from 'components/core/BreadCrumbs';
import Action from 'components/core/Action';
import Notification from 'components/core/Notification';
import FormValidationWrapper from 'components/core/FormValidationWrapper';
import Loader from 'components/core/Loader'

import UserDevicesStore from 'stores/user/UserDevicesStore';

import constants from 'constants/constants';
import appRoutes from 'components/app.routes.config';
import userStyles from 'css/users.less';

/**
 * The class represents user's devices
 */
@inject('appStore')
class UserDevicesConfiguration extends Component {

    /** The component properties */
    static propTypes = {
        route: PropTypes.shape({
            store: PropTypes.instanceOf(UserDevicesStore)
        })
    };

    /** The maximum amount of user's devices*/
    static MAX_USER_DEVICES = 50;

    /**
     * Construct a component
     */
    constructor() {
        super();

        this.breadCrumbs = [
            {name: constants.USERS_MANAGEMENT, path: appRoutes.USERS},
            {name: constants.DEVICES_CONFIGURATION}
        ];
        this.state = { on: false, devices: null };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.sendUpdateNotification = this.sendUpdateNotification.bind(this);
        this.setUserDevices = this.setUserDevices.bind(this);
        this.toggleControls = this.toggleControls.bind(this);
    }

    /**
     * Fetch user's devices on a component mounting
     * @see Component#componentWillMount()
     */
    componentWillMount() {
        const { route: { store } } = this.props;
        store.fetchUserDevices().then(this.setUserDevices);
    }

    /**
     * Set user's devices into a component state
     */
    setUserDevices() {
        const { route: { store } } = this.props;
        this.setState({devices: store.UserDevices || 0});
    }

    /**
     * Handle form submission
     */
    handleSubmit() {
        const { route: { store } } = this.props;
        store.updateUserDevices(this.state.devices).then(this.sendUpdateNotification);
    }

    /**
     * Handle a change of an amount of user's devices
     * @param {Object} event - a change event
     */
    handleInputChange(event) {
        const { target: { value, validity } } = event;
        const devices = validity.valid && value == '' ? 0 : parseInt(value, 10);
        !isNaN(devices) &&
            devices >= 0 && devices <= UserDevicesConfiguration.MAX_USER_DEVICES &&
            this.setState({devices});
    }

    /**
     * Send a notification of that a user's devices were updated
     */
    sendUpdateNotification() {
        this.props.appStore.setNotification(Notification.Notifications.info, constants.UPDATE_NOTIFICATION_MESSAGE);
    }

    /**
     * Toggle a state of controls
     */
    toggleControls() {
        this.setState({on: !this.state.on});
    }

    /**
     * Render form controls
     * @returns {ReactNode} React element
     */
    renderControls() {
        return this.state.on ?
            <FormGroup className="bo-essel-controls">
                <Button bsSize="small" type="submit">Save</Button>
                <Button bsSize="small" onClick={this.toggleControls}>Cancel</Button>
            </FormGroup>
        :
            <ControlLabel className="bo-essel-controls">
                <Action key="updateUserDevices"
                    icon="pencil-square-o"
                    title="Update User Devices"
                    onClick={this.toggleControls}/>
            </ControlLabel>
    }

    /**
     * @see Component#render()
     */
    render() {
        const { router } = this.props;
        const { devices } = this.state;

        return (
            <Grid>
                <Row className="bread-crumbs">
                    <Col>
                        <BreadCrumbs router={router} crumbs={this.breadCrumbs}/>
                    </Col>
                </Row>
                <Row className="main-content">
                    <div className="bo-essel-user-devices">
                        {
                        devices != null &&
                            <FormValidationWrapper>
                                <Form className="bo-essel-form" inline onSubmit={this.handleSubmit}>
                                    <FormGroup bsSize="small">
                                        <ControlLabel>Maximum Number of allowed devices per 1 User:</ControlLabel>
                                        <FormControl name="devices"
                                                     type="number"
                                                     min="0" max={UserDevicesConfiguration.MAX_USER_DEVICES}
                                                     value={devices}
                                                    onChange={this.handleInputChange}/>
                                        { this.renderControls() }
                                    </FormGroup>
                                </Form>
                            </FormValidationWrapper>
                        }
                        { devices == null && <Loader className="bo-essel-loader-center"/> }
                    </div>
                </Row>
            </Grid>
        );
    }
}

export default UserDevicesConfiguration;
