import React, {Component, PropTypes} from 'react';
import {observer, inject} from 'mobx-react';
import {Grid, Row, Col, Modal, Button} from 'react-bootstrap';

import EditorsStore from 'stores/editor/EditorsStore';

import BreadCrumbs from 'components/core/BreadCrumbs';
import PageTable from 'components/core/PageTable';
import Action from 'components/core/Action';
import Notification from 'components/core/Notification';
import EditEditor from 'components/editor/EditEditor';
import Confirm from 'components/core/Confirm'

import classNames from 'classnames';
import constants from 'constants/constants';
import appRoutes from 'components/app.routes.config';
import editorsStyles from 'css/editors.less';

/**
 * The class represents editors and their details
 */
@inject('appStore')
@observer
class EditorsList extends Component {

    /** The component properties */
    static propTypes = {
        route: PropTypes.shape({
            store: PropTypes.instanceOf(EditorsStore)
        })
    };

    /**
     * Construct a component
     * @param args - component arguments
     */
    constructor(...args) {
        super(...args);

        const [props] = args;
        const {route: {store, store: {fetchEditors, getEditors}}} = props;

        this.state = {
            editEditorsView: {
                on: false,
                editorData: {}
            },
            confirm: {
                isShowConfirmation: false,
                editor: {}
            }
        };

        this.editorsListLayout = {
            columns: [
                {
                    name: 'First Name',
                    key: 'firstName'
                },
                {
                    name: 'Last Name',
                    key: 'lastName'
                },
                {
                    name: 'User Name',
                    key: 'email'
                },
                {
                    name: 'Role',
                    key: 'userRole'
                },
                {
                    name: 'Actions',
                    key: 'actions',
                    actions: item => {
                        return [
                            <Action key="editEditor"
                                    icon="pencil-square-o"
                                    title="Edit User"
                                    onClick={this.toggleEditEditorsView.bind(this, item)}/>,
                            <Action key="deleteEditor"
                                    icon="trash"
                                    title="Delete"
                                    className={classNames({'bo-essel-action-disabled': !item.allowDelete})}
                                    onClick={this.showConfirm.bind(this, item)}/>
                        ];
                    }
                }
            ]
        };

        this.editorsFilters = [
            {
                name: 'searchText',
                type: 'search',
                defaultValue: '',
                placeholder: 'Search'
            }
        ];

        this.breadCrumbs = [
            {name: constants.EDITORS_MANAGEMENT, path: appRoutes.EDITORS},
            {name: constants.EDITORS}
        ];

        this.fetchEditors = fetchEditors.bind(store);
        this.getEditors = getEditors.bind(store);

        this.handleCloseDialog = this.handleCloseDialog.bind(this);

        this.sendCreateNotification = this.sendCreateNotification.bind(this);
        this.sendUpdateNotification = this.sendUpdateNotification.bind(this);
        this.sendDeleteNotification = this.sendDeleteNotification.bind(this);

        this.handleCreateEditorSubmit = this.handleCreateEditorSubmit.bind(this);
        this.handleUpdateEditorSubmit = this.handleUpdateEditorSubmit.bind(this);

        this.showConfirm = this.showConfirm.bind(this);
        this.handleDeleteEditor = this.handleDeleteEditor.bind(this);
    }

    /**
     * Open or close an edit user view
     * @param {Object} editorData - a user data
     */
    toggleEditEditorsView(editorData = {}) {
        this.setState({editEditorsView: {on: !this.state.editEditorsView.on, editorData}});
    }

    /**
     * Handle a creation of a editor
     * @param {Object} createUserData - user data.
     */
    handleCreateEditorSubmit(createUserData) {
        const { route: { store, store: { createEditor }}} = this.props;

        createEditor.call(store, createUserData).
            then(this.handleCloseDialog).
            then(this.sendCreateNotification).
            then(this.fetchEditors);
    }

    /**
     * Handle an update of a editor's data
     * @param {Object} updatedEditorData - updated editor's data.
     */
    handleUpdateEditorSubmit(updatedEditorData) {
        const { route: { store, store: { updateEditor }} } = this.props;
        const { firstName, lastName, email, isPasswordChange, password, userRole } = updatedEditorData;

        const data = {
            firstName,
            lastName,
            userRole,
            email,
            password: isPasswordChange ? password : ''
        };

        updateEditor.call(store, this.state.editEditorsView.editorData.id, data)
            .then(this.handleCloseDialog).then(this.sendUpdateNotification);
    }

