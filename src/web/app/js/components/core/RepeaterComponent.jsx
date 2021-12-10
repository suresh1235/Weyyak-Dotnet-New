import React, {Component} from 'react';
import {observer} from 'mobx-react';

import Field from 'components/core/Field';
import Confirm from 'components/core/Confirm';
import {getSetterName} from 'components/core/Utils';
import {Button} from 'react-bootstrap';

@observer class RepeaterComponent extends Component {
  static numerousTitles = {
    1: 'First ',
    2: 'Second ',
    3: 'Third ',
    4: 'Fourth ',
    5: 'Fifth ',
    6: 'Sixth ',
  };

  constructor (...args) {
    super (...args);
    this.addRepeaterField = this.addRepeaterField.bind (this);

    this.state = {
      repeaterIndex: null,
      showConfirm: false,
    };
  }

  /**
     * Fetch content types on a component mounting
     * @see Component#componentWillMount()
     */
  componentWillMount () {
    const {minRepeaters, itemStructure} = this.props;
    let data = [];
    if (minRepeaters) {
      for (let a = 0; a < minRepeaters; a++) {
        data.push (this.props.itemStructure ());
      }
      this.props.store.setRepeaterData (data);
    }
  }

  /**
     * Handler of select change event
     * @param {Object} repeaterIndex - change event
     * @param {Object} fieldKey - change event
     * @param {Object} event - change event
     */
  handleSelectChange (repeaterIndex, field, event) {
    let {multiple} = field;
    if (!multiple) {
      const {target: {name, value, type}} = event;
      this.props.store.setGenreValue (repeaterIndex, value);
    } else {
      this.props.store.setSubgenresValue (
        repeaterIndex,
        event.map (option => option.value)
      );
    }
  }

  /**
     * Sets numerous prefix to label.
     * @param {Object} repeaterIndex - current row index.
     */
  setNumerousTitle (repeaterIndex) {
    return RepeaterComponent.numerousTitles[repeaterIndex];
  }

  /**
     * Adds repeater field item
     */
  addRepeaterField () {
    const {maxRepeaters, itemStructure} = this.props;
    let {data} = this.props.store;

    if (data.length < maxRepeaters) {
      this.props.store.addNewItem (itemStructure ());
    }
  }

  /**
      * Removes existing repeater item by its index
      * @param {Object} ind - index
      */
  removeRepeaterField (index) {
    const {minRepeaters, itemStructure} = this.props;
    let {data} = this.props.store;

    data.length > minRepeaters && this.props.store.removeItem (index);
    this.setState ({
      showConfirm: false,
    });
  }

  /**
     * Render cancel confirmation popup
     * @returns {ReactNode} popup node
     */
  renderConfirmationView () {
    let {repeaterIndex, showConfirm} = this.state;
    const bodyHtml = <p>Are you sure you want to remove this genre?</p>;

    return (
      <Confirm
        key="confirm"
        onConfirm={this.removeRepeaterField.bind (this, repeaterIndex)}
        onClose={() => {
          this.setState ({
            showConfirm: false,
          });
        }}
        body={bodyHtml}
        visible={showConfirm}
        cancelText="NO"
        confirmText="YES"
        title="Remove Genre"
      />
    );
  }

  /**
     * @see Component#render()
     */
  render () {
    const data = this.props.store.getRepeaterData ();
    const {
      store,
      maxRepeaters,
      minRepeaters,
      addButtonTitle,
      fields,
    } = this.props;
    const isAddButtonDisabled = data.length == maxRepeaters;
    return (
      <div>
        {data.map ((item, repeaterIndex) => {
          return (
            <div key={repeaterIndex} className="row">
              {fields.map ((field, fieldIndex) => {
                const fiedData = data[repeaterIndex];
                let numerousTitle = this.setNumerousTitle (repeaterIndex + 1);
                return (
                  <div key={fieldIndex} className="col-md-6">
                    <Field
                      fieldConfig={field}
                      repeaterTitle={fieldIndex == 0 && numerousTitle}
                      index={repeaterIndex}
                      repeaterIndex={repeaterIndex || '0'}
                      required={repeaterIndex < 2}
                      value={fiedData[field.key]}
                      dynamicValue={fiedData[field.dynamicValueKey]}
                      store={store}
                      handleChange={this.handleSelectChange.bind (
                        this,
                        repeaterIndex,
                        field
                      )}
                    />
                  </div>
                );
              })}
              {repeaterIndex >= minRepeaters &&
                <div
                  className="forms-remove"
                  onClick={() =>
                    this.setState ({
                      repeaterIndex: repeaterIndex,
                      showConfirm: true,
                    })}
                >
                  &#10006;
                </div>}
            </div>
          );
        })}
        {this.renderConfirmationView ()}
        <div className="text-right">
          <Button
            disabled={isAddButtonDisabled}
            onClick={this.addRepeaterField}
          >
            {addButtonTitle}
          </Button>
        </div>
      </div>
    );
  }
}

export default RepeaterComponent;
