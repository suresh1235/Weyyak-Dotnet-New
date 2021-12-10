import React, { Component, PropTypes } from 'react';
import { inject } from 'mobx-react';

import { OverlayTrigger, Popover, Button } from 'react-bootstrap';

import notificationStyles from 'css/notification';
import validationMessages from 'validations/validationMessages';


/**
 * The class represents a generic mechanism for showing different kinds of notifications
 */
@inject('appStore')
class Notification extends Component {

    /** The component's properties */
    static propTypes = {
        notification: PropTypes.shape({
            type: PropTypes.oneOf(['info', 'warning', 'error']),
            message: PropTypes.string.isRequired,
            data: PropTypes.shape({
                name: PropTypes.string,
                details: PropTypes.objectOf(PropTypes.string)
            })
        }).isRequired,
        view: PropTypes.oneOf(['raw', 'base']),
        appStore: PropTypes.object.isRequired
    };

    /** The default properties' values */
    static defaultProps = {
        view: 'base'
    };

    /** The notification types */
    static Notifications = {
        info: {
            type: 'info',
            message: 'Info'
        },
        warning: {
            type: 'warning',
            message: 'Warning'
        },
        error: {
            type: 'error',
            message: 'Server error occurred. Please try to reload the page.'
        },
        validation: {
            type: 'error',
            message: 'Validation error occurred. Please check the details.'
        },
        success: {
            type:'success',
            message:"Publishing. Please wait for some time."

        }
    };

    /** The notification views */
    static Views = {
        raw: 'raw',
        base: 'base'
    };

    /** The notification icons */
    static Icons = {
        info: 'info-circle',
        warning: 'exclamation-circle',
        error: 'times-circle'
    };

    /** The close notification timeout */
    static CLOSE_TIMEOUT = 3000;

    /**
     * Construct a notification component
     */
    constructor() {
        super();

        this.handleClose = this.handleClose.bind(this);
    }

    /**
     * Check if a notification has a base view
     * @param {String} view - a type of a notification view
     * @returns {Boolean} true if a notification has a base view otherwise false
     */
    isBaseView(view) {
        return view == Notification.Views.base;
    }

    /**
     * Handle a notification close event
     */
    handleClose() {
        this.props.appStore.setNotification(null);
    }

    /**
     * Render a notification icon
     * @param {String} view - a notification view
     * @param {String} type - a notification type
     */
    renderNotificationIcon(view, type) {
        return this.isBaseView(view) ?
            <i className={`bo-essel-notification-icon fa fa-${Notification.Icons[type]} fa-2x`}/> :
            null;
    }

    /**
     * Render a notification marker
     * @param {String} view - a notification view
     */
    renderNotificationMarker(view) {
        return this.isBaseView(view) ? <div className="bo-essel-notification-marker" /> : null;
    }

    /**
     * Render a notification message
     * @param {String} view - a notification view
     * @param {String} message - a notification message
     */
    renderNotificationMessage(view, message) {
        return this.isBaseView(view) ? <span>{message}</span> : null;
    }


    /**
     * Render a notification close
     * @param {String} view - a notification view
     * @param {String} type - a notification type
     */
    renderNotificationCloseElement(view, type) {
        if (this.isBaseView(view)) {
            if (type != Notification.Notifications.info.type) {
                return <span className="bo-essel-notification-close" onClick={this.handleClose}>×</span>;
            }
            setTimeout(this.handleClose, Notification.CLOSE_TIMEOUT);
        }
        return null;
    }

    /**
     * Render notification's details
     * @param {String} view - a notification view
     * @param {Object} data - a notification data
     */
    renderDetails(view, data) {
        const { name, details } = data;
        const notificationData =
            <div className="bo-essel-server-details">
                <div>{name}</div>
                { details && details.map((detail, index) => <div key={index}>{detail}</div>)}
            </div>;
        return this.isBaseView(view) ?
            <OverlayTrigger trigger={['hover', 'focus']}
                            placement="bottom"
                            overlay={
                                <Popover id="bo-essel-notification-details-id"
                                         title="Details">
                                    {notificationData}
                                </Popover>
                            }>
                <Button className="bo-essel-notification-details-link" bsStyle="link">Details</Button>
            </OverlayTrigger> :
            notificationData;
    }

    /**
     * @see Component#render()
     */
    render() {
        console.log(this.props)
        const { notification: { type, message, data }, view } = this.props;
        return (
            <div className={`bo-essel-notification ${view} ${type}`}>
                { this.renderNotificationMarker(view) }
                { this.renderNotificationIcon(view, type) }
                { this.renderNotificationMessage(view, message) }
                { data && this.renderDetails(view, data) }
                { this.renderNotificationCloseElement(view, type) }
            </div>
        );
    }
}

export default Notification;
