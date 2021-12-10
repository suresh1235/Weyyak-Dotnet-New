import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import {
    Row,
    Col
} from 'react-bootstrap';
import LanguageType from 'components/content/LanguageType';
import Dialect from 'components/content/Dialect';
import DubbingSubtitlingLanguage from 'components/content/DubbingSubtitlingLanguage';
import FormValidationWrapper from 'components/core/FormValidationWrapper';
import { getSetterName, buildString, getValidationMessage } from 'components/core/Utils'
import ContentId from 'components/content/ContentId';
import IntroDuration from 'components/content/IntroDuration';
import IntroStartTime from 'components/content/IntroStartTime';


/**
 * The class defines a variance contentId and language component
 */
@observer
class VarianceContentIdAndLanguage extends Component {

    /** The component properties */
    static propTypes = {
        fields: PropTypes.shape().isRequired,
        store: PropTypes.shape().isRequired,
        index: PropTypes.number.isRequired,
        variance: PropTypes.shape().isRequired
    };

    /**
     * Set content types
     * @param {Number} index - element's index.
     * @param {Object} event - native browser data about event.
     */
    handleChangeContentId(index, converter, event) {
        const { store } = this.props;
        const {target: { value }} = event;
        store.setData(index, 'videoContentId', converter ? converter(value) : value);
    }

    handleChangeIntroDuration(index, converter, event) {
        const { store } = this.props;
        const {target: { value }} = event;
        console.log(value)
        store.setData(index, 'introDuration', converter ? converter(value) : value);
        // var seconds = new Date('1970-01-01T' + value + 'Z').getTime() / 1000;
        // console.log(seconds)
        // store.setData(index, 'introDuration', converter ? converter(seconds) : seconds);

        // var d = Number(seconds);
        // var h = Math.floor(d / 3600);
        // var m = Math.floor(d % 3600 / 60);
        // var s = Math.floor(d % 3600 % 60);
    
        // var hDisplay = h > 0 ? h + (h == 1 ? "" : "") : "00";
        // var mDisplay = m > 0 ? m + (m == 1 ? "" : "") :  "00";
        // var sDisplay = s > 0 ? s + (s == 1 ? "" : "") : "00";
        // // return hDisplay + mDisplay + sDisplay; 
        // var hour=hDisplay +":"+ mDisplay + ":"+ sDisplay
        // console.log(hour)
    }

    setintoDuration(index,value){
        const { store } = this.props;
        store.setData(index, 'introDuration', value);

    }

    handleChangeIntroStartTime(index, converter, event) {
        const { store } = this.props;
        const {target: { value }} = event;
        console.log(value)
        store.setData(index, 'introStart', converter ? converter(value) : value);
        var seconds = new Date('1970-01-01T' + value + 'Z').getTime() / 1000;
        // console.log(seconds)
        // store.setData(index, 'IntroStart', converter ? converter(seconds) : seconds);
        // var hours=secondsToHms(seconds)
        // console.log(hours)
        // var d = Number(seconds);
        // var h = Math.floor(d / 3600);
        // var m = Math.floor(d % 3600 / 60);
        // var s = Math.floor(d % 3600 % 60);
    
        // var hDisplay = h > 0 ? h + (h == 1 ? "" : "") : "00";
        // var mDisplay = m > 0 ? m + (m == 1 ? "" : "") :  "00";
        // var sDisplay = s > 0 ? s + (s == 1 ? "" : "") : "00";
        // // return hDisplay + mDisplay + sDisplay; 
        // var hour=hDisplay +":"+ mDisplay + ":"+ sDisplay
        // console.log(hour)
    }

     secondsToHms(d) {
        
        // if((/^((?!:).)*$/.test(d)))
        // {
            console.log(Number(d))
            console.log(/^(?:([01]?\d|2[0-3]):([0-5]?\d):)?([0-5]?\d)$/.test(d))
            if(/^((?=(?:\D*\d\D*){6})(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d))$/gm.test(d))
            {
                console.log('1')
                return d
            }
            else if(Number(d)===NaN)
            {
                console.log('2')
                return d
            }
            else if(Number(d)===0)
            {
                console.log('3')
                return d;
            }
            else
            {
                console.log('4')
                console.log(d)
                d = Number(d);
                var h = Math.floor(d / 3600);
                var m = Math.floor(d % 3600 / 60);
                var s = Math.floor(d % 3600 % 60);
            
                var hDisplay = h > 0 ? h + (h == 1 ? "" : "") : "00";
                var mDisplay = m > 0 ? m + (m == 1 ? "" : "") :  "00";
                var sDisplay = s > 0 ? s + (s == 1 ? "" : "") : "00";
                return hDisplay +":"+ mDisplay + ":"+ sDisplay; 

            }

           

        // }
        
        
    }

