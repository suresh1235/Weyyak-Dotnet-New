import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import {
    Row,
    Col,
} from 'react-bootstrap';
import FormValidationWrapper from 'components/core/FormValidationWrapper';
import { getValidationMessage } from 'components/core/Utils'
import FieldWrapper  from 'components/core/FieldWrapper';

/**
 * The class defines a Product Name component
 */
@observer
class ProductName extends Component {

    /** The component properties */
    static propTypes = {
        field: PropTypes.shape().isRequired,
        onChange: PropTypes.func.isRequired,
        value: PropTypes.arrayOf(PropTypes.number)
    };

    /**
     * Construct a Product Name component
     * @param {Array} props component's arguments
     */
    constructor(props) {
        super(props);
        this.handleProductsChanged = this.handleProductsChanged.bind(this);
        this.getOptions = this.getOptions.bind(this);
    }

    /**
     * @see Component#componentWillMount()
     */
    componentWillMount() {
        const { store } = this.props;
        store.fetchItemProducts && store.fetchItemProducts();
    }

    /**
     * Get options
     * @returns {Array} product name options
     */
    getOptions() {
        const { store } = this.props;
        return store.products ? store.products.map(product => ({
                label: product.name,
                value: product.id
            })
        ) : []
    }

    /**
     * Handle products changed
     * @param {Object} productOptions - product options
     */
    handleProductsChanged(productOptions) {
        const { onChange } = this.props;
        const products = productOptions ? productOptions.map(product => product.value) : [];        
        onChange && onChange(products);
    }

    /**
     * @see Component#render()
     */
    render() {
        const { value, field } = this.props;
        return (
            <FormValidationWrapper
                validationClass
                validationMessage={getValidationMessage}>
                <Row>
                    <Col>
                        <h3 className="block">Product</h3>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <FieldWrapper
                            fieldConfig={field}
                            handleChange={this.handleProductsChanged}
                            value={value}
                            getOptions={this.getOptions}
                        />
                    </Col>
                </Row>
            </FormValidationWrapper> );
    }
}

export default ProductName;
