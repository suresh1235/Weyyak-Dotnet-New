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

import moment from 'moment';
import FormValidationWrapper from 'components/core/FormValidationWrapper';

/**
 * The class represents a component which allows to change a user's details
 */
@inject('appStore')
@observer
class EditUserDetails extends Component {

    /** The component's props */
    static propTypes = {
        userData: PropTypes.shape({
            firstName: PropTypes.string,
            lastName: PropTypes.string,
            countryId: PropTypes.number,
            languageId: PropTypes.number,
            statusName: PropTypes.string,
            registeredAt: PropTypes.string,
            email: PropTypes.string,
            tailoredGenres: PropTypes.string,
            activeDevices: PropTypes.string,
            numberOfActiveDevices: PropTypes.number,
            newslettersEnabledDisplayName: PropTypes.string,
            promotionsEnabledDisplayName: PropTypes.string,
            registrationSource: PropTypes.number
        })
    };

    /** The form elements */
    static layout = [
        {
            column1: { element: 'label', props: { htmlFor: 'firstName' }, children: [ 'First Name:' ] },
            column2: {
                element: FormControl,
                props: component => ({
                    id: 'firstName',
                    name: 'firstName',
                    type: 'text',
                    placeholder: 'First name',
                    onChange: component.handleInputChange,
                    value: component.state.firstName,
                    validations: [
                        {
                            name: 'maxLength',
                            args: [50],
                            msgArgs: [50]
                        }
                    ]
                })
            }
        },
        {
            column1: { element: 'label', props: { htmlFor: 'lastName' }, children: [ 'Last Name:' ] },
            column2: {
                element: FormControl,
                props: component => ({
                    id: 'lastName',
                    name: 'lastName',
                    type: 'text',
                    placeholder: 'Last name',
                    onChange: component.handleInputChange,
                    value: component.state.lastName,
                    validations: [
                        {
                            name: 'maxLength',
                            args: [50],
                            msgArgs: [50]
                        }
                    ]
                })
            }
        },
        {
            column1: { element: 'label', children: [ 'Status:' ] },
            column2: {
                element: 'label',
                children: component => [component.props.userData.statusName]
            }
        },
        {
            column1: { element: 'label', props: { htmlFor: 'countryId' }, children: [ 'Country:' ] },
            column2: {
                element: FormControl,
                props: component => ({
                    id: 'countryId',
                    name: 'countryId',
                    type: 'select',
                    componentClass: 'select',
                    placeholder: 'Country name',
                    onChange: component.handleInputChange,
                    value: component.state.countryId || -1
                }),
                children: component => {
                    const { appStore } = component.props;
                    const countries = appStore.Countries;
                    const noCountry = <option key="noCountry" value={-1}/>;
                    return countries ?
                        [].concat(noCountry, countries.map(country =>
                            <option key={country.id} value={country.id}>{country.englishName}</option>)) :
                        [noCountry];
                }
            }
        },
        {
            column1: { element: 'label', children: [ 'Registration Date:' ] },
            column2: {
                element: 'label',
                children: component => [moment(component.props.userData.registeredAt).format('DD/MM/YYYY')]
            }
        },
        {
            column1: { element: 'label', children: [ 'Email Address:' ] },
            column2: {
                element: 'label',
                children: component => [component.props.userData.email]
            }
        },
        //{
        //    column1: { element: 'label', children: [ 'Phone Number:' ] },
        //    column2: {
        //        element: 'label',
        //        children: component => [component.props.userData.phoneNumber]
        //    }
        //},
        {
            column1: { element: 'label', children: [ 'Tailored Genres:' ] },
            column2: {
                element: 'label',
                children: component => [component.props.userData.tailoredGenres]
            }
        },
        {
            column1: { element: 'label', children: [ 'Active Devices:' ] },
            column2: {
                element: 'label',
                children: component => [component.props.userData.activeDevicePlatformNames]
            }
        },
        {
            column1: { element: 'label', children: [ 'Number of Active Devices:' ] },
            column2: {
                element: 'label',
                children: component => [component.props.userData.numberOfActiveDevices]
            }
        },
        {
            column1: { element: 'label', props: { htmlFor: 'languageId' }, children: [ 'Language:' ] },
            column2: {
                element: FormControl,
                props: component => ({
                    id: 'languageId',
                    name: 'languageId',
                    type: 'select',
                    componentClass: 'select',
                    placeholder: 'Language Name',
                    onChange: component.handleInputChange,
                    validations: ['required'],
                    value: component.state.languageId
                }),
                children: component => {
                    const { appStore } = component.props;
                    const languages = appStore.Languages;
                    return languages &&
                        languages.map(language =>
                            <option key={language.id} value={language.id}>{language.name}</option>)
                }
            }
        },
        {
            column1: { element: 'label', children: [ 'Newsletter:' ] },
            column2: {
                element: 'label',
                children: component => [component.props.userData.newslettersEnabledDisplayName]
            }
        },
        {
            column1: { element: 'label', children: [ 'Promotions:' ] },
            column2: {
                element: 'label',
                children: component => [component.props.userData.promotionsEnabledDisplayName]
            }
        },
        {
            column1: { element: 'label', children: [ 'Source:' ] },
            column2: {
                element: 'label',
                children: component => [component.props.userData.registrationSourceName]
            }
        }
    ];

    /**
     * Construct a component's instance
     * @param {Array} args - a component's arguments
     */
    constructor(...args) {
        super(...args);

        const [ props ] = args;
        const { userData: { firstName, lastName, countryId, languageId } } = props;

        this.state = {
            firstName: firstName || '',
            lastName: lastName || '',
            countryId,
            languageId
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Handle a change of a controlled input
     * @param {Object} event - an event to be handled
     */
    handleInputChange(event) {
        const { name, value, selectedOptions } = event.target;
        const newState = {[name]: value};
        if (selectedOptions && selectedOptions.length) {
            newState[name.replace(/Id/, 'Name')] = selectedOptions[0].text;
        }
        this.setState(newState);
    }

    /**
     * Handle a form submission
     */
    handleSubmit() {
        const { countryId, ...restState } = this.state;
        this.props.onSubmit({ countryId: countryId != -1 ? countryId : null, ...restState });
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
            <Col className="first-column" md={4}>
                {
                    React.createElement(element1,
                        props1 instanceof Function ? props1(this) : props1,
                        children1 instanceof Function ? children1(this) : children1)
                }
            </Col>
            <Col md={6}>
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
        const { userData, submitBtnId } = this.props;
        return (
            <div className="bo-essel-edit-user">
                <FormValidationWrapper>
                    <Form className="bo-essel-form default" horizontal onSubmit={this.handleSubmit}>
                        <FormGroup>
                            {
                                userData && EditUserDetails.layout.map(this.renderFormElement.bind(this))
                            }
                        </FormGroup>
                        <Button id={submitBtnId} type="submit"/>
                    </Form>
                </FormValidationWrapper>
            </div>
        );
    }
}

export default EditUserDetails;