import React, { Component, PropTypes } from 'react';
import Confirm from 'components/core/Confirm';
import constants from 'constants/constants'

/**
 * Class shows cancel popup dialog
 */
class CancelPopup extends Component {
    /** The component properties */
    static propTypes = {
        body: PropTypes.node,
        confirmText: PropTypes.node,
        cancelText: PropTypes.node,
        confirmClassName: PropTypes.string,
        cancelClassName: PropTypes.string,
        onConfirm: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        visible: React.PropTypes.bool,
        title: React.PropTypes.node
    };

    /** The component default properties */
    static defaultProps = {
        cancelText: constants.POPUPS.SHARED.CANCEL,
        confirmText: constants.POPUPS.SHARED.CONFIRM,
        title: constants.POPUPS.CANCEL.TITLE,
        body: constants.POPUPS.CANCEL.BODY
    };

    /**
     * @see Component#render()
     */
    render() {
        const { visible, cancelClassName, confirmClassName,
            cancelText, confirmText, title, body, onClose, onConfirm} = this.props;

        return (
            <Confirm
                key="cancel"
                onConfirm={onConfirm}
                onClose={onClose}
                body={body}
                visible={visible}
                cancelText={cancelText}
                confirmText={confirmText}
                title={title}
                cancelClassName={cancelClassName}
                confirmClassName={confirmClassName}
            />
        );

    }
}

export default CancelPopup