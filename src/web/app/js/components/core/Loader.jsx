import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

import loaderStyles from 'css/loader';

/**
 * The class defines a behaviour for showing a loading progress
 */
class Loader extends Component {

    /** The component properties */
    static propTypes = {
        className: PropTypes.string,
        display: PropTypes.oneOf(['flex', 'inline'])
    };

    /** The component default properties */
    static defaultProps = {
        display: 'flex'
    };

    /**
     * @see Component#render()
     */
    render() {
        const { className, display } = this.props;
        const classes = classNames({
            'bo-essel-loader-bounce': true,
            [className || '']: true
        });

        return (
            <div className={`bo-essel-${display}`}>
                <span className={classes}>
                    <span className="bo-essel-loader-bounce-first"/>
                    <span className="bo-essel-loader-bounce-second"/>
                    <span className="bo-essel-loader-bounce-third"/>
                </span>
            </div>
        );
    }
}

export default Loader;