import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import {observer, inject} from 'mobx-react';
import {  toJS } from 'mobx';
import moment from 'moment';

import {Row,Button,Col} from 'react-bootstrap';
import Confirm from 'components/core/Confirm';
import FormValidationWrapper from 'components/core/FormValidationWrapper';
import {
  getValidationMessage,
  scrollDownFromHeader,
} from 'components/core/Utils';
import CollapsiblePanel from 'components/core/CollapsiblePanel';
import UploaderComponent from 'components/content/UploaderComponent';
import ProductName from 'components/content/ProductName';
import PlanName from 'components/content/PlanName';
import VarianceContentIdAndLanguage from 'components/content/VarianceContentIdAndLanguage';
import TrailersComponent from 'components/content/TrailersComponent';
import constants from 'constants/constants';
import RightsSection from 'components/content/RightsSection';
import Scheduling from 'components/content/Scheduling';
import PublishingPlatforms from 'components/shared/PublishingPlatforms';
import {OneTierContentFields} from 'constants/contentFields';
import 'react-datetime/css/react-datetime.css';

/**
 * The class defines a Content variance component
 */
@inject ('PrimaryInfoOTCStore')
@observer
class ContentVariance extends Component {
  /**
     * Construct Content Variance component
     * @param {Array} props - component's arguments
     */
  constructor (props) {
    super (props);

    this.state = {
      index: null,
      TrailerIndex:null,
      varianceIndex:null,
      ShowTrailerAlert:false,
      showConfirm: false,
      isScrolledToVariance: false,
      products : []
    };

    this.updateFile = this.updateFile.bind (this);
    this.resetField = this.resetField.bind (this);
    this.setUploadStatus = this.setUploadStatus.bind (this);
    this.handleTogglePlatforms = this.handleTogglePlatforms.bind (this);
    this.handleSelectPlatform = this.handleSelectPlatform.bind (this);
    this.handleSchedulingChanged = this.handleSchedulingChanged.bind (this);
    this.handleProductsChanged = this.handleProductsChanged.bind (this);
    this.handleDataChanged = this.handleDataChanged.bind (this);
    this.handlePlansChanged = this.handlePlansChanged.bind(this);
    this.onAdd = this.onAdd.bind (this);
    const {store} = this.props;
    this.addOneMoreTrailer = store.addTrailer.bind (store);
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

  removeTrailerRepeaterField (index,varianceIndex) {
    const {store} = this.props;
    store.removeTrailerItem (index,varianceIndex);
    this.setState ({ShowTrailerAlert: false});
  }

  
  onAdd () {
    const {
      publishOn: {publishingPlatforms: {publishingPlatformsList}},
    } = this.props;
    let count = 0;
    for (let i = 0; i < this.pageOrderData.length; i++) {
      count += this.pageOrderData[i].platforms.length;
    }
    if (count === publishingPlatformsList.length) {
      const {appStore} = this.props;
      appStore.setDisableNotificationReset (true);
      appStore.setNotification (
        Notification.Notifications.validation,
        constants.CANNOT_ADD_MORE
      );
      return;
    }

    const copy = cloneDeep (this.pageOrderData[0]);
    copy.platforms = [EMPTY_PLATFORM_PAGE_ORDER_INDEX];
    this.pageOrderData.push (copy);
    const publishingPlatformsOrder = this.convertPageOrderToPublishingPlatforms ();
    this.props.store.setPublishingPlatformsOrder (publishingPlatformsOrder);
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
     * Render trailer cancel confirmation popup
     * @returns {ReactNode} popup node
     */
  renderTrailerConfirmationView () {
    let {TrailerIndex,varianceIndex} = this.state;
    const bodyHtml = <p>Are you sure you want to remove this Trailer?</p>;

    return (
      <Confirm
        key="Trailerconfirm"
        onConfirm={this.removeTrailerRepeaterField.bind (this, TrailerIndex,varianceIndex)}
        onClose={() => {
          this.setState ({
            ShowTrailerAlert: false,
          });
        }}
        body={bodyHtml}
        visible={this.state.ShowTrailerAlert}
        cancelText="NO"
        confirmText="YES"
        title="Remove Trailer"
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

  handlePlansChanged (value) {
    this.handleDataChanged ('subscriptionPlans', value);
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
          // rightsStartDate: rightsStartDateFields,
          // rightsEndDate: rightsEndDateFields,
          // rightsType: rightsTypeFields,
          // rightsRegion: rightsRegionFields,
          // products: productsFields,
          // subscriptionPlans:subscriptionPlansFields,
          // scheduling: schedulingField,
          // platforms: platformsField,
          uploads: uploadFields,
          rightsStartDate: rightsStartDateFields,
          rightsEndDate: rightsEndDateFields,
          scheduling: schedulingFields,
          originType: originTypeFields,
          dubbingLanguage: dubbingLanguageFields,
          subtitlingLanguage: subtitlingLanguageFields,
          dialect: dialectFields,
          rightsType: rightsTypeFields,
          rightsRegion: rightsRegionFields,
          products: productsFields,
          subscriptionPlans:subscriptionPlansFields,
          scheduling: schedulingField,
          platforms: platformsField,
          Trailers: TrailersField,
          TrailerID: TrailerIDField,
          TrailerPoster: TrailerPosterfield,
          ValidateTrailersTitle: TrailerTitleValidater,
          ValidateTrailerPoster: TrailerPosterValidater
        },
      },
    } = OneTierContentFields;

    return (
      <div className="variance-item">
        {store.hasMinAmountExceeded &&
          <div
            className="forms-remove"
            onClick={() =>
              this.setState ({
                index: index,
                showConfirm: true,
              })}
          >
            &#10006;
          </div>}
        <FormValidationWrapper
          validationClass
          ref={`variance${index}`}
          validationMessage={getValidationMessage}
          key={index}
        >
          <CollapsiblePanel
            name={`Version ${index + 1}`}
            expanded={expanded}
            onToggle={this.handleToggleVariance.bind (this, index)}
          >
            <Row>
              {/* <div className="movie-name">
                {`${PrimaryInfoOTCStore.data.transliteratedTitle}`}
                {languageType &&
                  languageType !== constants.LANGUAGES.TYPES.ORIGINAL.NAME
                  ? `_${languageType.slice (0, 1).toUpperCase ()}`
                  : null}
                {languageType && languageCode
                  ? `${languageCode.slice (0, 1).toUpperCase ()}`
                  : null}
              </div> */}
            </Row>
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
            
                        <RightsSection
              fields={{
                rightsType: rightsTypeFields,
                rightsRegion: rightsRegionFields,
                rightsStartDate: rightsStartDateFields,
                rightsEndDate: rightsEndDateFields
              }}
              values={variance}
              index={index}
              store={store}
              onChange={this.handleDataChanged}
            />
            {this.props.variance.digitalRightsType !== 1 ?
            <PlanName
             field={subscriptionPlansFields}
             value={variance.subscriptionPlans? variance.subscriptionPlans.peek ():[]}
             store={store}
             onChange={this.handlePlansChanged}
            />: ""}
            <Scheduling
              field={schedulingField}
              index={index}
              value={variance.schedulingDateTime}
              dateRange={{
                startDate: variance.digitalRightsStartDate,
                endDate: variance.digitalRightsEndDate,
              }}
              onChange={this.handleSchedulingChanged}
            />
            <PublishingPlatforms
              field={platformsField}
              index={index}
              value={store.data[index].publishingPlatforms}
              store={store}
              markAll={store.defaultMultipleCheckboxContainer[index]}
              onAllToggle={this.handleTogglePlatforms}
              onSelect={this.handleSelectPlatform}
            />
            <ProductName
              field={productsFields}
              value={variance.products.peek ()}
              store={store}
              onChange={this.handleProductsChanged}
            />


           <CollapsiblePanel
            name={`Trailers`}
            expanded={true}
          >

           <Col>
               <div className="text-right">
                   <Button 
                   disabled={store.hasMaxTrailerReached(index)}
                    onClick={()=>this.addOneMoreTrailer(index)}
                     >Add Trailer</Button>
               </div>
           </Col>


            {variance.varianceTrailers.map((item,count)=>{
            return (
              <div className="variance-item">
                <h3 className="block">Trailer {count + 1}</h3>
                {
                  store.hasMinTrailerExceeded(index) && 
                  <div className="forms-remove"  
                  onClick={() =>
                      this.setState ({
                         varianceIndex:index,
                         TrailerIndex: count,
                         ShowTrailerAlert: true,
                      })}>
                      &#10006;
                  </div>
                }
                
                  <TrailersComponent
                       TrailerNum={count}
                       index={index}
                       variance={item}
                      //  variance={variance}
                       videoContentIds={videoContentIds}
                       store={store}
                       fields={{
                            TrailerID: TrailerIDField,
                            Trailers: TrailersField,
                            TrailerPoster: TrailerPosterfield,
                            ValidateTrailersTitle: TrailerTitleValidater,
                            ValidateTrailerPoster: TrailerPosterValidater
                           }}
                     />
              </div> 
            )
          
          })}
          </CollapsiblePanel>
          
          

         
          </CollapsiblePanel>
          
        </FormValidationWrapper>
        {this.renderConfirmationView ()}
        {this.renderTrailerConfirmationView ()}
      </div>
    );
  }
}

export default ContentVariance;