    secondsTommss(d) {
        // console.log(d)
        // if(!/^[0-5]?\d:[0-5]\d$/.test(d))
        // if(d.length>5 && (!/^[0-5]?\d:[0-5]\d$/.test(d)))
        // {
            console.log(Number(d))
            // console.log(/^(?:([01]?\d|2[0-3]):([0-5]?\d):)?([0-5]?\d)$/.test(d))
            if(/^[0-5]?\d:[0-5]\d$/.test(d))
            {
                console.log('1')
                return d
            }
            else if(Number(d)===NaN)
            {
                console.log('2')
                return d
            }
            else if(Number(d)===0)
            {
                console.log('3')
                return d;
            }
            else
            {
                console.log('4')
                d = Number(d);
                var h = Math.floor(d / 3600);
                var m = Math.floor(d % 3600 / 60);
                var s = Math.floor(d % 3600 % 60);
            
                var hDisplay = h > 0 ? h + (h == 1 ? "" : "") : "00";
                var mDisplay = m > 0 ? m + (m == 1 ? "" : "") :  "00";
                var sDisplay = s > 0 ? s + (s == 1 ? "" : "") : "00";
                return hDisplay +":"+ mDisplay; 
            }
            
               

            
            
           
        // }
        // else
        // {
        //     return d;
        // }
        
       
    }

    // componentWillMount()
    // {
        
    // }
    


    /**
     * @see Component#render()
     */
    render() {
        const { store,
            store: { dubbing, subtitling, dialects, originTypes, data: variances },
            fields: {
                dubbingLanguage: dubbingLanguageFields,
                subtitlingLanguage: subtitlingLanguageFields,
                originType: originTypeFields,
                dialect: dialectFields},
            variance, index, videoContentIds,introDurations ,introStarts   } = this.props;
        const updateLanguage = store.updateLanguage.bind(store, index);
        const handleChangeContentId = this.handleChangeContentId.bind(this, index, null);
        const handleChangeIntroDuration = this.handleChangeIntroDuration.bind(this, index, null);
        const handleChangeIntroStartTime = this.handleChangeIntroStartTime.bind(this, index, null);
        const secondsToHms = this.secondsToHms.bind(this);
        const secondsTommss = this.secondsTommss.bind(this);
        const setintoDuration = this.setintoDuration.bind(this);
        
        console.log(variance)
        // setintoDuration(index,"02:20")
        // console.log(variance)

    //       if(variance.introDuration)
    //         {
    //             console.log(variance.introDuration)
    //             var seconds = new Date('1970-01-01T' + variance.introDuration + 'Z').getTime() / 1000;
    //             console.log(seconds)
    //             variance.introDuration=seconds
    //         }
    //         else
    //         {
    //             console.log('no')
    //         }
     
    // // console.log(txtData)

        return (
            <FormValidationWrapper
                validationClass
                validationMessage={getValidationMessage}>
                <Row>
                    <Col md={6}>
                        <ContentId
                            onChange={handleChangeContentId}
                            value={variance.videoContentId}
                            videoContentIds={videoContentIds}
                            index={index}/>
                    </Col>
                    <Col md={6}>
                        <DubbingSubtitlingLanguage
                            fields={{dubbing: dubbingLanguageFields, subtitling: subtitlingLanguageFields}}
                            translations={variances}
                            values={variance}
                            dubbing={dubbing}
                            subtitling={subtitling}
                            onChange={updateLanguage}
                            index={index}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <LanguageType
                            field={originTypeFields}
                            translations={variances}
                            originTypes={originTypes}
                            onlyOriginal={false}
                            value={variance.languageType}
                            onChange={updateLanguage}
                            index={index}
                        />
                    </Col>
                    <Col md={6}>
                        <Dialect
                            field={dialectFields}
                            translations={variances}
                            values={variance}
                            dialects={dialects}
                            onChange={updateLanguage}
                            index={index}
                        />
                    </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <IntroDuration
                                onChange={handleChangeIntroDuration}
                                value={variance.introDuration}
                                // value={(/^[0-5]?\d:[0-5]\d$/.test(variance.introDuration)) && variance.introDuration <= 5   || variance.introDuration==="" || variance.introDuration===null ? variance.introDuration : (variance.introDuration).length >=3 && !variance.introDuration.include(':') && (!/^[0-5]?\d:[0-5]\d$/.test(variance.introDuration)) ?  secondsTommss(variance.introDuration) : variance.introDuration }
                                introDurations={introDurations}
                                index={index}/>
                        </Col>
                        <Col md={6}>
                            <IntroStartTime
                                onChange={handleChangeIntroStartTime}
                                value={variance.introStart}
                                // value={variance.introStart && variance.id  && (/^((?!:).)*$/.test(variance.introStart)) ? secondsToHms(variance.introStart) :variance.introStart}
                                introStarts={introStarts}
                                index={index}/>
                        </Col>
                        
                    </Row>
            </FormValidationWrapper>
        );
    }
}

export default VarianceContentIdAndLanguage;
