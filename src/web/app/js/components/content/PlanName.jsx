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
class PlanName extends Component {

    /** The component properties */
    static propTypes = {
        //field: PropTypes.shape().isRequired,
        onChange: PropTypes.func.isRequired,
        value: PropTypes.arrayOf(PropTypes.number)
    };

    /**
     * Construct a Product Name component
     * @param {Array} props component's arguments
     */
    constructor(props) {
        super(props);
        this.handlePlansChanged = this.handlePlansChanged.bind(this);
        this.getOptions = this.getOptions.bind(this);
    }

    /**
     * @see Component#componentWillMount()
     */
    componentWillMount() {
        const { store } = this.props;
        store.fetchItemSubcriptionPlans && store.fetchItemSubcriptionPlans();
    }

    /**
     * Get options
     * @returns {Array} product name options
     */
    getOptions() {
        const { store } = this.props;
        return store.subscriptionPlans ? store.subscriptionPlans.map(plan => ({
                label: plan.name,
                value: parseInt(plan.id)
            })
        ) : []
  
    }

    /**
     * Handle products changed
     * @param {Object} productOptions - product options
     */
    handlePlansChanged(plansOptions) {        
        const { onChange } = this.props;
        const subscriptionPlans = plansOptions ? plansOptions.map(plan => parseInt(plan.value)) : [];
        onChange && onChange(subscriptionPlans);
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
                        <h3 className="block">Select Plans</h3>
                    </Col>
                </Row>
                <Row>
                    <Col md={11}>
                        <FieldWrapper
                            fieldConfig={field}
                            handleChange={this.handlePlansChanged}
                            value={value}
                            getOptions={this.getOptions}
                        />
                    </Col>
                </Row>
            </FormValidationWrapper> );
    }
}

export default PlanName;
