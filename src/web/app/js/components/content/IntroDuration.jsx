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
class IntroDuration extends Component {

    /**
     * @see Component#render()ads
     */
    render() {
        const { onChange, value, introDurations, index } = this.props;

        this.field = {
            element: FormControl,
            label: 'Intro Duration **',
            props: {
                name: `IntroDuration${index}`,
                className: "form-control",
                type: 'text',
                validations: [
                    {
                        name: 'required',
                        customMessage: validationMessages.specifyData,
                        msgArgs: ['Intro Duration']
                    },
                    {
                        name:'minuteSeconds',
                        customMessage:validationMessages.enterTime
                    },
                    // {
                    //     name: 'dataInRange',
                    //     customMessage: validationMessages.tooLong,
                    //     args: [0, 256],
                    //     msgArgs: ['Intro Duration', 256]
                    // },
                    // {
                    //     name: 'exists',
                    //     args: IntroDurations,
                    //     msgArgs: ['Content with this ID']
                    // },
                    // {
                    //     name: 'transcoding',
                    //     server: true
                    // }
                ],
                key: 'IntroDuration'
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

export default IntroDuration;
