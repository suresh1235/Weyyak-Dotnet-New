import React, {Component, PropTypes} from 'react';
import {observer} from 'mobx-react';
import {Row, Col} from 'react-bootstrap';
import FormValidationWrapper from 'components/core/FormValidationWrapper';
import {getValidationMessage} from 'components/core/Utils';
import FieldWrapper from 'components/core/FieldWrapper';
import DateTime from 'components/core/DateTime';
import CheckboxTreeComponent from 'components/core/CheckboxTreeComponent';
import PlanName from 'components/content/PlanName';
import { observable } from "mobx";
/**
 * The class defines a Rights Section component
 */
@observer class RightsSectionMultitierSession extends Component {
  /** The component properties */
  static propTypes = {
    store: PropTypes.shape ().isRequired,
    onChange: PropTypes.func,    
    fields: PropTypes.shape ({
      rightsType: PropTypes.shape().isRequired,
      rightsRegion: PropTypes.shape().isRequired,
      rightsStartDate: PropTypes.shape ().isRequired,
      rightsEndDate: PropTypes.shape ().isRequired,
      plansType:PropTypes.shape()
    }).isRequired,
    values: PropTypes.shape ({
      digitalRightsType: PropTypes.number,
      digitalRightsStartDate: PropTypes.shape(),
      digitalRightsRegions: PropTypes.object,
      digitalRightsEndDate: PropTypes.shape(),
      subscriptionPlans: PropTypes.Array
    }).isRequired,
  };

