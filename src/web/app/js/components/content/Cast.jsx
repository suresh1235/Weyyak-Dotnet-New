import React, {Component, PropTypes} from 'react';
import {observer} from 'mobx-react';
import {
    Select,
    Row,
    Col,
    Modal,
    Button
} from 'react-bootstrap';

import MultiSelect from 'react-select';
import FormValidationWrapper from 'components/core/FormValidationWrapper';
import { getSetterName, getValidationMessage } from 'components/core/Utils'
import validationMessages from 'validations/validationMessages';
import FieldWrapper  from 'components/core/FieldWrapper';
import Action from 'components/core/Action';
import AddItem from 'components/content/AddItem';

/**
 * The class defines a Cast component
 */
@observer
class Cast extends Component {

    /** The component properties */
    static propTypes = {};

    /**
     * Construct a Cast component
     * @param {Array} args component's arguments
     */
    constructor(...args) {
        super(...args);

        this.getStoreValue = this.getStoreValue.bind(this);
        this.handleAddNewItem = this.handleAddNewItem.bind(this);
        this.renderAddNewItemView = this.renderAddNewItemView.bind(this);
        this.toggleAddNewItemView = this.toggleAddNewItemView.bind(this);

        this.fields = [
            [
                {
                    element: MultiSelect,
                    elementType: 'multiselect',
                    label: `Main Actor *${this.props.isValidationFormPerType ? '*' : ''}`,
                    handleChange: this.handleMultipleSelectChange,
                    props: {
                        name: 'mainActorId',
                        type: 'select',
                        key: 'mainActorId',
                        componentClass: 'select',
                        validations: [
                            {
                                name: 'requiredOne',
                                msgArgs: ['Main Actor', 'Main Actress'],
                                args: this.getStoreValue.bind(this, 'mainActressId')
                            }
                        ],
                        multiple: false,
                    },
                    config: {
                        emptyOption: true,
                        optionsKey: 'actorsList',
                        optionValue: 'id',
                        optionLabel: function () {
                            return `${this.englishName}_${this.arabicName}`;
                        },
                        getOptions: this.getStoreValue,
                    }
                },
                {
                    element: MultiSelect,
                    elementType: 'multiselect',
                    label: `Main Actress *${this.props.isValidationFormPerType ? '*' : ''}`,
                    handleChange: this.handleMultipleSelectChange,
                    props: {
                        name: 'mainActressId',
                        type: 'select',
                        key: 'mainActressId',
                        componentClass: 'select',
                        multiple: false,
                    },
                    config: {
                        emptyOption: true,
                        optionsKey: 'actorsList',
                        optionValue: 'id',
                        optionLabel: function () {
                            return `${this.englishName}_${this.arabicName}`;
                        },
                        getOptions: this.getStoreValue,
                    }
                }
            ],
            [
                {
                    element: MultiSelect,
                    elementType: 'multiselect',
                    label: 'Actor(s)',
                    handleChange: this.handleMultipleSelectChange,
                    props: {
                        name: 'actors',
                        type: 'select',
                        key: 'actors',
                        componentClass: 'select',
                        validations: [
                            {
                                name: 'maxLength',
                                customMessage: validationMessages.maxItems,
                                args: [10],
                                msgArgs: ['Actor(s)', 10]
                            }
                        ],
                        multiple: true,
                    },
                    config: {
                        emptyOption: true,
                        optionsKey: 'actorsList',
                        optionValue: 'id',
                        optionLabel: function () {
                            return `${this.englishName}_${this.arabicName}`;
                        },
                        getOptions: this.getStoreValue,
                    },
                    actions: fieldKey => {
                        return [
                            <Action key="addActor"
                                    title="Add Actor"
                                    className="bo-essl-action-text-link"
                                    name="Add New"
                                    onClick={this.toggleAddNewItemView.bind(this, fieldKey, 'Actor')}/>,
                        ];
                    }
                },
                {
                    element: MultiSelect,
                    elementType: 'multiselect',
                    label: 'Writer(s)',
                    handleChange: this.handleMultipleSelectChange,
                    props: {
                        name: 'writers',
                        type: 'select',
                        key: 'writers',
                        componentClass: 'select',
                        validations: [
                            {
                                name: 'maxLength',
                                customMessage: validationMessages.maxItems,
                                args: [6],
                                msgArgs: ['Writer(s)', 6]
                            }
                        ],
                        multiple: true,
                    },
                    config: {
                        emptyOption: true,
                        optionsKey: 'writersList',
                        optionValue: 'id',
                        optionLabel: function () {
                            return `${this.englishName}_${this.arabicName}`;
                        },
                        getOptions: this.getStoreValue,
                    },
                    actions: fieldKey => {
                        return [
                            <Action key="addWriter"
                                    title="Add Writer"
                                    className="bo-essl-action-text-link"
                                    name="Add New"
                                    onClick={this.toggleAddNewItemView.bind(this, fieldKey, 'Writer')}/>,
                        ];
                    }
                },
                {
                    element: MultiSelect,
                    elementType: 'multiselect',
                    label: 'Director(s)',
                    handleChange: this.handleMultipleSelectChange,
                    props: {
                        name: 'directors',
                        type: 'select',
                        key: 'directors',
                        componentClass: 'select',
                        validations: [
                            {
                                name: 'maxLength',
                                customMessage: validationMessages.maxItems,
                                args: [6],
                                msgArgs: ['Director(s)', 6]
                            }
                        ],
                        multiple: true,
                    },
                    config: {
                        emptyOption: true,
                        optionsKey: 'directorsList',
                        optionValue: 'id',
                        optionLabel: function () {
                            return `${this.englishName}_${this.arabicName}`;
                        },
                        getOptions: this.getStoreValue,
                    },
                    actions: fieldKey => {
                        return [
                            <Action key="addDirector"
                                    title="Add Director"
                                    name="Add New"
                                    className="bo-essl-action-text-link"
                                    onClick={this.toggleAddNewItemView.bind(this, fieldKey, 'Director')}/>,
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

        store.fetchActors();
        store.fetchWriters();
        store.fetchDirectors();
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
     * Toggle showing add new item modal
     * @param {string} fieldKey - field key
     * @param {string} fieldName - field human readable name
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

        switch(fieldKey) {
            case 'actors':
                store.createActor.call(store, data).then(this.toggleAddNewItemView);
                break;
            case 'writers':
                store.createWriter.call(store, data).then(this.toggleAddNewItemView);
                break;
            case 'directors':
                store.createDirector.call(store, data).then(this.toggleAddNewItemView);
                break;
        }
    }

    /**
     * Render an edit editor component
     */
    renderAddNewItemView() {
        const { on, fieldKey, name } = this.state;
        const submitBtnId = 'addItemSubmit';

        return (
            <Modal className="bo-essel-modal" show={on} onHide={this.toggleAddNewItemView.bind(this)}>
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
                    <Button onClick={this.toggleAddNewItemView.bind(this)}>Cancel</Button>
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
                        this.fields.map((list, rowIndex) => rowIndex ?
                            <Row key={`${rowIndex}`}>
                                <Col key={`col-${rowIndex}`} md={8}>
                                    {
                                        list.map((field, index) => {
                                            const {props: {validations, key}, handleChange} = field;
                                            const setter = store[getSetterName(key)].bind(store);
                                            const isRequired = !!(validations && validations.filter(rule => rule.name == 'required').length);
                                            const handleChangeCallback = handleChange ?
                                                field.handleChange.bind(this, setter) :
                                                this.handleInputChange.bind(this, setter);

                                            return (
                                                <FieldWrapper
                                                    fieldConfig={field}
                                                    store={store}
                                                    getStoreValue={this.getStoreValue}
                                                    handleChange={handleChangeCallback}
                                                    required={isRequired}
                                                    key={index}
                                                />
                                            );
                                        })
                                    }
                                </Col>
                            </Row> :
                            this.renderFirstRow(list)
                        )
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

    /**
     * Renders first row
     *
     * @param {Array} list - field configs for the first row
     * @returns {ReactNode}
     */
    renderFirstRow(list) {
        const {store} = this.props;
        return (
            <Row key="first-row">
                {
                    list.map((field, index) => {
                        const {props: {validations, key}, handleChange} = field;
                        const setter = store[getSetterName(key)].bind(store);
                        const isRequired = !!(validations && validations.filter(rule => rule.name == 'required').length);
                        const handleChangeCallback = handleChange ?
                            handleChange.bind(this, setter) :
                            this.handleInputChange.bind(this, setter);

                        return (
                            <Col key={`col-${index}-first-row`} md={6}>
                                <FieldWrapper
                                    fieldConfig={field}
                                    store={store}
                                    getStoreValue={this.getStoreValue}
                                    handleChange={handleChangeCallback}
                                    required={isRequired}
                                    key={index}
                                />
                            </Col>
                        );
                    })
                }
            </Row>
        );
    }
}

export default Cast;
