import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import {
    FormControl,
    Row,
    Col,
} from 'react-bootstrap';
import FormValidationWrapper from 'components/core/FormValidationWrapper';
import { getValidationMessage } from 'components/core/Utils';
import DateTime from 'components/core/DateTime';
import validationMessages from 'validations/validationMessages';
import { findDOMNode } from 'react-dom';

/**
 * The class defines a Scheduling component
 */
@observer
class Scheduling extends Component {

    /** The component properties */
    static propTypes = {
        store: PropTypes.shape().isRequired,
        fields: PropTypes.shape({
            schedulingStartDate: PropTypes.shape().isRequired,
            schedulingEndDate: PropTypes.shape().isRequired
        }).isRequired,
        optional: PropTypes.bool
    };

    static schedulingValidationFieldName = 'schedulingValidationField';

    /**
     * Construct a Scheduling component
     * @param {Array} props component's arguments
     */
    constructor(props) {
        super(props);

        this.isStartDateValid = this.isStartDateValid.bind(this);
        this.isEndDateValid = this.isEndDateValid.bind(this);
    }

    /**
     * Handle date changed
     * @param {Object} field - field config
     * @param {Moment} dateTime - date time value
     */
    handleDateChanged(field, dateTime) {
        const { store } = this.props;
        const { name } = field;
        const domNode = findDOMNode(this.scheduling);
        store.setDataByName(name, dateTime);

        /**
         * Hack to trigger validation on selected EndDate value, when StartData was not selected.
         * Should be triggered only if Scheduling is optional
         */
        if (domNode) {
            domNode.focus();
            setInterval(() => {
                domNode.blur()
            }, 0);
        }
    }

    /**
     * Handle Scheduling date changed
     * @param {Object} field - field config
     * @param {Moment} dateTime - date time value
     */
    handleDigitalRightsDateChanged(field, dateTime) {
        this.handleDateChanged(field, dateTime ? dateTime.startOf('day') : null)
    }

    /**
     * Valid Scheduling start date
     * @param {Moment} currentDate - date.
     */
    isStartDateValid(currentDate) {
        const { store: { data : { schedulingEndDate } } } = this.props;
        return (!schedulingEndDate || (currentDate < schedulingEndDate)) && currentDate.get('year') > -1;
    }

    /**
     * Valid Scheduling end date
     * @param {Moment} currentDate - date.
     */
    isEndDateValid(currentDate) {
        const { store: { data : { schedulingStartDate } } } = this.props;
        return (!schedulingStartDate || (currentDate > schedulingStartDate)) && currentDate.get('year') > -1;
    }

    /**
     * Renders 'hacked' validation input. For description @see handleDateChanged function
     */
    renderHiddenValidationInput() {
        const { optional, store: { data: { schedulingStartDate, schedulingEndDate } } } = this.props;

        return optional ? (
            <FormControl
                type="text"
                className="form-control hidden-form-control"
                reference={Scheduling.schedulingValidationFieldName}
                name={Scheduling.schedulingValidationFieldName}
                value={!(schedulingStartDate == null && schedulingEndDate != null)}
                readOnly
                validations={[
                    {
                        name: 'required',
                        customMessage: validationMessages.specifyData,
                        msgArgs: ['Start Date']
                    }
                ]} />
        ) : null;
    }

    /**
     * @see Component#render()
     */
    render() {
        const {
            index = 0,
            onChange,
            store,
            fields: {
                schedulingStartDate: schedulingStartDateField,
                schedulingEndDate: schedulingEndDateField
            },
        } = this.props;

        const { data: { schedulingStartDate, schedulingEndDate } } = store;

        return (
            <FormValidationWrapper
                validationClass
                validationMessage={getValidationMessage}
                ref={wrapper => {
                    this.scheduling = wrapper ?
                        wrapper.wrappedInstance.refs[Scheduling.schedulingValidationFieldName] :
                        null
                    }
                }>
                <Row className="upwards">
                    <Col md={6}>
                        <DateTime fieldData={schedulingStartDateField}
                                  utc={true}
                                  timeFormat={false}
                                  index={index}
                                  dateFormat="DD/MM/YYYY"
                                  isValidDate={this.isStartDateValid.bind(this)}
                                  value={schedulingStartDate}
                                  onChange={startDate => this.handleDigitalRightsDateChanged(schedulingStartDateField, startDate)}
                                  getValidationMessage={getValidationMessage}
                        />
                        {this.renderHiddenValidationInput()}
                    </Col>
                    <Col md={6}>
                        <DateTime fieldData={schedulingEndDateField}
                                  utc={true}
                                  timeFormat={false}
                                  index={index}
                                  dateFormat="DD/MM/YYYY"
                                  isValidDate={this.isEndDateValid.bind(this)}
                                  value={schedulingEndDate}
                                  onChange={endDate => this.handleDigitalRightsDateChanged(schedulingEndDateField, endDate)}
                                  getValidationMessage={getValidationMessage}
                        />
                    </Col>
                </Row>
            </FormValidationWrapper> );
    }
}

export default Scheduling;