  /**
     * Construct a Rights Section component
     * @param {Array} props component's arguments
     */
  constructor (props) {
    super (props);
    this.state = {
    }
    const {store} = this.props;

    this.getRightsRegions = this.getRightsRegions.bind (this);
    this.getRightsTypesOptions = this.getRightsTypesOptions.bind (this);
    this.isStartDateValid = this.isStartDateValid.bind (this);
    this.isEndDateValid = this.isEndDateValid.bind (this);
    this.setExpandedNodes = store.setExpandedNodes.bind (store);
    this.getExpandedNodes = store.getExpandedNodes.bind (store);
    this.getSubscriptionPlans = this.getSubscriptionPlans.bind(this);
    this.handlePlansChanged = this.handlePlansChanged.bind(this);
    this.handlePlanChanged = this.handlePlanChanged.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  /**
     * @see Component#componentWillMount()
     */
  componentWillMount () {
    const {store} = this.props;
    store.fetchAllRightsMaps && store.fetchAllRightsMaps ();
  }

  /**
     * Get rights types options
     * @returns {Array} rights types options
     */
  getRightsTypesOptions () {
    const {store} = this.props;
    return store.digitalRightsTypes
    
      ? store.digitalRightsTypes.map (rightsType => ({
          label: rightsType.name,
          value: rightsType.id,
          // TODO: remove it in future.
          // For the 1st relese of CMS only AVOD should be enabled for being chosen.
          // Rest of options should be disabled
         // disabled: rightsType.id !== 1,
        }))
      : [];
  }

  getRightsRegions () {
    const {store} = this.props;
    return store.getRightsRegions ();
  }

  /**
     * Handle select changed
     * @param {Object} field - field config
     * @param {Object} option - select option
     */
  handleSelectChange (name, option) {
    var data= this.props.seasonvariance
    this.data = true
    const {onChange} = this.props;
    onChange && onChange (name, option ? option.value : null);
  }

   /**
     * Handle select changed
     * @param {Object} field - field config
     * @param {Object} option - select option
     */
    handleSelectChangePlan (name, option) {


      const {onChange} = this.props;
      onChange && onChange (name, option[0] ? option[0].value : null);
    }

  /**
     * Handle date changed
     * @param {Object} field - field config
     * @param {Moment} dateTime - date time value
     */
  handleDateChanged (field, dateTime) {
    const {onChange} = this.props;
    const {name} = field;

    onChange && onChange (name, dateTime);
  }

  /**
     * Handle digital rights end date changed
     * @param {Object} field - field config
     * @param {Moment} dateTime - date time value
     */
  handleDigitalRightsEndDateChanged (field, dateTime) {
    this.handleDateChanged (field, dateTime ? dateTime.startOf ('day') : null);
  }

  /**
     * Valid digital rights start date
     * @param {Moment} currentDate - date.
     */
  isStartDateValid (currentDate) {
    const {values: {digitalRightsEndDate}} = this.props;
    return (
      (!digitalRightsEndDate || currentDate < digitalRightsEndDate) &&
      currentDate.get ('year') > -1
    );
  }

  /**
     * Valid digital rights end date
     * @param {Moment} currentDate - date.
     */
  isEndDateValid (currentDate) {
    const {values: {digitalRightsStartDate}} = this.props;
    return (
      (!digitalRightsStartDate || currentDate > digitalRightsStartDate) &&
      currentDate.get ('year') > -1
    );
  }

  getSubscriptionPlans () {
    const {store} = this.props;   
    const plansData = store && store.subscriptionPlans
      ? store.subscriptionPlans.map (plans => ({
          label: plans.name,
          value: parseInt(plans.id),
        }))
      : [];

   return plansData;
  }
  handlePlansChanged(plansOptions){    
    this.handlePlanChanged(plansOptions);
  }
  handlePlanChanged(value){
    const {store,index} =this.props;

    store.setData(index,'subscriptionPlans',value);
    const {onChange} = this.props;
    onChange && onChange ('subscriptionPlans', value ? value : null);

  }
 

  /**
     * @see Component#render()
     */
  render () {
    const {value,store,
      index,
      onChange,
      seasonvariance,  
      store: {digitalRightsRegions: digitalRightsRegionsList},
      fields: {rightsType, plansType, rightsRegion, rightsStartDate, rightsEndDate},
      values: {
        digitalRightsType,
        digitalRightsStartDate,
        digitalRightsRegions,
        digitalRightsEndDate,
        subscriptionPlans
      },
    } = this.props;
    // const seasonvariance=this.props.route.path.split("/").slice(-1)
  
    return (
      <FormValidationWrapper
        validationClass
        validationMessage={getValidationMessage}
      >
        <Row>
          <Col>
            <h3 className="block">Rights</h3>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FieldWrapper
              fieldConfig={rightsType}
              handleChange={rightsTypeOption =>
                this.handleSelectChange('digitalRightsType', rightsTypeOption)}
              value={seasonvariance?" ":'digitalRightsType'}
              value={digitalRightsType}
              required={true}
              index={index}
              getOptions={this.getRightsTypesOptions}
            />
          </Col>
        </Row>
          
        <Row>
          <Col md={6}>
            <DateTime
              fieldData={rightsStartDate}
              utc={true}
              timeFormat={false}
              index={index}
              dateFormat="DD/MM/YYYY"
              isValidDate={this.isStartDateValid.bind (this)}
              value={digitalRightsStartDate}
              onChange={startDate =>
                this.handleDateChanged(rightsStartDate, startDate)}
              getValidationMessage={getValidationMessage}
            />
          </Col>
          <Col md={6}>
            <DateTime
              fieldData={rightsEndDate}
              utc={true}
              timeFormat={false}
              index={index}
              dateFormat="DD/MM/YYYY"
              isValidDate={this.isEndDateValid.bind (this)}
              value={digitalRightsEndDate}
              onChange={endDate =>
                this.handleDigitalRightsEndDateChanged (rightsEndDate, endDate)}
              getValidationMessage={getValidationMessage}
            />
          </Col>
        </Row>

        {digitalRightsRegionsList
          ? <CheckboxTreeComponent
              index={index}
              checked={digitalRightsRegions}
              setExpandedNodes={this.setExpandedNodes}
              getExpandedNodes={this.getExpandedNodes}
              fieldConfig={rightsRegion}
              onChange={onChange}
              searchEnabled
              data={this.getRightsRegions ()}
            />
          : null}

          {this.props.values.digitalRightsType !== 1 ?      
          <Row>
            <Col md={11}>
              <PlanName  
              field={plansType}
              value={subscriptionPlans? subscriptionPlans.peek ():[]}
              store={store}
              onChange={this.handlePlansChanged}
              // disabled={this.handleSelectChange?rightsType.id == 1:rightsType}

              />
              {/* <FieldWrapper
                fieldConfig={plansType}             
               handleChange={planTypeOption =>
                this.handleSelectChange ('subscriptionPlans', [3])}
            //  handleChange={this.handlePlansChanged}
                getOptions={this.getSubscriptionPlans}
                index={index}
                value={subscriptionPlans}
              /> */}
            </Col>
          </Row>: ""}         
      </FormValidationWrapper>
    );
  }
}

export default RightsSectionMultitierSession;
