import React, { Component } from 'react';
import { observer } from 'mobx-react';

import Field from 'components/core/Field';
import Confirm from 'components/core/Confirm';
import { getSetterName } from 'components/core/Utils';
import { Button } from 'react-bootstrap';

@observer
class RepeaterField extends Component {

    constructor(...props) {
        super(...props);
        this.addRepeaterField = this.addRepeaterField.bind(this);

        this.state = {
            data: [],
            repeaterIndex: null,
            ui: {
                showConfirm: false
            }
        };
    }

    /**
     * Fetch content types on a component mounting
     * @see Component#componentWillMount()
     */
    componentWillMount() {
        this.state.data = [];
        if(this.props.minRepeaters){
            for(let a = 0; a < this.props.minRepeaters; a++)
                this.state.data.push(this.props.itemStructure());
        }
    }

    /**
     * Handler of select change event
     * @param {Object} repeaterIndex - change event
     * @param {Object} fieldKey - change event
     * @param {Object} event - change event
     */
    handleSelectChange(repeaterIndex,fieldKey,event) {
        let data = this.state.data;
        if (fieldKey !== 'subgenresId') {
            const { target: { name, value, type }} = event;
            data[repeaterIndex][fieldKey] = parseInt(value);
            data[repeaterIndex].subgenresId = null;
        } else {
            data[repeaterIndex][fieldKey] = event;
        }
        this.props.store.setRepeaterData(data);
        this.setState({data});
    }

    /**
     * Sets nomerous prefix to label.
     * @param {Object} repeaterIndex - current row index.
     */
    setNomerousTitle(repeaterIndex) {
        switch (repeaterIndex) {
            case 1:
                return 'First '
                break;
            case 2:
                return 'Second '
                break;
            case 3:
                return 'Third '
                break;
            case 4:
                return 'Fourth '
                break;
            case 5:
                return 'Fifth '
                break;
            case 6:
                return 'Sixth '
                break;
        }
    }

    /**
     * Adds repeater field item
     * @param {Object} evt - event
     */
    addRepeaterField(evt) {
        evt.preventDefault();
        let data = this.state.data.slice();

        if(data.length < this.props.maxRepeaters) {
            data.push(this.props.itemStructure());
            this.setState({data});
        }
    }

    /**
     * Removes existing repeater item by its index
     * @param {Object} ind - index
     */
    removeRepeaterField(index) {
        let data = this.state.data.slice();

        data.length > this.props.minRepeaters && data.splice(index,1);
        this.setState({
            data,
            ui: {
                showConfirm: false
            }
        });
    }

    /**
     * Render cancel confirmation popup
     * @returns {ReactNode} popup node
     */
    renderConfirmationView() {
        let {repeaterIndex} = this.state;
        const bodyHtml = <p>Are you sure you want to remove this genre?</p>;

        return (
            <Confirm
                key="confirm"
                onConfirm={this.removeRepeaterField.bind(this, repeaterIndex)}
                onClose={() => {
                    this.setState({
                        ui: {
                            showConfirm: false
                        }
                    })
                }}
                body={bodyHtml}
                visible={this.state.ui.showConfirm}
                cancelText="NO"
                confirmText="YES"
                title="Remove Genre"
            />
        );
    }

    /**
     * @see Component#render()
     */
    render() {
        const {store} = this.props;
        return (
            <div>
                {
                    this.state.data.map((item, repeaterIndex)=>{
                        return <div key={repeaterIndex} className="row">
                            {
                                this.props.fields.map( (field, fieldIndex) => {
                                    let nomerousTitle = this.setNomerousTitle(repeaterIndex + 1);
                                    return (
                                        <div key={fieldIndex} className="col-md-6">
                                            <Field fieldConfig={field}
                                                   repeaterTitle={fieldIndex == 0 && nomerousTitle}
                                                   required={!!(repeaterIndex < 2)}
                                                   value={this.state.data[repeaterIndex][field.key]}
                                                   dynamicValue={this.state.data[repeaterIndex][field.dynamicValueKey]}
                                                   store={store}
                                                   handleChange={this.handleSelectChange.bind(this, repeaterIndex, field.key)}
                                                />
                                        </div>
                                    );
                                })
                            }
                            {
                                repeaterIndex >= this.props.minRepeaters &&
                                    <div className="forms-remove" onClick={() => this.setState({
                                            repeaterIndex: repeaterIndex,
                                            ui: {
                                                showConfirm:true
                                            }
                                        })}>
                                        &#10006;
                                    </div>
                            }
                        </div>
                    })
                }
                {this.renderConfirmationView()}
                <div className="text-right">
                    <Button
                        disabled={this.state.data.length == this.props.maxRepeaters}
                        onClick={this.addRepeaterField}>{this.props.addButtonTitle}</Button>
                </div>
            </div>

        );
    }
}

export default RepeaterField;
