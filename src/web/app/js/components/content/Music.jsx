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
 * The class defines a About The Content component
 */
@observer
class Music extends Component {

    /** The component properties */
    static propTypes = {};

    constructor(...args) {
        super(...args);

        this.getStoreValue = this.getStoreValue.bind(this);
        this.toggleAddNewItemView = this.toggleAddNewItemView.bind(this);
        this.handleAddNewItem = this.handleAddNewItem.bind(this);
        this.renderAddNewItemView = this.renderAddNewItemView.bind(this);

        this.fields = [
            [
                {
                    element: MultiSelect,
                    elementType: 'multiselect',
                    label: 'Singer(s)',
                    handleChange: this.handleMultipleSelectChange,
                    props: {
                        name: 'singers',
                        type: 'select',
                        key: 'singers',
                        componentClass: 'select',
                        validations: [
                            {
                                name: 'maxLength',
                                customMessage: validationMessages.maxItems,
                                args: [6],
                                msgArgs: ['Singer(s)', 6]
                            }
                        ],
                        multiple: true,
                    },
                    config: {
                        emptyOption: true,
                        optionsKey: 'singersList',
                        optionValue: 'id',
                        optionLabel: function () {
                            return `${this.englishName}_${this.arabicName}`;
                        },
                        getOptions: this.getStoreValue,
                    },
                    actions: fieldKey => {
                        return [
                            <Action key="addSinger"
                                    className="bo-essl-action-text-link"
                                    title="Add Singer"
                                    name="Add New"
                                    onClick={this.toggleAddNewItemView.bind(this, fieldKey, 'Singer')}/>,
                        ];
                    }
                },
                {
                    element: MultiSelect,
                    elementType: 'multiselect',
                    label: 'Music Composer(s)',
                    handleChange: this.handleMultipleSelectChange,
                    props: {
                        name: 'musicComposers',
                        type: 'select',
                        key: 'musicComposers',
                        componentClass: 'select',
                        multiple: true,
                        validations: [
                            {
                                name: 'maxLength',
                                customMessage: validationMessages.maxItems,
                                args: [6],
                                msgArgs: ['Music Composer(s)', 6]
                            }
                        ],
                    },
                    config: {
                        emptyOption: true,
                        optionsKey: 'musicComposersList',
                        optionValue: 'id',
                        optionLabel: function () {
                            return `${this.englishName}_${this.arabicName}`;
                        },
                        getOptions: this.getStoreValue,
                    },
                    actions: fieldKey => {
                        return [
                            <Action key="addMusicComposer"
                                    className="bo-essl-action-text-link"
                                    title="Add Music Composer"
                                    name="Add New"
                                    onClick={this.toggleAddNewItemView.bind(this, fieldKey, 'Composer')}/>,
                        ];
                    }
                },
                {
                    element: MultiSelect,
                    elementType: 'multiselect',
                    label: 'Song Writer(s)',
                    handleChange: this.handleMultipleSelectChange,
                    props: {
                        name: 'songWriters',
                        type: 'select',
                        key: 'songWriters',
                        componentClass: 'select',
                        validations: [
                            {
                                name: 'maxLength',
                                customMessage: validationMessages.maxItems,
                                args: [6],
                                msgArgs: ['Song Writer(s)', 6]
                            }
                        ],
                        multiple: true,
                    },
                    config: {
                        emptyOption: true,
                        optionsKey: 'songWritersList',
                        optionValue: 'id',
                        optionLabel: function () {
                            return `${this.englishName}_${this.arabicName}`;
                        },
                        getOptions: this.getStoreValue,
                    },
                    actions: fieldKey => {
                        return [
                            <Action key="addSongWriter"
                                    className="bo-essl-action-text-link"
                                    title="Add Song Writer"
                                    name="Add New"
                                    onClick={this.toggleAddNewItemView.bind(this, fieldKey, 'Song Writer')}/>,
                        ];
                    }
                }
            ],
        ];

        this.state = { on: false, fieldKey: '', name: '' };
    }

    /**
     * Fetch select options on a component mounting
     * @see Component#componentWillMount()
     */
    componentWillMount() {
        const {store} = this.props;

        store.fetchSingers();
        store.fetchMusicComposers();
        store.fetchSongWriters();
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
     * Handler of input change event
     * @param {Object} setter - value setter callback
     * @param {Object} event - change event
     */
    handleInputChange(setter, event) {
        const {target: {value}} = event;

        setter(value);
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
     * @param {String} fieldName - field name override
     */
    toggleAddNewItemView(fieldKey, fieldName) {
        const name = (typeof fieldName === 'string') ? fieldName : '';

        this.setState({ on: !this.state.on, fieldKey: fieldKey || '', name: name || '' });
    }

    /**
     * Add new item handler
     * @param {Object} data - data object
     */
    handleAddNewItem(data) {
        const { fieldKey } = this.state;
        const { store } = this.props;

        switch (fieldKey) {
            case 'singers':
                store.createSinger.call(store, data).then(this.toggleAddNewItemView);
                break;
            case 'musicComposers':
                store.createMusicComposer.call(store, data).then(this.toggleAddNewItemView);
                break;
            case 'songWriters':
                store.createSongWriter.call(store, data).then(this.toggleAddNewItemView);
                break;
        }
    }

    /**
     * Render an edit editor component
     */
    renderAddNewItemView() {
        const { on, fieldKey, name = '' } = this.state;
        const submitBtnId = 'addItemSubmit';

        return (
            <Modal className="bo-essel-modal" show={on} onHide={this.toggleAddNewItemView}>
                <Modal.Header closeButton>
                    <Modal.Title>{`Add ${name}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddItem
                        submitBtnId={submitBtnId}
                        onSave={this.handleAddNewItem}
                        fieldKey={fieldKey}
                        placeholder={`${name} Name`}
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
                        this.fields.map((list, rowIndex) => {
                            return (
                                <Row key={`row-${rowIndex}`}>
                                    <Col key={`col-${rowIndex}`} md={8}>
                                        {
                                            list.map((field, index) => {
                                                const {props: {key}, handleChange} = field;
                                                const setter = store[getSetterName(key)].bind(store);

                                                return (
                                                    <FieldWrapper
                                                        fieldConfig={field}
                                                        store={store}
                                                        getStoreValue={this.getStoreValue}
                                                        handleChange={handleChange.bind(this, setter)}
                                                        key={index}
                                                    />
                                                );
                                            })
                                        }
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

export default Music;