    /**
     * Handle delete editor
     * @param {Object} editor - an editor object
     */
    handleDeleteEditor(editor) {
        const { route: { store, store: { deleteEditor }} } = this.props;
        this.setState({confirm: {isShowConfirmation: false, editor: {}}});
        deleteEditor.call(store, editor.id).then(this.sendDeleteNotification);
    }

    /**
     * Handle delete editor
     * @param {Object} editor - an editor object
     */
    showConfirm(editor) {
        editor.allowDelete && this.setState({confirm: {isShowConfirmation: true, editor: editor}});
    }

    /**
     * Send a notification of that a editor was created
     */
    sendCreateNotification() {
        this.props.appStore.setNotification(
            Notification.Notifications.info,
            constants.CREATE_USER_NOTIFICATION_MESSAGE
        );
    }

    /**
     * Send a notification of that a editor's data was updated
     */
    sendUpdateNotification() {
        this.props.appStore.setNotification(Notification.Notifications.info, constants.UPDATE_NOTIFICATION_MESSAGE);
    }

    /**
     * Send a notification of that a editor was deleted
     */
    sendDeleteNotification() {
        this.props.appStore.setNotification(Notification.Notifications.info, constants.DELETE_USER_NOTIFICATION_MESSAGE);
    }

    /**
     * Handle a close event for a modal dialog
     */
    handleCloseDialog() {
        this.toggleEditEditorsView();
    }

    /**
     * Render an edit editor component
     */
    renderEditEditorView() {
        const { editEditorsView: { on, editorData } } = this.state;
        const submitBtnId = 'editEditorSubmit';
        const isCreateUser = Object.keys(editorData).length === 0;

        const headerText = isCreateUser ? 'New Editor' : 'Edit Editor\'s Profile';

        return (
            <Modal className="bo-essel-modal" show={on} onHide={this.handleCloseDialog}>
                <Modal.Header closeButton>
                    <Modal.Title>{headerText}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EditEditor editorData={editorData}
                                submitBtnId={submitBtnId}
                                onSubmit={isCreateUser ? this.handleCreateEditorSubmit : this.handleUpdateEditorSubmit}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleCloseDialog}>Cancel</Button>
                    <Button type="submit"><label htmlFor={submitBtnId}>Save</label></Button>
                </Modal.Footer>
            </Modal>
        );
    }

    /**
     * Render a deletion confirmation editor component
     */
    renderConfirmationView() {
        const {confirm: {isShowConfirmation, editor, editor: {firstName = '', lastName = ''}}} = this.state;
        const bodyText = <div>
            Are you sure you want to delete <b>{`${firstName} ${lastName}`}</b> from the system?
        </div>;

        return (
            <Confirm
                key="confirm"
                onConfirm={this.handleDeleteEditor.bind(this, editor)}
                onClose={() => {
                    this.setState({
                        confirm: {
                            isShowConfirmation: false,
                            editor: {}
                        }
                    })
                }}
                body={bodyText}
                visible={isShowConfirmation}
                cancelText="NO"
                confirmText="YES"
                title="Delete Editor"
            />
        );
    }

    /**
     * @see Component#render()
     */
    render() {
        const { router } = this.props;
        return (
            <Grid>
                <Row className="bread-crumbs">
                    <Col className="col" xs={12} md={8}>
                        <BreadCrumbs router={router} crumbs={this.breadCrumbs}/>
                    </Col>
                </Row>
                <Row>
                    <Col className="col" xs={12} md={8}>
                        <Button className="bo-essel-editor-create-btn"
                                onClick={this.toggleEditEditorsView.bind(this, {})}
                        >
                            <i className="fa fa-user-plus"/>
                            Add User
                        </Button>
                    </Col>
                </Row>
                <Row className="main-content">
                    <PageTable
                        filters={this.editorsFilters}
                        fetchData={this.fetchEditors}
                        getData={this.getEditors}
                        layout={this.editorsListLayout}
                    />
                </Row>
                <Row>
                    { this.renderEditEditorView() }
                    { this.renderConfirmationView() }
                </Row>
            </Grid>
        );
    }
}

export default EditorsList;
