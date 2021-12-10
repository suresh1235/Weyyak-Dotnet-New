import React, { Component } from 'react';
import {
    Label
} from 'react-bootstrap';

/**
 * The class defines a 'Not Found' page component
 */
class NotFound extends Component {

    /**
     * Render a login component
     * @see Component#render()
     */
    render() {
        return (
            <div className="not-found-page">
                <h1><Label bsClass="">404 page not found</Label></h1>
                <h5><Label bsClass="">We are sorry but the page you are looking for does not exist.</Label></h5>
            </div>
        );
    }
}

export default NotFound;
