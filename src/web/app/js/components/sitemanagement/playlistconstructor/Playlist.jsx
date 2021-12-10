import React, { Component, PropTypes, defaultProps } from 'react';
import { observer } from 'mobx-react';
import PageTable from 'components/core/PageTable';

import {
    FormControl,
    Button
} from 'react-bootstrap';

/**
 * The class defines a Playlist component
 */
@observer
class Playlist extends Component {

    /** The component's properties */
    static propTypes = {
        playlistItem: PropTypes.object.isRequired,
        activityState: PropTypes.bool.isRequired,
        playlistTypes: PropTypes.array.isRequired,
        isGroup: PropTypes.bool.isRequired,
        moveElementUpper: PropTypes.func.isRequired,
        moveElementLower: PropTypes.func.isRequired,
        removeElement: PropTypes.func.isRequired,
        toggleChildrenView: PropTypes.func.isRequired,
        fetchPlaylistItems: PropTypes.func.isRequired,
        getPlaylistItems: PropTypes.func.isRequired,
        gridLayout: PropTypes.object.isRequired
    };

    /**
     * Construct Playlist component
     * @param {Object} props - components properties
     */
    constructor(props) {
        super(props);

    }

    /**
     * @see Component#render()
     */
    render() {
        const {
            playlistItem,
            activityState,
            playlistTypes,
            isGroup,
            moveElementUpper,
            moveElementLower,
            removeElement,
            toggleChildrenView,
            fetchPlaylistItems,
            getPlaylistItems,
            gridLayout
        } = this.props;

        return (
            <div className="playlist-content">
                <div className="playlist-item">
                    <span
                        className="move-upper-item">
                            <i
                                onClick={moveElementUpper}
                                className="fa fa-arrow-up"
                                aria-hidden="true"></i>
                    </span>
                    <span
                        className="move-lower-item">
                            <i
                                onClick={moveElementLower}
                                className="fa fa-arrow-down"
                                aria-hidden="true"></i>
                    </span>
                    <span className="item-label">
                        { isGroup && <span
                            className="show-hide-child-elements-item">
                                <i
                                    onClick={toggleChildrenView}
                                    className={`fa ${!activityState ? 'fa-angle-down' : 'fa-angle-up'}`}
                                    aria-hidden="true"></i>
                        </span>}

                        <span className={`item-name ${!isGroup ? 'left-gap' : ''}`}>
                            {`${playlistItem.name} (${playlistTypes.find(playlist => playlist.id == playlistItem.type).name})`}
                        </span>

                        <span
                            className="remove-item">
                                <i
                                    onClick={removeElement}
                                    className="fa fa-minus"
                                    aria-hidden="true"></i>
                        </span>

                        <div className="playlist-grid">
                            {activityState && isGroup && <PageTable
                                fetchData={fetchPlaylistItems}
                                getData={getPlaylistItems}
                                layout={gridLayout}
                                pageSize={10}
                                hideTableHead={true}
                            />}
                        </div>
                    </span>
                </div>
            </div>
        )
    }
}

export default Playlist;
