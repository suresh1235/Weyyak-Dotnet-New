import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { Row, Col } from 'react-bootstrap';

import constants from 'constants/constants'
import SearchableSelectGroup from 'components/core/SearchableSelectGroup';

/**
 * The class defines a details data of a Slider
 */
@inject('sliderDetailsStore')
@observer
class AssignPlaylists extends Component {

    /** The component properties */
    static propTypes = {
        store: PropTypes.object.isRequired,
        fields: PropTypes.object.isRequired,
        onChange: PropTypes.func
    };

    constructor(...props) {
        super(...props);
    }

    componentDidMount() {
        const { store, editMode } = this.props;
    }

    componentDidUpdate() {
        const { sliderDetailsStore: { data: { type } }, store } = this.props;

        store.sliderTypeUpdated(type);
    }

    /**
     * @see Component#render()
     */
    render() {
        const {
            sliderDetailsStore: { data: { type } },
            store,
            store: { selectedBlackAreaPlaylist, selectedRedAreaPlaylist, selectedGreenAreaPlaylist },
            fields: { blackArea, redArea, greenArea }
        } = this.props;

        return (
            <Row>
                <Col md={6}>
                    <SearchableSelectGroup
                        {...blackArea}
                        value={selectedBlackAreaPlaylist}
                        onChange={store.setBlackAreaPlaylist.bind(store)}
                        fetchOptions={store.fetchPlaylists.bind(store)}
                        optionKeys={{labelKey: 'englishTitle', valueKey: 'id'}}
                    />
                    {type <= constants.SLIDER_TYPE.LAYOUT_B && <SearchableSelectGroup
                        {...redArea}
                        value={selectedRedAreaPlaylist}
                        onChange={store.setRedAreaPlaylist.bind(store)}
                        fetchOptions={store.fetchPlaylists.bind(store)}
                        optionKeys={{ labelKey: 'englishTitle', valueKey: 'id' }}
                    />}
                    {type <= constants.SLIDER_TYPE.LAYOUT_A && <SearchableSelectGroup
                        {...greenArea}
                        value={selectedGreenAreaPlaylist}
                        onChange={store.setGreenAreaPlaylist.bind(store)}
                        fetchOptions={store.fetchPlaylists.bind(store)}
                        optionKeys={{ labelKey: 'englishTitle', valueKey: 'id' }}
                    />}
                </Col>
            </Row>
        );
    }
}

export default AssignPlaylists;
