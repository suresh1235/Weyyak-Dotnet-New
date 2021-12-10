import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {observer, inject} from 'mobx-react';
import moment from 'moment';

import {Row} from 'react-bootstrap';
import Confirm from 'components/core/Confirm';
import FormValidationWrapper from 'components/core/FormValidationWrapper';
import {
  getValidationMessage,
  scrollDownFromHeader,
} from 'components/core/Utils';
import CollapsiblePanel from 'components/core/CollapsiblePanel';
import UploaderComponent from 'components/content/UploaderComponent';
import VarianceContentIdAndLanguage
  from 'components/content/VarianceContentIdAndLanguage';
import constants from 'constants/constants';
import {OneTierContentFields} from 'constants/contentFields';
import 'react-datetime/css/react-datetime.css';

/**
 * The class defines a Content variance component
 */
@inject ('PrimaryInfoOTCStore')
@observer
class ContentVersion extends Component {
  /**
     * Construct Content Variance component
     * @param {Array} props - component's arguments
     */
  constructor (props) {
    super (props);

    this.state = {
      index: null,
      showConfirm: false,
      isScrolledToVariance: false,
    };

    this.updateFile = this.updateFile.bind (this);
    this.resetField = this.resetField.bind (this);
    this.setUploadStatus = this.setUploadStatus.bind (this);
    this.handleTogglePlatforms = this.handleTogglePlatforms.bind (this);
    this.handleSelectPlatform = this.handleSelectPlatform.bind (this);
    this.handleDataChanged = this.handleDataChanged.bind (this);
  }

  /**
     *  Toggle variance handler
     * @param {Number} index - variance index
     */
  handleToggleVariance (index) {
    const {store} = this.props;
    store.toggleVariance (index);
  }

  /**
     * Updates file on server.
     * @param {String} fieldName - name of changed field.
     * @param {Object} file - file for upload.
     * @param {Object} event - browser event.
     */
  updateFile (fieldName, file, event) {
    const {store, index} = this.props;
    store.updateFile (index, fieldName, file);
  }

  /**
     * Resets field.
     * @param {String} fieldName - name of resets field.
     * @param {Object} event - browser event.
     */
  resetField (fieldName, event) {
    const {store, index} = this.props;
    store.resetField (index, fieldName);
  }

  /**
     * Sets status of upload.
     * @param {String} fieldName - name of changed field.
     * @param {String} status - current upload status.
     * @param {Object} event - browser event.
     */
  setUploadStatus (fieldName, status, event) {
    const {store, index} = this.props;
    store.setUploadStatus (index, fieldName, status);
  }

  /**
     * Remove one element.
     * @param {Number} index - element's index.
     */
  removeRepeaterField (index) {
    const {store} = this.props;
    store.removeItem (index);
    this.setState ({showConfirm: false});
  }

  /**
     * Render cancel confirmation popup
     * @returns {ReactNode} popup node
     */
  renderConfirmationView () {
    let {index} = this.state;
    const bodyHtml = <p>Are you sure you want to remove this variance?</p>;

    return (
      <Confirm
        key="confirm"
        onConfirm={this.removeRepeaterField.bind (this, index)}
        onClose={() => {
          this.setState ({
            showConfirm: false,
          });
        }}
        body={bodyHtml}
        visible={this.state.showConfirm}
        cancelText="NO"
        confirmText="YES"
        title="Remove Variance"
      />
    );
  }

  /**
     * Set content types
     * @param {Number} index - element's index.
     * @param {Function} converter - converter.
     * @param {Object} event - native browser data about event.
     */
  handleChange (index, converter, fieldName, event) {
    const {store} = this.props;
    const {target: {name, value}} = event;
    store.setData (
      index,
      fieldName || name,
      converter ? converter (value) : value
    );
  }

  /**
     * Data changed handler
     * @param {String} name - data property name
     * @param {Object} value - data value
     */
  handleDataChanged (name, value) {
    const {store, index} = this.props;
    store.setData (index, name, value);
  }

  /**
     * Scheduling changed event handler
     * @param {Date} dateTime - selected date.
     */
  handleSchedulingChanged (dateTime) {
    this.handleDataChanged ('schedulingDateTime', dateTime);
  }

  /**
     * Handle products changed
     * @param {Object} value - product name values
     */
  handleProductsChanged (value) {
    this.handleDataChanged ('products', value);
  }

  /**
     * Select platform handler
     * @param {Number} platformId - platform id
     * @param {Boolean} isChecked - whether platform is checked
     */
  handleSelectPlatform (platformId, isChecked) {
    const {store, index} = this.props;
    store.togglePlatform (platformId, isChecked, index);
  }

  /**
     * Toggles all platforms checkboxes.
     */
  handleTogglePlatforms () {
    const {store, index} = this.props;
    store.toggleCheckboxes (index);
  }

  /**
     * @see Component#componentDidMount()
     */
  componentDidUpdate () {
    const {scrollToVariance} = this.props;
    if (scrollToVariance && !this.state.isScrolledToVariance) {
      const node = findDOMNode (this);
      node.scrollIntoView (true);
      scrollDownFromHeader ();
      this.setState ({isScrolledToVariance: true});
    }
  }

  /**
     * @see Component#render()ads
     */
  render () {
    const {
      store,
      variance,
      variance: {languageType, dubbingLanguage, subtitlingLanguage},
      index,
      videoContentIds,
      PrimaryInfoOTCStore,
      expanded,
    } = this.props;
    const languageCode = dubbingLanguage || subtitlingLanguage;
    const uploadersData = store.getData ();
    const uploadStatus = store.getUploadStatus (index);
    const multipleCheckboxContainer =
      store.defaultMultipleCheckboxContainer[index];
    const yesterday = moment ().add (-1, 'days');
    const {
      variance: {
        fields: {
          uploads: uploadFields,
          originType: originTypeFields,
          dubbingLanguage: dubbingLanguageFields,
          subtitlingLanguage: subtitlingLanguageFields,
          dialect: dialectFields,

        },
      },
    } = OneTierContentFields;

    return (
         <div className = "variance-item">
        {/* // <div className={index>0?"variance-item  hidden":"variance-item"}></div> */}
          <CollapsiblePanel
            name={`Version ${index + 1}`}
            expanded={expanded}
            onToggle={this.handleToggleVariance.bind (this, index)}
          >
            {/* <Row>
              <div className="movie-name">
                {`${PrimaryInfoOTCStore.data.transliteratedTitle}`}
                {languageType &&
                  languageType !== constants.LANGUAGES.TYPES.ORIGINAL.NAME
                  ? `_${languageType.slice (0, 1).toUpperCase ()}`
                  : null}
                {languageType && languageCode
                  ? `${languageCode.slice (0, 1).toUpperCase ()}`
                  : null}
              </div>
            </Row> */}
            <VarianceContentIdAndLanguage
              index={index}
              variance={variance}
              videoContentIds={videoContentIds}
              store={store}
              fields={{
                dubbingLanguage: dubbingLanguageFields,
                subtitlingLanguage: subtitlingLanguageFields,
                originType: originTypeFields,
                dialect: dialectFields,
              }}
            />
            {uploadFields.map ((field, key) => (
              field.name?
              <UploaderComponent
                key={key}
                index={index}
                fieldData={field}
                uploadStatus={uploadStatus[field.name]}
                updateFile={this.updateFile}
                resetField={this.resetField}
                setUploadStatus={this.setUploadStatus}
                fileData={uploadersData[index][field.name]}
                preview={field.preview}
                dataType={field.dataType}              
              />:''
            ))}

          </CollapsiblePanel>
          </div>
    );
  }
}

export default ContentVersion;
