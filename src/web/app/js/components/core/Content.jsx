import React, { Component, PropTypes } from 'react';
import { Button, Form, Grid, Row, Col } from 'react-bootstrap';
import BreadCrumbs from 'components/core/BreadCrumbs';
import { MultiTierContentFields } from 'constants/contentFields';
import FormValidationWrapper from 'components/core/FormValidationWrapper';
import CancelPopup from 'components/core/CancelPopup';
import Confirm from 'components/core/Confirm';
import { isSaveDraft, removeDataSaveDraftAttr, addDataSaveDraftAttr, sendUpdateNotification } from 'components/core/Utils';
import constants from 'constants/constants';

/**
 * The class represents content form component
 */
class Content extends Component {

    /** The component properties */
    static propTypes = {
        router: PropTypes.shape().isRequired,
        breadCrumbs: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired
        })).isRequired,
        name: PropTypes.string.isRequired,
        isPublished: PropTypes.bool,
        validationsFormPerType: PropTypes.arrayOf(PropTypes.string),
        onPublish: PropTypes.func,
        onSaveDraft: PropTypes.func,
        saveButtonText: PropTypes.string,
        onCancel: PropTypes.func.isRequired
    };

    /**
     * Construct a content form component
     * @param {Array} props component's arguments
     */
    constructor(props) {
        super(props);

        this.state = {
            cancelPopup: {
                show: false,
            },
            saveDraftPopup: {
                show: false
            }
        };
        this.handleSaveDraftPopup = this.handleSaveDraftPopup.bind(this);
        this.handleDraftPopup = this.handleDraftPopup.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleCancelPopup = this.handleCancelPopup.bind(this);
        this.handleCancelSaveDraftPopup = this.handleCancelSaveDraftPopup.bind(this);
        this.handleConfirmCancelPopup = this.handleConfirmCancelPopup.bind(this);

    }

    /**
     * Submit handler
     */
    handleSubmit(event) {
        const { onPublish } = this.props;

        if (isSaveDraft(event.currentTarget)) {
            this.handleDraftPopup();
        }
        else {
            onPublish && onPublish();
        }
    }

    /**
     * Cancel content title creating or editing handler
     */
    handleCancel() {
        this.setState({
            cancelPopup: {
                show: true
            }
        });
    }

    /**
     * Save draft popup handler
     */
    handleSaveDraftPopup() {
        const { onSaveDraft } = this.props;

        this.setState({
            saveDraftPopup: {
                show: false
            }
        });
        onSaveDraft && onSaveDraft();
    }

    /**
     * Publish content handler whether content is published
     */
    handleDraftPopup() {
        const { onSaveDraft, isPublished } = this.props;

        if (isPublished) {
            this.setState({
                saveDraftPopup: {
                    show: true
                }
            });
        }
        else {
            onSaveDraft && onSaveDraft();
        }
    }

    /**
     * Popup cancel handler
     */
    handleCancelPopup() {
        this.setState({
            cancelPopup: {
                show: false
            }
        });
    }

    /**
     * Cancel save draft popup handler
     */
    handleCancelSaveDraftPopup() {
        this.setState({
            saveDraftPopup: {
                show: false
            }
        })
    }

    /**
     * Popup confirm handler
     */
    handleConfirmCancelPopup() {
        const { onCancel } = this.props;
        this.setState({
            cancelPopup: {
                show: false
            }
        });
        onCancel && onCancel();
    }

    /**
     * Render cancel confirmation popup
     * @returns {ReactNode} popup node
     */
    renderCancelPopupView(name) {
        return (
            <CancelPopup
                key={`${name}cancel`}
                onConfirm={this.handleConfirmCancelPopup}
                onClose={this.handleCancelPopup}
                visible={this.state.cancelPopup.show}
            />
        );
    }

    /**
     * Render confirm popup
     */
    renderSaveDraftPopup(name) {
        return (
            <Confirm
                key={`${name}confirm`}
                onConfirm={this.handleSaveDraftPopup}
                onClose={this.handleCancelSaveDraftPopup}
                body={constants.POPUPS.SAVE_DRAFT.BODY}
                visible={this.state.saveDraftPopup.show}
                cancelText={constants.POPUPS.SHARED.CANCEL}
                confirmText={constants.POPUPS.SHARED.CONFIRM}
                title={constants.POPUPS.SAVE_DRAFT.TITLE}
            />
        );
    }

    /**
     * @see Component#render()
     */
    render() {
        const { router, breadCrumbs, children, name, validationsFormPerType, saveButtonText } = this.props;

        return (
            <Grid>
                <Row className="bread-crumbs custom-padding">
                    <Col>
                        <BreadCrumbs router={router} crumbs={breadCrumbs}/>
                    </Col>
                </Row>
                <Row className="main-content">
                    <FormValidationWrapper ref={wrapper =>
                            this.form = (wrapper && wrapper.wrappedInstance) ?
                                wrapper.wrappedInstance.refs[name] :
                                null
                        }>
                            {
                                saveButtonText ?
                                    (
                                        <Form
                                            id={name}
                                            className="bo-essel-form"
                                            reference={name}
                                            onSubmit={this.handleSubmit}
                                            validationsFormPerType={validationsFormPerType}>
                                            { children }
                                            <div className="text-right">
                                                <Button
                                                    type="submit"
                                                    className="save-draft-button orange-button"
                                                    onClick={() => removeDataSaveDraftAttr(this.form)}>
                                                    { saveButtonText }
                                                </Button>
                                                <Button className="cancel-button" onClick={this.handleCancel}>Cancel</Button>
                                            </div>
                                            {this.renderCancelPopupView(name)}
                                            {this.renderSaveDraftPopup(name)}
                                        </Form>
                                    ) :
                                    (
                                        <Form
                                            id={name}
                                            className="bo-essel-form"
                                            reference={name}
                                            onSubmit={this.handleSubmit}
                                            validationsFormPerType={validationsFormPerType}>
                                            { children }
                                            <Button
                                                type="submit"
                                                bsStyle="success"
                                                className="publish-button"
                                                onClick={() => removeDataSaveDraftAttr(this.form)}>
                                                Publish
                                            </Button>
                                            <div className="text-right">
                                                <Button
                                                    type="submit"
                                                    className="save-draft-button"
                                                    onClick={() => addDataSaveDraftAttr(this.form)}>
                                                    Save draft
                                                </Button>
                                                <Button className="cancel-button" onClick={this.handleCancel}>Cancel</Button>
                                            </div>
                                            {this.renderCancelPopupView(name)}
                                            {this.renderSaveDraftPopup(name)}
                                        </Form>
                                    )
                            }
                    </FormValidationWrapper>
                </Row>
            </Grid>
        );
    }
}

export default Content
