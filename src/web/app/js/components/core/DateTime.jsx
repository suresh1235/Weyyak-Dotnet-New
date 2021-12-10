import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import FormValidationWrapper from 'components/core/FormValidationWrapper';
import Datetime from 'react-datetime';
import moment from 'moment';

/**
 * The class defines a DateTime component
 */
@observer
class DateTime extends Component {

    /** The component's properties */
    static propTypes = {
        timeFormat: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool
        ]),
        utc: PropTypes.bool,
        required: PropTypes.bool,
        disabled: PropTypes.bool,
        isValidDate: PropTypes.func,
        value: PropTypes.instanceOf(moment),
        onChange: PropTypes.func,
        fieldData: PropTypes.shape({
            label: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            disabled: PropTypes.bool,
            showIcon: PropTypes.bool,
            validations: PropTypes.arrayOf(PropTypes.shape({
                    name: PropTypes.string.isRequired,
                    customMessage: PropTypes.string,
                    msgArgs: PropTypes.arrayOf(PropTypes.string)
                }
            ))
        }).isRequired
    };

    /**
     * Construct DateTime component
     * @param {Object} props - components properties
     */
    constructor(props) {
        super(props);

        const {fieldData: { name }, index } = this.props;
        this.name = `${name}${index ? index : ''}`;

        this.handleDateTimeChanged = this.handleDateTimeChanged.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleInputClick = this.handleInputClick.bind(this);
    }

    /**
     * Handle date time changed
     * @param {Date} value - date.
     */
    handleDateTimeChanged(value) {
        const { onChange } = this.props;
        //save and show only dates
        const date = value instanceof moment ? value : null;
        !date &&  this[this.name].setState({inputValue: ''});
        onChange && onChange(date);
    }

    /**
     * Handle Date time blur
     */
    handleBlur() {
        const { state: { isCalendarOpen }, open } = this[this.name];
        this[this.name].setState({isCalendarOpen: false});
    }

    /**
     * Handle Date time input field click
     */
    handleInputClick() {
        const { state: { isCalendarOpen }, open, props: { inputProps } } = this[this.name];
        if(inputProps.disabled){
            return;
        }
        if(!isCalendarOpen) {
            this[this.name].openCalendar();
            this[this.name].setState({isCalendarOpen: true});
        } else {
            this[this.name].setState({isCalendarOpen: false});
        }
        open && this[this.name].setState({ isCalendarOpen: true });
    }


    /**
     * Render Date time control
     * @returns {JSX}
     */
    renderDateTime() {
        const {fieldData: { validations, disabled: disabledConfig}, timeFormat, utc, dateFormat, value, isValidDate, disabled: disabledProps, index} = this.props;
        return (
            <Datetime timeFormat={timeFormat}
                      utc={utc}
                      dateFormat={dateFormat}
                      onChange={this.handleDateTimeChanged}
                      isValidDate={isValidDate}
                      value={value}
                      name={this.name}
                      validations={validations}
                      inputProps={{name: this.name, disabled: disabledProps || disabledConfig, autoComplete : "off", onPaste: () => { return false; } }}
                      ref={dateTime => {this[this.name] = dateTime}}
            />
        )
    }

    /**
     * @see Component#render()
     */
    render() {
        const {fieldData: { showIcon, label, validations}, getValidationMessage } = this.props;
        return (
            <div className="form-input-group">
                <label>{label}</label>
                <div onClick={this.handleInputClick} onBlur={this.handleBlur}>
                    {
                        validations && validations.length ?
                        <FormValidationWrapper validationClass validationMessage={getValidationMessage} ref={wrapper => {
                                this[this.name] = wrapper ? wrapper.wrappedInstance.refs[this.name] : null}
                            }>
                            {this.renderDateTime()}
                        </FormValidationWrapper> : this.renderDateTime()
                    }
                </div>
                { showIcon === undefined || showIcon ? <span className="datetime-icon">
                    <span className="fa fa-calendar"></span>
                </span>: null}
            </div>
        )
    }
}

export default DateTime;
