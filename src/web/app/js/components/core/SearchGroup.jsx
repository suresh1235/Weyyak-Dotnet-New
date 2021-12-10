import React, { Component, PropTypes, defaultProps } from 'react';
import { observer } from 'mobx-react';

import {
    FormControl,
    Button
} from 'react-bootstrap';

/**
 * The class defines a Search Group component
 */
@observer
class SearchGroup extends Component {

    /** The component's default properties */
    static defaultProps = {
        label: 'Select',
        disabled: false,
        buttonText: 'Search'
    };

    /** The component's properties */
    static propTypes = {
        label: PropTypes.string,
        changeHandler: PropTypes.func.isRequired,
        changeType: PropTypes.func.isRequired,
        selectValue: PropTypes.string.isRequired,
        selectValueNew: PropTypes.string.isRequired,
        playlisttype: PropTypes.string.isRequired,
        dropdownOprions: PropTypes.object.isRequired,
        inputHandler: PropTypes.func.isRequired,
        inputValue: PropTypes.string.isRequired,
        searchHandler: PropTypes.func.isRequired,
        disabled: PropTypes.bool,
        buttonText: PropTypes.string,
        isSelectAvailable: PropTypes.bool.isRequired,
        selectData: PropTypes.object
    };

    /**
     * Construct Search Group component
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
            label,
            changeHandler,
            changeType,
            selectValue,
            selectValueNew,
            playlisttype,
            dropdownOprions,
            inputHandler,
            inputValue,
            searchHandler,
            disabled,
            buttonText,
            isSelectAvailable,
            selectData,
        } = this.props;

        console.log(selectValueNew)
        console.log(selectValue)
        return (
            <div>
                <label style={{margin:"0px 7px 0px 0px"}}>Select Playlist Type  : </label>
                 <label className="dropdown">
                    <FormControl
                        key="select"
                        className="form-control input-group-right"
                        componentClass="select"
                        onChange={changeType}
                        value={selectValueNew}>
                        <option selected value=""></option>
                        <option value="content"
                         className={playlisttype==="content" ? "" : playlisttype== null ? "" :"hide-option"}
                        //  selected={playlisttype==="content" ? true :false}
                        >Content</option>
                        <option value="pagecontent" 
                        className={playlisttype==="pagecontent" ? "" :playlisttype==null ? "":"hide-option"}
                        // selected={playlisttype==="pagecontent" ? true :false}
                        >Page Content</option>
                    </FormControl>
                </label>
            <div className="search-group">
               
                <label>{`${label}: `}</label>
                
                <label className="dropdown">
                    <FormControl
                        key="select"
                        className="form-control input-group-left"
                        componentClass="select"
                        onChange={changeHandler}
                        value={selectValue}
                        disabled={selectValueNew ? false : true}>
                        <option value="" selected></option>
                        {
                            dropdownOprions.length && dropdownOprions.map((option, index) =>
                              selectValueNew ==="pagecontent" ?
                                <option key={index} value={option.id} 
                                className={option.name==="Page" ? "" :"hide-option"}
                                >
                                    {option.name}
                                </option>
                            :  <option key={index} value={option.id} 
                                className={option.name==="Page" ? "hide-option" :""}>
                                {option.name}
                                </option>
                            )
                        }
                    </FormControl>
                </label>
                {
                    isSelectAvailable ?
                    <label className="dropdown">
                        <FormControl
                            key="select"
                            className="form-control input-group-right"
                            componentClass="select"
                            onChange={inputHandler}
                            value={inputValue}>
                            <option value=""></option>
                            {
                                selectData.length && selectData.map((option, index) =>
                                    <option key={index} value={option.code}>
                                        {option.englishName}
                                    </option>
                                )
                            }
                        </FormControl>
                    </label> : <FormControl
                        type="text"
                        className="form-control input-group-right"
                        bsClass=""
                        onChange={inputHandler}
                        value={inputValue} />
                }
                <Button
                    onClick={searchHandler}
                    disabled={disabled}>
                        {buttonText}
                </Button>
            </div>
            </div>
        )
    }
}

export default SearchGroup;
