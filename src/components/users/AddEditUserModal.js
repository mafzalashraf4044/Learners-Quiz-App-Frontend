import React, {
    Component
} from 'react';

//Helpers
import _ from 'lodash';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

//Third Party Components
import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';

export default class AddEditUserModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {firstName: '', lastName: '', email: '', username: '', password: '', groups: []},
        };
    }

    shouldComponentUpdate = (nextProps, nextState) => {
      return (this.state !== nextState ||
              this.props.isEditModal !== nextProps.isEditModal || 
              this.props.showAddEditModal !== nextProps.showAddEditModal ||
              (this.props.selectedUser !== nextProps.selectedUser && nextProps.showAddEditModal)
              //If selected user is changed and AddEditModal is Open, selectedUser value can also be changed in case of confirmDltModal
              );
    }

    componentWillReceiveProps = (props) => {
        if(props.isEditModal){
            this.setState({
                user: update(props.selectedUser.data, {groups: {$set: _.map(props.selectedUser.data.groups, 'id')}}),
            });            
        }else{
            this.setState({
               user: {firstName: '', lastName: '', email: '', username: '', password: '', groups: []},
            });            
        }
    }

    _handleInputChange = (event) => {
        let target = event.target;
        this.setState((prevState, props) => ({
            user: update(prevState.user, {$merge: {[target.name]: target.value}}),
        }));
    }

    _handleGroupsChange = (event, index, groups) => {
        this.setState((prevState, props) => ({
            user: update(prevState.user, {$merge: {groups: groups}}),
        }));
    }

    render() {
        const actions = [
            <FlatButton
                label={this.props.isEditModal ? 'Save Changes' : 'Add'}
                primary={true}
                onTouchTap={(e) => {
                    if(this.props.isEditModal){
                        this.props._editUser(this.state.user)
                    }else{
                        this.props._addUser(this.state.user)
                    }
                }}
            />,
            <FlatButton
                label="Close"
                primary={true}
                onTouchTap={(e) => this.props._toggleAddEditModal(null, null)}
            />,
        ];

        return (
            <Dialog
                title={this.props.isEditModal ? 'Edit User' : 'Add User'}
                actions={actions}
                modal={false}
                autoScrollBodyContent={true}
                open={this.props.showAddEditModal}
                titleStyle={{borderBottom: '1px solid rgb(224, 224, 224)'}}
                contentStyle={{width: window.innerWidth > 992 ? '30%': '75%'}}
                bodyStyle={{width: '100%', padding: '0px 60px 20px 60px'}}
                actionsContainerStyle={{borderTop: '1px solid rgb(224, 224, 224)'}}
                onRequestClose={(e) => this.props._toggleAddEditModal(null, null)}
            >
                <TextField
                    name="firstName"
                    required
                    fullWidth={true}
                    value={this.state.user.firstName}
                    floatingLabelText="First Name"
                    onChange={this._handleInputChange}
                />    
                <TextField
                    name="lastName"
                    required
                    fullWidth={true}
                    value={this.state.user.lastName}
                    floatingLabelText="Last Name"
                    onChange={this._handleInputChange}
                />    
                <TextField
                    name="email"
                    type="email"
                    required
                    fullWidth={true}
                    value={this.state.user.email}
                    floatingLabelText="Email"
                    onChange={this._handleInputChange}
                />    
                <TextField
                    name="username"
                    type="text"
                    required
                    fullWidth={true}
                    value={this.state.user.username}
                    floatingLabelText="Username"
                    onChange={this._handleInputChange}
                />    
                {
                    !this.props.isEditModal &&  
                    <TextField
                        name="password"
                        type="password"
                        required
                        fullWidth={true}
                        value={this.state.user.password}
                        floatingLabelText="Password"
                        onChange={this._handleInputChange}
                    />    
                }  
                <SelectField
                    name="groups"
                    floatingLabelText="Groups"
                    required
                    value={this.state.user.groups}
                    multiple={true}
                    fullWidth={true}
                    onChange={this._handleGroupsChange}

                >
                    {
                        this.props.groups.map((group, index, groups) => {
                            return (
                                <MenuItem 
                                    value={group.id}
                                    key={index} 
                                    primaryText={group.title} 
                                    insetChildren={true}
                                    checked={this.state.user.groups && this.state.user.groups.indexOf(group.id) > -1}
                                />
                            );
                        })
                    }
                </SelectField>  
            </Dialog>
        );
    };
}

AddEditUserModal.propType = {
    _addUser            : PropTypes.func,
    _editUser           : PropTypes.func,
    groups              : PropTypes.array,
    isEditModal         : PropTypes.bool,
    selectedUser        : PropTypes.object,
    showAddEditModal    : PropTypes.bool,
    _toggleAddEditModal : PropTypes.func,
}