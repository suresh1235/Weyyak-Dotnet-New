import React, {Component, PropTypes} from 'react';
import { observer } from 'mobx-react';
import RepeaterComponent from 'components/core/RepeaterComponent';
import ContentGenresStore from 'stores/content/ContentGenresStore';

/**
 * The class defines a textual data of a content
 */
@observer
class ContentGenres extends Component {

    /** The component properties */
    static propTypes = {
        store: PropTypes.instanceOf(ContentGenresStore).isRequired,
        fields: PropTypes.arrayOf(PropTypes.shape).isRequired
    };

    /**
     * Fetch content types on a component mounting
     * @see Component#componentWillMount()
     */
    componentWillMount() {
        const {store} = this.props;
        store.fetchGenres();
    }

    /**
     * @see Component#render()
     */
    render() {
        const { store, fields} = this.props;
        return (
            <div className="forms">
                <RepeaterComponent
                    fields={fields}
                    itemStructure={() => ({genreId: '', subgenresId: []})}
                    addButtonTitle="Add Genre"
                    minRepeaters={1}
                    maxRepeaters={6}
                    store={store}
                    />
            </div>
        );
    }
}

export default ContentGenres;
