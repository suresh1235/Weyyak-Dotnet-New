import React, { Component } from 'react';
import {
    FormControl,
} from 'react-bootstrap';
import FieldWrapper  from 'components/core/FieldWrapper';
import validationMessages from 'validations/validationMessages';
import { getValidationMessage, scrollUp, scrollDownFromHeader } from 'components/core/Utils';
import 'react-datetime/css/react-datetime.css';

/**
 * The class defines a Content variance component
 */
class IntroStartTime extends Component {

    /**
     * @see Component#render()ads
     */
    render() {
        const { onChange, value, introStarts, index } = this.props;

        this.field = {
            element: FormControl,
            label: 'Intro Start Time **',
            props: {
                name: `introStart${index}`,
                className: "form-control",
                type: 'text',
                validations: [
                    {
                        name: 'required',
                        customMessage: validationMessages.specifyData,
                        msgArgs: ['Intro Start Time']
                    },
                    {
                        name:'hourMinuteSeconds',
                        customMessage:validationMessages.enterFullTime
                    },
                    // {
                    //     name: 'dataInRange',
                    //     customMessage: validationMessages.tooLong,
                    //     args: [0, 256],
                    //     msgArgs: ['Intro Duration', 256]
                    // },
                    // {
                    //     name: 'exists',
                    //     args: introStarts,
                    //     msgArgs: ['Content with this ID']
                    // },
                    // {
                    //     name: 'transcoding',
                    //     server: true
                    // }
                ],
                key: 'introStart'
            },
        };

        return (
                <FieldWrapper fieldConfig={this.field}
                              handleChange={onChange}
                              index={index}
                              value={value}/>
        );
    }
}

export default IntroStartTime;
