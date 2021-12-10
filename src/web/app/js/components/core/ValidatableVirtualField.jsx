import { Component, PropTypes } from 'react';

//Component to support validation of non-rendered fields (computed, etc...)
class ValidatableVirtualField extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        validations: PropTypes.arrayOf(PropTypes.shape),
        value: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.arrayOf(PropTypes.shape)
        ])
    };

    render() {
        return null;
    }
}

export default ValidatableVirtualField;

