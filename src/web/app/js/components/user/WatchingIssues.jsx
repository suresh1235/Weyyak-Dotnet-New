import React, {Component, PropTypes} from 'react';
import { observer } from 'mobx-react';

import Loader from 'components/core/Loader'

import moment from 'moment';

/**
 * The component shows watching issues reported by a user
 */
@observer
class WatchingIssues extends Component {

    /** The component properties */
    static propTypes = {
        viewActivityId: PropTypes.string.isRequired,
        getWatchingIssues: PropTypes.func.isRequired,
        fetchWatchingIssues: PropTypes.func.isRequired
    };

    /** The problem categories' configuration */
    static categories = [
        {
            attribute: 'isVideo',
            name: 'Issue with video'
        },
        {
            attribute: 'isSound',
            name: 'Issue with sound'
        },
        {
            attribute: 'isTranslation',
            name: 'Issue with translation or dubbing'
        },
        {
            attribute: 'isCommunication',
            name: 'Communication problem'
        }
    ];
    /**
     * @see Component#componentWillMount()
     */
    componentWillMount() {
        this.retrieveWatchingIssues(this.props.viewActivityId);
    }

    /**
     * @see Component#componentWillReceiveProps(nextProps)
     */
    componentWillReceiveProps(nextProps) {
        const { viewActivityId: newViewActivityId } = nextProps;
        if (this.props.viewActivityId != newViewActivityId) {
            this.retrieveWatchingIssues(newViewActivityId);
        }
    }

    /**
     * Retrieve watching issues if it's needed
     * @param {String} viewActivityId - a view activity identifier
     */
    retrieveWatchingIssues(viewActivityId) {
        const { getWatchingIssues, fetchWatchingIssues } = this.props;
        const usersWatchingIssues = getWatchingIssues(viewActivityId);
        !usersWatchingIssues && fetchWatchingIssues(viewActivityId);
    }

    /**
     * Render a watching issue
     * @param {String} viewActivityId - a view activity identifier
     * @param {Object} watchingIssue - a watching issue
     * @param {Number} index - a watching issue index
     */
    renderWatchingIssue(viewActivityId, watchingIssue, index) {
        const { reportedAt, description } = watchingIssue;
        return (
            <div key={`${viewActivityId}_${index}`} className="bo-essel-watching-issue">
                <p>
                    <span className="date">{moment(reportedAt).format('DD/MM/YYYY HH:mm:ss')}</span>
                </p>
                <p>
                    <span><strong>Problem category: </strong></span>
                    <span className="category">
                        {
                            WatchingIssues.categories.
                                filter(category => watchingIssue[category.attribute]).
                                map(category => category.name).
                                join(', ')
                        }
                    </span>
                </p>
                <p>
                    <span><strong>Problem details: </strong></span>
                    <span className="description">{description}</span>
                </p>
            </div>
        );
    }

    /**
     * @see Component#render()
     */
    render() {
        const { getWatchingIssues, viewActivityId } = this.props;
        const watchingIssues = getWatchingIssues(viewActivityId);
        return watchingIssues ?
            <div className="bo-essel-watching-issues">
                {watchingIssues.map((watchingIssue, index) =>
                    this.renderWatchingIssue(viewActivityId, watchingIssue, index))}
            </div> :
            <Loader className="bo-essel-loader-center"/>;
    }
}

export default WatchingIssues;