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
class ContentId extends Component {

    /**
     * @see Component#render()ads
     */
    render() {
        const { onChange, value, videoContentIds, index } = this.props;

        this.field = {
            element: FormControl,
            label: 'Content ID **',
            props: {
                name: `videoContentId${index}`,
                className: "form-control",
                type: 'text',
                validations: [
                    {
                        name: 'required',
                        customMessage: validationMessages.specifyData,
                        msgArgs: ['Content ID']
                    },
                    {
                        name: 'dataInRange',
                        customMessage: validationMessages.tooLong,
                        args: [0, 256],
                        msgArgs: ['Content ID', 256]
                    },
                    // {
                    //     name: 'exists',
                    //     args: videoContentIds,
                    //     msgArgs: ['Content with this ID']
                    // },
                    // {
                    //     name: 'transcoding',
                    //     server: true
                    // }
                ],
                key: 'videoContentId'
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

export default ContentId;
