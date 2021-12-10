import React, {Component, PropTypes} from 'react';
import { Button, Modal } from 'react-bootstrap';

/**
 * Class shows confirm dialog
 */
class Confirm extends Component {
    /** The component properties */
    static propTypes = {
        body: PropTypes.node.isRequired,
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
        cancelText: 'Cancel',
        confirmText: 'Confirm',
        confirmClassName: '',
        cancelClassName: '',
        title: 'Confirm Please'
    };

    /** The component constructor */
    constructor(...args) {
        super(...args);
        this.onConfirm = this.onConfirm.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    /** Handle dialog close */
    onClose() {
        this.props.onClose()
    }

    /** Handle dialog confirmation */
    onConfirm() {
        this.props.onConfirm();
    }

    /**
     * @see Component#render()
     */
    render() {
        const {visible, cancelClassName, confirmClassName, cancelText, confirmText, title, body} = this.props;

        return (
            <Modal className="bo-essel-modal" show={visible} onHide={this.onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {body}
                </Modal.Body>
                <Modal.Footer>
                    {cancelText ? <Button className={cancelClassName} onClick={this.onClose}>{cancelText}</Button> : ''}
                    <Button
                        type="submit"
                        className={confirmClassName}
                        onClick={this.onConfirm}
                    >
                        <label>{confirmText}</label>
                    </Button>
                </Modal.Footer>
            </Modal>
        );

    }
}

export default Confirm;