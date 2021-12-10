import React, {Component, PropTypes} from 'react';
import {observer, inject} from 'mobx-react';
import {
    FormControl,
    Select,
    Row,
    Col,
    Modal,
    Button
} from 'react-bootstrap';

import MultiSelect from 'react-select';

import FormValidationWrapper from 'components/core/FormValidationWrapper';
import {getSetterName, buildString, getValidationMessage} from 'components/core/Utils'
import validationMessages from 'validations/validationMessages';
import FieldWrapper  from 'components/core/FieldWrapper';
import Action from 'components/core/Action';
import AddItem from 'components/content/AddItem';

/**
 * The class defines Tags component
 */
@observer
class Tags extends Component {

    /** The component properties */
    static propTypes = {};

    constructor(...args) {
        super(...args);

        this.handleAddNewItem = this.handleAddNewItem.bind(this);
        this.renderAddNewItemView = this.renderAddNewItemView.bind(this);
        this.toggleAddNewItemView = this.toggleAddNewItemView.bind(this);

        this.fields = [
            {
                element: MultiSelect,
                elementType: 'multiselect',
                label: 'Tag(s)',
                props: {
                    name: 'tags',
                    type: 'select',
                    key: 'tags',
                    componentClass: 'select',
                    validations: [
                        {
                            name: 'maxLength',
                            customMessage: validationMessages.maxItems,
                            args: [10],
                            msgArgs: ['Tag(s)', 10]

                        }
                    ],
                    multiple: true,
                },
                config: {
                    emptyOption: true,
                    optionsKey: 'tagsList',
                    optionValue: 'id',
                    optionLabel: function () {
                        return this.name;
                    },
                    getOptions: this.getStoreValue.bind(this),
                },
                actions: fieldKey => {
                    return [
                        <Action key="addTag"
                                className="bo-essl-action-text-link"
                                title="Add Tag"
                                name="Add New"
                                onClick={this.toggleAddNewItemView.bind(this, fieldKey)}/>,
                    ];
                }
            },
        ];

        this.addItemFormLayout = [
            {
                column1: {element: 'label', props: {htmlFor: 'name'}, children: ['Tag Name']},
                column2: {
                    element: FormControl,
                    stateKey: 'name',
                    props: component => ({
                        id: 'name',
                        name: 'name',
                        type: 'text',
                        placeholder: 'Tag Name',
                        onChange: component.handleInputChange,
                        value: component.state.name,
                        validations: [
                            {
                                name: 'required',
                                customMessage: validationMessages.specifyData,
                                msgArgs: ['Tag Name']
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

        this.state = { on: false, fieldKey: '' };
    }

    /**
     * Fetch select options on a component mounting
     * @see Component#componentWillMount()
     */
    componentWillMount() {
        const {store} = this.props;

        store.fetchTags();
    }

    /**
     * Gets field value from the store
     * @param {String} key - field config key
     *
     * @returns {*}
     */
    getStoreValue(key) {
        const {store} = this.props;
        return store.getStoreProperty(key);
    }

    /**
     * Handler of multiple select change event
     * @param {Object} setter - value setter callback
     * @param {Object} value
     */
    handleMultipleSelectChange(setter, value) {
        setter(value);
    }

    /**
     * Toggle show add new popup dialog
     * @param {String} fieldKey - field key
     */
    toggleAddNewItemView(fieldKey) {
        this.setState({ on: !this.state.on, fieldKey: fieldKey || '' });
    }

    /**
     * Add new item submit handler
     * @param {Object} data - submit data
     */
    handleAddNewItem(data) {
        const {store} = this.props;

        store.createTag.call(store, data).then(this.toggleAddNewItemView);
    }

    /**
     * Render an edit editor component
     */
    renderAddNewItemView() {
        const { on, fieldKey } = this.state;
        const submitBtnId = 'addItemSubmit';

        return (
            <Modal className="bo-essel-modal" show={on} onHide={this.toggleAddNewItemView}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Tag</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddItem
                        layout={this.addItemFormLayout}
                        submitBtnId={submitBtnId}
                        onSave={this.handleAddNewItem}
                        fieldKey={fieldKey}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.toggleAddNewItemView}>Cancel</Button>
                    <Button type="submit"><label htmlFor={submitBtnId}>Add</label></Button>
                </Modal.Footer>
            </Modal>
        );
    }

    /**
     * @see Component#render()
     */
    render() {
        const {store} = this.props;

        return (
            <FormValidationWrapper
                validationClass
                validationMessage={getValidationMessage}>
                <div className="forms">
                    {
                        this.fields.map((field, index) => {
                            const {props: {key}} = field;
                            const setter = store[getSetterName(key)].bind(store);

                            return (
                                <Row key={`row-${index}`}>
                                    <Col key={`col-${index}`} md={8}>
                                        <FieldWrapper
                                            fieldConfig={field}
                                            store={store}
                                            getStoreValue={this.getStoreValue.bind(this)}
                                            handleChange={this.handleMultipleSelectChange.bind(this, setter)}
                                            key={index}
                                        />
                                    </Col>
                                </Row>
                            );
                        })
                    }
                    <Row key="addItemRow">
                        {
                            this.renderAddNewItemView()
                        }
                    </Row>
                </div>
            </FormValidationWrapper>
        );
    }
}

export default Tags;
