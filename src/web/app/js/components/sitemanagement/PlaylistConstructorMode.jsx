import React, { Component } from 'react';
import { observer } from 'mobx-react';
import PlaylistConstructor from 'components/sitemanagement/PlaylistConstructor';

/**
 * The class contains logic of creating and editing of playlist
 */
@observer
class PlaylistConstructorMode extends Component {

    /**
     * Construct an instance of the component
     */
    constructor(props) {
        super(props);
        this.processPlaylistConstructorMode = this.processPlaylistConstructorMode.bind(this);

        this.state = {
            editMode: false
        };
    }

    /**
     * Fetch content on a component mounting
     * @see Component#componentWillMount()
     */
    componentWillMount() {
        this.processPlaylistConstructorMode();
    }

    /**
     * Fetch content on a component update
     * @see Component#componentDidUpdate()
     */
    componentDidUpdate(prevProps) {
        this.processPlaylistConstructorMode(prevProps);
    }

    /**
     * Process playlist selected mode
     */
    processPlaylistConstructorMode(prevProps) {
        const { route: { store }, params: { playlistId } } = this.props;

        if (prevProps && prevProps.params.playlistId === playlistId) {
            return;
        }

        if (playlistId) {
            this.setState({ editMode: true });
            store.fetchPlaylist(playlistId);
        }
        else {
            this.setState({ editMode: false });
            store.clearStore();
        }
    }

    /**
     * @see Component#render()
     */
    render() {
        const { route: { store }, route, router } = this.props;
        const { editMode } = this.state;

        const constructorKey = editMode ? "editPlaylist" : "createPlaylist";
        
        return (<PlaylistConstructor
                    key={constructorKey}
                    store={store}
                    route={route}
                    router={router}
                    editMode={editMode}/>)
    }
}

export default PlaylistConstructorMode;
