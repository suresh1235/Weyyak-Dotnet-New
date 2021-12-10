import React, {Component, PropTypes} from 'react';
import {observer, inject} from 'mobx-react';
import {Grid, Row, Col} from 'react-bootstrap';
import DemoSearchStore from 'stores/demosearch/DemoSearchStore';
import PageTable from 'components/core/PageTable';
import appRoutes from 'components/app.routes.config';
import editorsStyles from 'css/editors.less';

/**
 * The class represents demo search
 */
@inject('appStore')
@observer
class DemoSearch extends Component {

    /** The component properties */
    static propTypes = {
        route: PropTypes.shape({
            store: PropTypes.instanceOf(DemoSearchStore)
        })
    };

    /**
     * Construct a component
     * @param args - component arguments
     */
    constructor(...args) {
        super(...args);

        const [props] = args;
        const {route: {store, store: {fetchData, getData}}} = props;

        this.dataListLayout = {
            columns: [
                {
                    name: 'Transliterated Title',
                    key: 'transliteratedTitle'
                },
                {
                    name: 'Arabic Title',
                    key: 'arabicTitle'
                },
                {
                    name: 'Original Title',
                    key: 'originalTitle'
                },
                {
                    name: 'Alternative Title',
                    key: 'alternativeTitle'
                },
                {
                    name: 'Summary',
                    key: 'summary'
                },
                {
                    name: 'Type',
                    key: 'type'
                },
                {
                    name: 'Main Actors',
                    key: 'mainActors'
                },
                {
                    name: 'Actors',
                    key: 'actors'
                }
            ]
        };

        this.dataFilters = [
            {
                name: 'searchText',
                type: 'search',
                defaultValue: '',
                placeholder: 'Search'
            }
        ];

        this.fetchData = fetchData.bind(store);
        this.getData = getData.bind(store);
    }

    /**
     * @see Component#render()
     */
    render() {
        const { router } = this.props;
        return (
            <Grid>
                <Row className="bread-crumbs">
                    <Col className="col" xs={12} md={8}>
                        <h1>Content Demo Search</h1>
                    </Col>
                </Row>
                <Row className="main-content">
                    <PageTable
                        filters={this.dataFilters}
                        fetchData={this.fetchData}
                        getData={this.getData}
                        layout={this.dataListLayout}
                    />
                </Row>
            </Grid>
        );
    }
}

export default DemoSearch;
