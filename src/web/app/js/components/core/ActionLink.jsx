import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import actionStyles from 'css/action';

/**
 * Represents an action link.
 */
const ActionLink = ({ to, title, text, className, icon }) => {
    return(
        <span className={className ? `bo-essel-action ${className}` : 'bo-essel-action'}>
            <Link to={to} title={title} className={`fa fa-${icon}`}>{text}</Link>
        </span>
    );
};

ActionLink.propTypes = {
    to: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string,
    className: PropTypes.string,
    icon: PropTypes.string.isRequired
};

export default ActionLink;