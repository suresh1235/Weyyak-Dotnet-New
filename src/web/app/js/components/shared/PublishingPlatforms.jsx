import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { getValidationMessage } from 'components/core/Utils';
import {
  FormControl,
  Row,
  Col
} from 'react-bootstrap';
import { findDOMNode } from 'react-dom';
import FormValidationWrapper from 'components/core/FormValidationWrapper';

/**
 * The class defines publishing platforms component
 */
@observer
class PublishingPlatforms extends Component {

  /** The component's properties */
  static propTypes = {
    onAllToggle: PropTypes.func,
    onSelect: PropTypes.func,
    value: PropTypes.shape(),
    index: PropTypes.number,
    markAll: PropTypes.bool
  };

  /**
   * Construct publishing platforms component
   * @param {Array} props - component's arguments
   */
  constructor(props) {
    super(props);
    this.toggleCheckboxes = this.toggleCheckboxes.bind(this);
    this.selectPlatform = this.selectPlatform.bind(this);
  }

  /**
   * @see Component#componentWillUnmount()
   */
  componentDidMount() {
    const { store } = this.props;
    store.fetchItemPublishingPlatforms && store.fetchItemPublishingPlatforms();
  }

  /**
   * Toggles all platforms checkboxes.
   */
  toggleCheckboxes() {
    const { onAllToggle } = this.props;
    onAllToggle && onAllToggle();
    findDOMNode(this.publishingPlatforms).focus();
  }

  /**
   * Selects current platform
   * @param {Number} platformId - platform id.
   * @param {Boolean} isChecked - is current platform checked.
   */
  selectPlatform(platformId, isChecked) {    
    const { onSelect } = this.props;
    onSelect && onSelect(platformId, isChecked);
    findDOMNode(this.publishingPlatforms).focus();
  }

  renderLabel() {
    const { field: { label } } = this.props;

    const labelGroup = label ?
      (<Col md={6} className="form-input-group">
        <label>{label}</label>
      </Col>) :
      (<Col>
        <h3 className="block">Where to Publish
                        <span className="increased-font-size">*</span>
        </h3>
      </Col>);

    return (
      <Row>
        {labelGroup}
      </Row>
    );
  }

  /**
   * @see Component#render()
   */
  render() {
    const { field: { name, validations }, value, store: { publishingPlatformsList }, markAll, index } = this.props;
    const publishingPlatformsName = `${name}${index}`;

    return (
      <FormValidationWrapper
        validationClass
        validationMessage={getValidationMessage}
        ref={wrapper => {
          this.publishingPlatforms = wrapper ? wrapper.wrappedInstance.refs[publishingPlatformsName] : null
        }
        }>
        {this.renderLabel()}
        <Row>
          <Col md={12} lg={6}>
            <div className="multiple-checkbox-container">
              <Col
                md={4}
                onMouseDown={this.toggleCheckboxes}>
                <input
                  type="checkbox"
                  value={markAll || false}
                  checked={markAll || false}
                  label="All" />
                <span>All</span>
              </Col>
              {
                publishingPlatformsList && publishingPlatformsList.map((platform, key) => {
                  const isChecked = value &&
                    value.some(publishingPlatform =>{                      
                      
                      return publishingPlatform == platform.id}
                    );

                  return (
                    <Col
                      md={4}
                      key={key}
                      onMouseDown={this.selectPlatform.bind(this, platform.id, isChecked)}>
                      <input
                        type="checkbox"
                        value={platform.id}
                        label={platform.name}
                        checked={isChecked} />
                      <span>{platform.name}</span>
                    </Col>
                  )
                })
              }
              <FormControl
                type="text"
                className="form-control hidden-form-control"
                reference={publishingPlatformsName}
                name={publishingPlatformsName}
                value={value ? value.length : ''}
                readOnly
                validations={validations} />
            </div>
          </Col>
        </Row>
      </FormValidationWrapper>);
  }
}

export default PublishingPlatforms;
