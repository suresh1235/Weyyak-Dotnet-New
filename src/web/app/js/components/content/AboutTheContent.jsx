import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import {
    Row,
    Col
} from 'react-bootstrap';

import FormValidationWrapper from 'components/core/FormValidationWrapper';
import { getSetterName, buildString, getValidationMessage } from 'components/core/Utils'
import FieldWrapper  from 'components/core/FieldWrapper';

/**
 * The class defines a About The Content component
 */
@observer
class AboutTheContent extends Component {
    /** The component properties */
    static propTypes = {};

    /**
     * Fetch select options on a component mounting
     * @see Component#componentWillMount()
     */
    componentWillMount() {
        const { store } = this.props;
        store.fetchOriginalLanguages();
        store.fetchProductionCountries();
        store.fetchAgeGroups();
        store.fetchSupplierInfos();
    }

    /**
     * Gets field value from the store
     * @param {String} key - field config key
     *
     * @returns {*}
     */
    getStoreValue(key) {
        const { store } = this.props;
        return store.getStoreProperty(key);
    }


    /**
     * Handler of input change event
     * @param {Object} key - property key
     * @param {Object} event - change event
     */
    handleInputChange(key, event) {
        const {target: { value }} = event;
        const { store } = this.props;

        store[getSetterName(key)](value);
    }

    /**
     * Handler of multiple select change event
     * @param {String} key - property key
     * @param {Object} value - option value
     */
    handleMultipleSelectChange(key, value) {
        const { store } = this.props;
        store[getSetterName(key)](value);
    }

    /**
     * Get change handler
     * @param field
     * @returns {function(this:AboutTheContent)}
     */
    getChangeHandler(field) {
        const { props: { key } } = field;
        return field.elementType === 'multiselect' ?
            this.handleMultipleSelectChange.bind(this, key) :
            this.handleInputChange.bind(this, key);
    }

    /**
     * @see Component#render()
     */
    render() {
        const { fields } = this.props;

        return (
            <FormValidationWrapper
                validationClass
                validationMessage={getValidationMessage}>
                <div className="forms">
                    <Row>
                        {
                            fields.map((list, index) => {
                              //  console.log(list)
                                return (
                                    <Col key={index} md={6}>
                                        {
                                            list.map((field, index) => <FieldWrapper
                                                    fieldConfig={field}
                                                    getStoreValue={this.getStoreValue.bind(this)}
                                                    handleChange={this.getChangeHandler(field)}
                                                    key={index}
                                                />)
                                        }
                                    </Col>
                                );
                            })
                        }
                    </Row>
                </div>
            </FormValidationWrapper>
        );
    }
}

export default AboutTheContent;
