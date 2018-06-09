import React, {
    Component
} from 'react';

//Helpers
import PropTypes from 'prop-types';

//React Router
import { Link } from 'react-router-dom';

//Third Party Components
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';

class SideNavbarWarpper extends Component {

    constructor(props){
        super(props);
        this.state = {
            dropdownMenuOpen: false,
        }
    }

    handleDropdownMenuToggle = () => {
        this.setState({dropdownMenuOpen: !this.state.dropdownMenuOpen});
    }

    render(){
        return (
            <Drawer docked={this.props.docked} { ...( !this.props.docked && { open: this.props.openNavbar } ) }>
            {/*Applying Conditional Attribute to Drawer Component*/}
                <div className="nav-header">
                    <h3>Learner's Quiz App</h3>
                    { 
                        !this.props.docked && 
                        <IconButton onTouchTap={this.props.handleNavbarToggle}>
                            <FontIcon className='fa fa-remove' />
                        </IconButton> 
                    }
                </div>

                <Divider />
                <div className="dropdown-list">
                    <List>
                        <ListItem
                         primaryText="Dashboard" 
                         className="navbar-item"
                         onTouchTap={this.handleDropdownMenuToggle}
                         leftIcon={
                             <FontIcon className='fa fa-tachometer' style={{fontSize: '20px'}} />
                         } 
                         rightIcon={
                             <FontIcon 
                                style={{fontSize: '16px', width: '10px'}} 
                                className={this.state.dropdownMenuOpen ? 'fa fa-angle-right animate-down': 'fa fa-angle-right'} 
                             />
                         }
                        />
                    </List>
                    <List className={this.state.dropdownMenuOpen ? 'dropdown-items animate-open': 'dropdown-items'}>
                        <ListItem primaryText="Statistics" className="dropdown-item" containerElement={<Link to="/users"/>}/>
                        <ListItem primaryText="To-Do's" className="dropdown-item" containerElement={<Link to="/quizzes"/>}/>
                        <ListItem primaryText="Messages" className="dropdown-item" containerElement={<Link to="/groups"/>}/>
                    </List>
                </div>
                <Divider />
                <List className="nav-items">
                    <ListItem 
                        primaryText="Users" 
                        className="navbar-item" 
                        containerElement={<Link to="/users"/>}
                        leftIcon={<FontIcon className='fa fa-user' style={{fontSize: '20px'}} />} 
                    />
                    <ListItem 
                        primaryText="Quizzes" 
                        className="navbar-item" 
                        containerElement={<Link to="/quizzes"/>}
                        leftIcon={<FontIcon className='fa fa-quora' style={{fontSize: '20px'}} />} 
                    />
                    <ListItem 
                        primaryText="Groups" 
                        className="navbar-item" 
                        containerElement={<Link to="/groups"/>}
                        leftIcon={<FontIcon className='fa fa-users' style={{fontSize: '20px'}} />} 
                    />
                </List>
            </Drawer>            
        );
    }
}

SideNavbarWarpper.propTypes = {
    docked: PropTypes.bool.isRequired,
    openNavbar: PropTypes.bool,
    handleNavbarToggle: PropTypes.func,
};

export default SideNavbarWarpper;