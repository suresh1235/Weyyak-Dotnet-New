import React, { Component, PropTypes } from 'react';

import breadcrumbsStyles from 'css/breadcrumbs';

/**
 * The class represents bread crumbs of an application
 */
class BreadCrumbs extends Component {

    /** The component properties */
    static propTypes = {
        crumbs: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            path: PropTypes.string
        })).isRequired,
        router: PropTypes.object.isRequired
    };

    /** A crumb delimiter */
    static crumbDelimiter = '>';

    /**
     * Process bread crumbs and add crumb delimiters
     *
     * @param {Array} crumbs - original bread crumbs to be processed
     * @returns {Array} processed bread crumbs
     */
    processBreadCrumbs(crumbs) {
        var processedCrumbs = [].concat(crumbs);
        if (crumbs.length) {
            for (let i = 0; i < crumbs.length - 1; i++) {
                processedCrumbs.splice(i * 2 + 1, 0, {name: BreadCrumbs.crumbDelimiter, isDelimiter: true});
            }
        }
        return processedCrumbs;
    }

    /**
     * Handle a crumb picking up
     * @param {String} crumbLocation - a crumb location
     */
    handleCrumbPickup(crumbLocation) {
        const { router } = this.props;
        router.push(crumbLocation);
    }

    /**
     * @see Component#render()
     */
    render() {
        const { crumbs } = this.props;
        return (
            <div className="bo-essel-bread-crumbs">
                {
                    this.processBreadCrumbs(crumbs).map((item, index) => {
                        const { name, path, isDelimiter } = item;
                        return (
                            <span className={isDelimiter ? 'bo-essel-bread-crumb-delimiter' : 'bo-essel-bread-crumb'}
                                  key={`${name}_${index}`}>
                                {
                                    isDelimiter ?
                                        name :
                                        <a onClick={path && this.handleCrumbPickup.bind(this, path)}>{name}</a>
                                }
                            </span>
                        )})
                }
            </div>
        );
    }
}

export default BreadCrumbs;