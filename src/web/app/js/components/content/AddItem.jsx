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
class AddItem extends Component {

    /** The component's props */
    static propTypes = {};

    /**
     * Construct a component's instance
     * @param {Array} args - a component's arguments
     */
    constructor(...args) {
        super(...args);
        const [props] = args;

        const { placeholder, layout } = props;

        this.layout = layout || [
            {
                column1: { element: 'label', props: {htmlFor: 'englishName'}, children: [`${placeholder} (English):`] },
                column2: {
                    element: FormControl,
                    stateKey: 'englishName',
                    props: component => ({
                        id: 'englishName',
                        name: 'englishName',
                        type: 'text',
                        placeholder,
                        onChange: component.handleInputChange,
                        value: component.state.englishName,
                        validations: [
                            {
                                name: 'required',
                                customMessage: validationMessages.specifyData,
                                msgArgs: [`${placeholder} (English)`]
                            },
                            {
                                name: 'maxLength',
                                args: [255],
                                msgArgs: [255],
                            }
                        ]
                    })
                }
            },
            {
                column1: { element: 'label', props: { htmlFor: 'arabicName' }, children: [`${placeholder} (Arabic):`] },
                column2: {
                    element: FormControl,
                    stateKey: 'arabicName',
                    props: component => ({
                        id: 'arabicName',
                        name: 'arabicName',
                        type: 'text',
                        placeholder,
                        onChange: component.handleInputChange,
                        value: component.state.arabicName,
                        validations: [
                            {
                                name: 'required',
                                customMessage: validationMessages.specifyData,
                                msgArgs: [`${placeholder} (Arabic)`]
                            },
                            {
                                name: 'maxLength',
                                args: [255],
                                msgArgs: [255],
                            }
                        ]
                    })
                }
            },
        ];

        const stateObject = {};

        this.layout.forEach(field => {
            stateObject[field.column2.stateKey] = '';
        });

        this.state = stateObject;

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Handle a change of a controlled input
     * @param {Object} event - an event to be handled
     */
    handleInputChange(event) {
        const { name, value } = event.target;
        const newState = {[name]: value};

        this.setState(newState);
    }

    /**
     * Handle form submit
     */
    handleSubmit() {
        const { onSave } = this.props;
        onSave({...this.state});
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
     * @see Component#render()
     */
    render() {
        const { submitBtnId } = this.props;

        return (
            <div>
                <FormValidationWrapper>
                    <Form className="bo-essel-form default" horizontal onSubmit={this.handleSubmit}>
                        <FormGroup>
                            { this.layout.map(this.renderFormElement.bind(this)) }
                        </FormGroup>
                        <Button id={submitBtnId} type="submit"/>
                    </Form>
                </FormValidationWrapper>
            </div>
        );
    }
}

export default AddItem;