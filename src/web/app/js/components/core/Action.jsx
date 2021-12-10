import React, { Component, PropTypes } from 'react';
import actionStyles from 'css/action';
import addv from 'images/addv.svg';
// import addv from '../assets/images/add.svg';

/**
 * The class represents an action.
 */
export default ({ icon, title, onClick, name, className }) => {
    return(
        <span className={className ? `bo-essel-action ${className}` : 'bo-essel-action'}
              title={title}
              onClick={onClick}
        >
            {/* <span className="faaddv"></span> */}
            <i className={`fa fa-${icon}`}/>
            { name && <span>{name}</span> }
        </span>

    );
};