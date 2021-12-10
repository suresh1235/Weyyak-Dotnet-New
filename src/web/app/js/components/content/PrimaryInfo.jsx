import React, {Component, PropTypes} from 'react';
import { observer } from 'mobx-react';
import Field from 'components/core/Field';
import { getSetterName, getValidationMessage } from 'components/core/Utils';
import PrimaryInfoStore from 'stores/content/PrimaryInfoStore'
import constants from 'constants/constants';
import FieldWrapper  from 'components/core/FieldWrapper';

/**
 * The class defines a textual data of a content
 */
@observer
class PrimaryInfo extends Component {

    /** The component properties */
    static propTypes = {
        store: PropTypes.instanceOf(PrimaryInfoStore).isRequired,
        fields: PropTypes.arrayOf(PropTypes.shape).isRequired,
        onChange: PropTypes.func
    };

    /**
     * Fetch content types on a component mounting
     * @see Component#componentWillMount()
     */
    componentWillMount() {
        const { store} = this.props;
        store.fetchData();
    }

    /**
     * Handler of select changed event
     * @param {Object} event - change event
     */
    handleSelectChange(setter, field, event) {
        const { target: {value} } = event;
        const { onChange } = this.props;
        setter(value);
        onChange && onChange(field, event);
    }

    /**
     * Returns a validation message node
     * @param {Object} msg - a text message to be displayed
     * @returns {ReactNode} React node
     */
    getValidationMessage (msg) {
        return <div className="bo-essel-error error">{msg}</div>
    }

    /**
     * @see Component#render()
     */
    render() {
        const { store, fields} = this.props;
        return (
                <div className="forms">
                    <div className="row">
                        {fields.map((list, index) => {
                            return (
                                <div key={index} className="col-md-6">
                                    {list.map((field, index) => {
                                        const { data: {[field.key]: value } } = store;
                                        const setter = store[getSetterName(field.key)].bind(store);

                                        return field.element ?
                                            (<FieldWrapper fieldConfig={field}
                                                handleChange={this.handleSelectChange.bind(this, setter, field)}
                                                key={index}
                                                value={value}/>) :
                                            (<Field fieldConfig={field}
                                                store={store}
                                                handleChange={this.handleSelectChange.bind(this, setter, field)}
                                                key={index}/>)
                                    })}
                                </div>
                            )
                        })}
                    </div>
                </div>
        );
    }
}

export default PrimaryInfo;
