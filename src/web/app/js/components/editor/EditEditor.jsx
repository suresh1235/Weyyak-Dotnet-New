import React, { Component, PropTypes } from 'react';
import { inject, observer, PropTypes as MobxPropTypes } from 'mobx-react';
import {
    Form,
    FormGroup,
    FormControl,
    Button,
    Row,
    Col
} from 'react-bootstrap';

import FormValidationWrapper from 'components/core/FormValidationWrapper';
import validationMessages from 'validations/validationMessages';

/**
 * The class represents a component which allows to change an editor's details
 */
@inject('appStore')
@observer
class EditEditor extends Component {

    /** The component's props */
    static propTypes = {
        editorData: PropTypes.shape({
            firstName: PropTypes.string,
            lastName: PropTypes.string,
            userRole: PropTypes.string,
            email: PropTypes.string
        })
    };

    /** The default component properties */
    static defaultProps = {
        editorData: {}
    };

    /** The admin role */
    static ADMIN = 'Admin';

    /**
     * Construct a component's instance
     * @param {Array} args - a component's arguments
     */
    constructor(...args) {
        super(...args);

        const [props] = args;
        const { editorData, editorData: { firstName = '', lastName='', email = '', userRole = EditEditor.ADMIN }} = props;

        this.state = {
            firstName,
            lastName,
            email,
            userRole,
            password: '',
            confirmPassword: '',
            isPasswordChange: false
        };

        if (Object.keys(editorData).length) {
            this.layout = this.getUpdateEditorFormLayout();
            this.additionalLayout = this.getHiddenFormLayout();
        } else {
            this.layout = this.getCreateEditorFormLayout();
            this.additionalLayout = null;
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Handle a change of a controlled input
     * @param {Object} event - an event to be handled
     */
    handleInputChange(event) {
        const { name, value, selectedOptions } = event.target;
        const newState = {[name]: value};
        if (selectedOptions && selectedOptions.length) {
            newState[name.replace(/Id/, 'Name')] = selectedOptions[0].text;
        }
        this.setState(newState);
    }

    /**
     * Handle change of a password field
     */
    handlePasswordChange() {
        this.setState({isPasswordChange : !this.state.isPasswordChange});
    }

    /**
     * Handle form submit
     */
    handleSubmit() {
        this.props.onSubmit({...this.state});
    }

    /**
     * Render a form element
     * @param {Object} element - a form element to be rendered
     * @param {Number} index - a form element index
     * @returns {ReactNode} a rendered React element
     */
    renderFormElement(element, index) {
        const {
            column1: { element: element1, props: props1, children: children1 },
            column2: { element: element2, props: props2, children: children2 }
        } = element;
        return <Row key={index}>
            <Col className="first-column" md={4} xs={3}>
                {
                    React.createElement(element1,
                        props1 instanceof Function ? props1(this) : props1,
                        children1 instanceof Function ? children1(this) : children1)
                }
            </Col>
            <Col md={6} xs={8}>
                {
                    React.createElement(element2,
                        props2 instanceof Function ? props2(this) : props2,
                        children2 instanceof Function ? children2(this) : children2)
                }
            </Col>
        </Row>;
    }

    /**
     * Get create editor form layout
     * @returns {Array} - layout for a editor creation form
     */
    getCreateEditorFormLayout() {
        return [
            {
                column1: { element: 'label', props: { htmlFor: 'firstName' }, children: [ 'First Name:' ] },
                column2: {
                    element: FormControl,
                    props: component => ({
                        id: 'firstName',
                        name: 'firstName',
                        type: 'text',
                        placeholder: 'First Name',
                        onChange: component.handleInputChange,
                        value: component.state.firstName,
                        validations: [
                            {
                                name: 'maxLength',
                                args: [50],
                                msgArgs: [50]
                            }
                        ]
                    })
                }
            },
            {
                column1: { element: 'label', props: { htmlFor: 'lastName' }, children: [ 'Last Name:' ] },
                column2: {
                    element: FormControl,
                    props: component => ({
                        id: 'lastName',
                        name: 'lastName',
                        type: 'text',
                        placeholder: 'Last Name',
                        onChange: component.handleInputChange,
                        value: component.state.lastName,
                        validations: [
                            {
                                name: 'maxLength',
                                args: [50],
                                msgArgs: [50]
                            }
                        ]
                    })
                }
            },
            {
                column1: { element: 'label', props: { htmlFor: 'email' }, children: [ 'User Name:' ] },
                column2: {
                    element: FormControl,
                    props: component => ({
                        id: 'email',
                        name: 'email',
                        type: 'text',
                        placeholder: 'Email',
                        onChange: component.handleInputChange,
                        value: component.state.email,
                        validations: [
                            'required',
                            {name: 'maxLength', args: [255], msgArgs: [255]},
                            'email'
                        ]
                    })
                }
            },
            {
                column1: { element: 'label', children: [ 'Role:' ] },
                column2: {
                    element: 'select',
                    props: component => ({
                        id: 'userRole',
                        name: 'userRole',
                        type: 'select',
                        placeholder: 'Select Role',
                        value: component.state.userRole,
                        disabled: true,
                        onChange: () => {},
                        className: 'form-control'
                    }),
                    children: component => [<option key="admin" value={'Admin'}>Admin</option>]
                }
            }
        ];
    }

    /**
     * Get update editor form layout
     * @returns {Array} - layout for a editor updating form
     */
    getUpdateEditorFormLayout() {
        return [
            {
                column1: { element: 'label', props: { htmlFor: 'firstName' }, children: [ 'First Name:' ] },
                column2: {
                    element: FormControl,
                    props: component => ({
                        id: 'firstName',
                        name: 'firstName',
                        type: 'text',
                        placeholder: 'First Name',
                        onChange: component.handleInputChange,
                        value: component.state.firstName,
                        validations: [
                            {
                                name: 'maxLength',
                                args: [50],
                                msgArgs: [50]
                            }
                        ]
                    })
                }
            },
            {
                column1: { element: 'label', props: { htmlFor: 'lastName' }, children: [ 'Last Name:' ] },
                column2: {
                    element: FormControl,
                    props: component => ({
                        id: 'lastName',
                        name: 'lastName',
                        type: 'text',
                        placeholder: 'Last Name',
                        onChange: component.handleInputChange,
                        value: component.state.lastName,
                        validations: [
                            {
                                name: 'maxLength',
                                args: [50],
                                msgArgs: [50]
                            }
                        ]
                    })
                }
            },
            {
                column1: { element: 'label', props: { htmlFor: 'email' }, children: [ 'User Name:' ] },
                column2: {
                    element: FormControl,
                    props: component => ({
                        id: 'email',
                        name: 'email',
                        type: 'text',
                        placeholder: 'Email',
                        onChange: component.handleInputChange,
                        value: component.state.email,
                        disabled: true
                    })
                }
            },
            {
                column1: { element: 'label', children: [ 'Role:' ] },
                column2: {
                    element: 'select',
                    props: component => ({
                        id: 'userRole',
                        name: 'userRole',
                        type: 'select',
                        placeholder: 'Select Role',
                        value: component.state.userRole,
                        disabled: true,
                        onChange: () => {},
                        className: 'form-control'
                    }),
                    children: component => [<option key="admin" value={EditEditor.ADMIN}>{EditEditor.ADMIN}</option>]
                }
            },
            {
                column1: { element: 'label', children: [ '' ] },
                column2: {
                    element: Button,
                    props: component => ({
                        onClick: component.handlePasswordChange,
                        className: 'bo-essel-edit-editor-password'
                    }),
                    children: component => ['Change Password']
                }
            }
        ];
    }

    /**
     * Get a hidden part of an editor form layout
     * @returns {Array} - layout for a hidden part of an editor form layout
     */
    getHiddenFormLayout() {
        return [
            {
                column1: {element: 'label', children: ['New Password:']},
                column2: {
                    element: FormControl,
                    props: component => ({
                        id: 'password',
                        name: 'password',
                        type: 'password',
                        placeholder: 'New password',
                        onChange: component.handleInputChange,
                        value: component.state.password,
                        validations: [
                            {
                                name: 'dataInRange',
                                args: [6, 255],
                                msgArgs: [6, 255]
                            }
                        ]
                    })
                }
            },
            {
                column1: {element: 'label', children: ['New Password again:']},
                column2: {
                    element: FormControl,
                    props: component => ({
                        id: 'confirmPassword',
                        name: 'confirmPassword',
                        type: 'password',
                        placeholder: 'New password again',
                        onChange: component.handleInputChange,
                        value: component.state.confirmPassword,
                        validations: [
                            {
                                name: 'dataInRange',
                                args: [6, 255],
                                msgArgs: [6, 255]
                            },
                            {
                                name: 'match',
                                customMessage: validationMessages.passwordMismatch,
                                args: this.state.password,
                                msgArgs: ['New password', 'New password again']
                            }
                        ]
                    })
                }
            }
        ];
    }

    /**
     * @see Component#render()
     */
    render() {
        const { submitBtnId } = this.props;
        const layout = this.state.isPasswordChange ? this.layout.concat(this.additionalLayout) : this.layout;

        return (
            <div className="bo-essel-edit-editor">
                <FormValidationWrapper>
                    <Form className="bo-essel-form default" horizontal onSubmit={this.handleSubmit}>
                        <FormGroup>
                            { layout.map(this.renderFormElement.bind(this)) }
                        </FormGroup>
                        <Button id={submitBtnId} type="submit"/>
                    </Form>
                </FormValidationWrapper>
            </div>
        );
    }
}

export default EditEditor;