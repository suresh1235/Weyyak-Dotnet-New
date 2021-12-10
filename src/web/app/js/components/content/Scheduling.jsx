import React, { Component, PropTypes } from 'react';
import { getValidationMessage } from 'components/core/Utils';
import {
    Row,
    Col
} from 'react-bootstrap';
import DateTime from 'components/core/DateTime';
import FormValidationWrapper from 'components/core/FormValidationWrapper';
import moment from 'moment';

/**
 * The class defines scheduling component
 */
class Scheduling extends Component {

    /** The component's properties */
    static propTypes = {
        field: PropTypes.shape().isRequired,
        value: PropTypes.shape(),
        dateRange: PropTypes.shape({
            startDate: PropTypes.shape(),
            endDate: PropTypes.shape()
        }),
        onChange: PropTypes.func,
        index: PropTypes.number
    };

    /**
     * Construct scheduling component
     * @param {Array} props - component's arguments
     */
    constructor(props) {
        super(props);
        this.isSchedulingDateTimeValid = this.isSchedulingDateTimeValid.bind(this);
    }

    /**
     * Valid scheduling date
     * @param {Moment} dateTime - current datetime.
     * @param {Moment} yesterday - yesterday date.
     * @returns {Boolean} whether scheduling datetime is valid
     */
    isSchedulingDateTimeValid(dateTime, yesterday) {
        const { dateRange } = this.props;
        if (dateRange) {
            const { dateRange: { startDate, endDate }} = this.props;
            return dateTime > yesterday && startDate && endDate &&
                dateTime >= startDate && dateTime <= endDate;
        }
        return dateTime > yesterday
    }

    /**
     * Scheduling changed handler
     * @param {Moment} dateTime - selected date time
     */
    handleSchedulingChanged(dateTime) {
        const { onChange } = this.props;
        onChange && onChange(dateTime);
    }

    /**
     * @see Component#render()ads
     */
    render() {
        const { field, value, index } = this.props;
        const daysBeforeNow = 1;
        const yesterday = moment().add(-daysBeforeNow, 'days');
        const { dateRange: {startDate, endDate}} = this.props;

        return (
            <FormValidationWrapper
                validationClass
                validationMessage={getValidationMessage}>
                <Row>
                    <Col>
                        <h3 className="block">Scheduling</h3>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <DateTime timeFormat="HH:mm"
                                  dateFormat="DD/MM/YYYY"
                                  index={index}
                                  isValidDate={date => this.isSchedulingDateTimeValid(date, yesterday)}
                                  value={value}
                                  onChange={endDate => this.handleSchedulingChanged(endDate)}
                                  fieldData={field}
                                  disabled={!startDate || !endDate}
                                  getValidationMessage={getValidationMessage}
                        />
                    </Col>
                </Row>
            </FormValidationWrapper>);
    }
}

export default Scheduling;

