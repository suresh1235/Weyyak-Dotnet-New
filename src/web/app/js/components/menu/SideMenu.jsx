import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Nav, NavDropdown, MenuItem } from 'react-bootstrap';
import classNames from 'classnames';

import sideMenuStyles from 'css/sidemenu';

/**
 * The class represent a side menu component
 */
class SideMenu extends Component {

    /** The component properties */
    static propTypes = {
        name: PropTypes.string.isRequired,
        menu: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            items: PropTypes.arrayOf(PropTypes.oneOfType([
                PropTypes.shape({
                    name: PropTypes.string.isRequired,
                    path: PropTypes.string.isRequired
                }),
                PropTypes.shape({
                    icons: PropTypes.object.isRequired,
                    menu: PropTypes.array.isRequired
                })
            ]))
        })),
        path: PropTypes.string.isRequired,
        onToggle: PropTypes.func,
        router: PropTypes.object.isRequired
    };

    /**
     * Construct a side menu
     * @param {Array} args - component arguments
     */
    constructor(...args) {
        super(...args);

        this.state = { on: true };

        this.handleMenuToggle = this.handleMenuToggle.bind(this);
        this.handleSubMenuItemSelection = this.handleSubMenuItemSelection.bind(this);
    }

    /**
     * @see Component#componentWillMount()
     */
    componentWillMount() {
        this.initState(this.props);
    }

    /**
     * @see Component#componentWillReceiveProps(nextProps, nextState)
     */
    componentWillReceiveProps(nextProps) {
        this.initState(nextProps);
    }

    /**
     * Init a component state
     * @param {Object} props - component's properties
     */
    initState(props) {
        const { menu, path, on } = props, state = { on };
        this.initMenuState(menu, state, path);
        this.setState(state);
    }

    /**
     * Init a menu state
     * @param {Array} menu - a menu to be processed
     * @param {Object} state - a current component state
     * @param {String} path - a current application path
     * @param {String} parentMenuKey - a parent menu key
     *
     * @note Only one inner menu level is supported now
     */
    initMenuState(menu, state, path, parentMenuKey = null) {
        const currentPathParts = path.split('/');
        path = '/' + currentPathParts[1];
        menu.forEach(menu => {
            const on = this.state[menu.key] || menu.items.some(item => item.path == path);
            state[menu.key] = on;
            parentMenuKey && on && (state[parentMenuKey] = true);
            menu.items.
                filter(item => item.menu).
                forEach(subMenu => { this.initMenuState(subMenu.menu, state, path, menu.key) });
        });
    }

    /**
     * Handle a menu toggling
     */
    handleMenuToggle() {
        const { onToggle } = this.props;
        const on = !this.state.on;
        this.setState({on});
        onToggle && onToggle(on);
    }

    /**
     * Handle a sub menu toggling
     * @param {String} menuKey - a sub menu key
     * @param {Boolean} on - a sub menu state
     */
    handleSubMenuToggle(menuKey, on) {
        if (this.closingMenuKey != menuKey) {
            this.setState({[menuKey]: on});
        }
        this.closingMenuKey = null;
    }

    /**
     * Handle a sub menu closing
     * @param {String} menuKey - a sub menu key
     */
    handleSubMenuClose(menuKey) {
        this.closingMenuKey = menuKey;
    }

    /**
     * Handle a sub menu selection
     * @param {String} eventKey - an event key
     * @param {Object} event - event
     */
    handleSubMenuItemSelection(eventKey, event) {
        event.preventDefault();
        this.props.router.push(eventKey);
    }

    /**
     * Render a menu
     * @param {Array} menu - a menu layout
     * @param {Object} icons - a map of menu icons
     * @param {String} name - a menu name
     * @param {String} currentPath - a current application location
     * @param {Number} level - a menu level
     * @returns {ReactNode} a react component
     */
    renderMenu(menu, icons, name, currentPath, level = 0) {
        const nav = (
            <Nav className={`menu_level_${level}`}
                bsStyle="pills"
                key={name} stacked
                activeKey={currentPath}
                onSelect={this.handleSubMenuItemSelection}>
                {menu.map(subMenu => this.renderSubMenu(subMenu, icons, currentPath, level))}
            </Nav>
        );

        const menuComponent = level > 0 ? (
            <NestedNavWrapper key={`nav_${name}`}>
                {nav}
            </NestedNavWrapper>
        )
        : nav;

        return menuComponent;
    }

    /**
     * Render a sub menu
     * @param {Object} subMenu - a sub menu to be rendered
     * @param {Object} icons - a map of menu icons
     * @param {String} currentPath - a current application location
     * @param {Number} level - a menu level
     * @returns {ReactNode} a react component
     */
    renderSubMenu(subMenu, icons, currentPath, level) {
        const { name, icon, key, items } = subMenu;
        const isSubMenuOpened = this.state[key];
        const title =
            <span>
                <i className={`fa fa-${isSubMenuOpened ? icons.hideSubMenu : icons.showSubMenu}`}/>
                <i className={`fa fa-${icon}`}/>
                {name}
            </span>;
        return (
            <NavDropdown title={title}
                         noCaret
                         key={key}
                         id={key}
                         open={isSubMenuOpened}
                         onToggle={this.handleSubMenuToggle.bind(this, key)}
                         onClose={this.handleSubMenuClose.bind(this, key)}>
                {
                        items.map(item => {
                            const { name, path, menu } = item;
                            return menu ? this.renderMenu(menu, item.icons, `Menu_${name}`, currentPath, ++level) : (
                                <MenuItem key={name} eventKey={path} href={path}>
                                    {name}
                                </MenuItem>
                            );
                        })
                }
            </NavDropdown>
        );
    }

    /**
     * @see Component#render()
     */
    render() {
        const { name, menu, path, icons } = this.props;
        const currentPathParts = path.split('/');
        const pathName = '/' + currentPathParts[1];
        const { on: menuOn } = this.state;
        return (
            <div className={classNames({'bo-essel-side-menu': true, off: !menuOn})}>
                <div className="bo-essel-side-menu-header">
                    <i className={`fa fa-${this.state.on ? icons.hideMenu : icons.showMenu}`}
                       onClick={this.handleMenuToggle} />
                    <ReactCSSTransitionGroup transitionName="bo-essel-side-menu-transition"
                                             transitionEnterTimeout={700}
                                             transitionLeaveTimeout={0}>
                        { menuOn ? <span>{ name }</span> : null }
                    </ReactCSSTransitionGroup>
                </div>
                <div className="bo-essel-side-menu-body">
                    <ReactCSSTransitionGroup transitionName="bo-essel-side-menu-transition"
                                             transitionEnterTimeout={700}
                                             transitionLeaveTimeout={0}>
                        { menuOn ? this.renderMenu(menu, icons, name, pathName) : null }
                    </ReactCSSTransitionGroup>
                </div>
            </div>
        );
    }
}
class NestedNavWrapper extends Component {
    render() {
        const { active, ...rest } = this.props;
        const children = React.Children.map(this.props.children, child => {
            return React.cloneElement(child, ...rest);
        });
        return (
            <span>
                {children}
            </span>
        )
    }
}

export default SideMenu;
