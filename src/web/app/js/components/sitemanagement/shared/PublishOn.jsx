import React, {Component, PropTypes} from 'react';
import { observer } from 'mobx-react';
import PublishingPlatforms from 'components/shared/PublishingPlatforms';
import CheckboxTreeComponent from '../../core/CheckboxTreeComponent';
/**
 * The class defines a publishing details for page
 */
@observer
class PublishOn extends Component {

    /** The component properties */
    static propTypes = {
        store: PropTypes.object.isRequired,
        publishOnFields: PropTypes.object.isRequired
    };

    /**
     * Construct Page Publish On component
     * @param {Object} props - a component's arguments
     */
    constructor(props) {
        super(props);

        this.handleSelectPlatform = this.handleSelectPlatform.bind(this);
        this.handleTogglePlatforms = this.handleTogglePlatforms.bind(this);

        const { store: { regions } } = props;

        this.getRegions = this.getRegions.bind(this);
        this.setExpandedNodes = regions.setExpandedNodes.bind(regions);
        this.getExpandedNodes = regions.getExpandedNodes.bind(regions);
        this.onRegionsChanged = regions.setDataByName.bind(regions);
    }

    /**
     * @see Component#componentDidMount()
     */
    componentDidMount() {
        const { store } = this.props;
        store.fetchAllMaps && store.fetchAllMaps();
    }

    getRegions() {
        const { store: { regions } } = this.props;
        return regions.getRegions();
    }

        /**
     * Select platform handler
     * @param {Number} platformId - platform id
     * @param {Boolean} isChecked - whether platform is checked
     */
    handleSelectPlatform(platformId, isChecked) {
        const { store: { publishingPlatforms } } = this.props;
        publishingPlatforms.togglePlatform(platformId, isChecked);
    }

    /**
     * Toggle platforms handler
     */
    handleTogglePlatforms() {
        const { store: { publishingPlatforms } } = this.props;
        publishingPlatforms.togglePlatforms();
    }

    /**
     * @see Component#render()
     */
    render() {
        const {
            store: {
                publishingPlatforms,
                publishingPlatforms: {
                    data: {
                        publishingPlatforms: platforms
                    }
                },
                regions: {
                    regionsList,
                    data: {
                         regions
                    }
                }
            },
            publishOnFields: { platforms: platformsField, regions: regionsField }
        } = this.props;
        
        return (
            <div>
                <PublishingPlatforms
                                index={0}
                                field={platformsField}
                                markAll={publishingPlatforms.markAllPlatforms}
                                value={platforms}
                                store={publishingPlatforms}
                                onAllToggle={this.handleTogglePlatforms}
                                onSelect={this.handleSelectPlatform}
                />
                {regionsList ?
                    <CheckboxTreeComponent
                        index={0}
                        checked={regions}
                        setExpandedNodes={this.setExpandedNodes}
                        getExpandedNodes={this.getExpandedNodes}
                        fieldConfig={regionsField}
                        onChange={this.onRegionsChanged}
                        data={this.getRegions()}
                        searchEnabled
                    />  : null
                }
            </div>
        );
    }
}

export default PublishOn;
