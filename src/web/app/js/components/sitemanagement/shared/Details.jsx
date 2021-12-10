import React, {Component, PropTypes} from 'react';
import { observer, inject } from 'mobx-react';
import Field from 'components/core/Field';
import { getSetterName } from 'components/core/Utils';
import constants from 'constants/constants';
import FieldWrapper  from 'components/core/FieldWrapper';

/**
 * The class defines a details data of a content
 */
@observer
class Details extends Component {

    /** The component properties */
    static propTypes = {
        store: PropTypes.object.isRequired,
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
     * @see Component#render()
     */
    render() {
        const { store, fields } = this.props;
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

export default Details;
