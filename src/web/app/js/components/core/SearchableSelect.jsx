import React, {Component, PropTypes} from 'react';
import { observer } from 'mobx-react';
import Field from 'components/core/Field';
import { getSetterName, getFetcherName } from 'components/core/Utils';
import debounce from 'lodash.debounce';
/**
 * The class defines a details data of a content
 */
@observer
class SearchableSelect extends Component {

    /** The component properties */
    static propTypes = {
        store: PropTypes.object.isRequired,
        field: PropTypes.object.isRequired,
        minSearchSymbols: PropTypes.number,
        searchThrottleDelay: PropTypes.number,
        getStoreValue: PropTypes.func,
        handleChange: PropTypes.func,
        onInputChange: PropTypes.func,
    };

    static defaultProps = {
        minSearchSymbols: 3,
        searchThrottleDelay: 500,
    }

     /**
     * Construct the component
     */
    constructor(...args) {
        super(...args);

        const { searchThrottleDelay } = this.props; 
       
        this.fetchOptions = debounce(
            (fetcher, value) => fetcher(value),
            searchThrottleDelay,
            {trailing: true}
        );

        this.state = {
            inputValue: null
        };
    }

    handleSelectChange(setter, fieldKey, values) {   
        const { handleChange } = this.props; 
        setter(values.map(option => option.value));
        handleChange && handleChange(fieldKey, values);
        return values;
    }

    handleInputChange(fetcher, fieldKey, value) {
        const { onInputChange, minSearchSymbols } = this.props; 
        const { inputValue: prevInputValue } = this.state; 

        // The only way to clear input after an option is selected
        // when data is loaded dynamically.
        // See [key: 'selectValue'] of react-select#Select.js
        if (value && value === prevInputValue) {
            return '';
        }
        
        if (value && value.length >= minSearchSymbols) {
            this.fetchOptions(fetcher, value);
        }

        onInputChange && onInputChange(fieldKey, values);

        this.setState({ inputValue: value });

        return value;
    }

    

    /**
     * @see Component#render()
     */
    render() {
        const { store, field } = this.props;
        let { getStoreValue } = this.props;

        const setter = store[getSetterName(field.key)].bind(store);
        const fetcher = store[getFetcherName(field.options)].bind(store);

        getStoreValue = getStoreValue || ((key) => store.getData()[key]);

        return (
            <Field 
                fieldConfig={field}
                store={store}
                getStoreValue={getStoreValue}
                handleChange ={this.handleSelectChange.bind(this, setter, field.key)}
                onInputChange={this.handleInputChange.bind(this, fetcher, field.key)}
                onSelectResetsInput = {false}
            />
        );
    }
}

export default SearchableSelect;
