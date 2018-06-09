import React, {
    Component
} from 'react';

//Helpers
import PropTypes from 'prop-types';
import update from 'immutability-helper';

//Third Party Components
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton'; 

export default class AddEditGroupModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            group: {name: '', totalUsers: '', adminName: '', adminEmail: ''},
        };
    }

    shouldComponentUpdate = (nextProps, nextState) => {
      return (this.state !== nextState ||
              this.props.isEditModal !== nextProps.isEditModal || 
              this.props.showAddEditModal !== nextProps.showAddEditModal ||
              (this.props.selectedGroup !== nextProps.selectedGroup && nextProps.showAddEditModal)
              //If selected user is changed and AddEditModal is Open, selectedGroup value can also be changed in case of confirmDltModal
              );
    }

    componentWillReceiveProps = (props) => {
        if(props.isEditModal){
            this.setState({
                group: props.selectedGroup.data,
            });            
        }else{
            this.setState({
               group: {name: '', totalUsers: '', adminName: '', adminEmail: ''},
            });            
        }
    }

    _handleInputChange = (event) => {
        let target = event.target;
        this.setState((prevState, props) => ({
            group: update(prevState.group, {$merge: {[target.name]: target.value}}),
        }));
    }

    render() {
        const actions = [
            <FlatButton
                label={this.props.isEditModal ? 'Save Changes' : 'Add'}
                primary={true}
                onTouchTap={(e) => {
                    if(this.props.isEditModal){
                        this.props._editGroup(this.state.group)
                    }else{
                        this.props._addGroup(this.state.group)
                    }
                }}
            />,
            <FlatButton
                label="Close"
                primary={true}
                onTouchTap={this.props._toggleAddEditModal.bind(this, null, null)}
            />,
        ];

        return (
            <Dialog
                title={this.props.isEditModal ? 'Edit Group' : 'Add Group'}
                actions={actions}
                modal={false}
                autoScrollBodyContent={true}
                open={this.props.showAddEditModal}
                titleStyle={{borderBottom: '1px solid rgb(224, 224, 224)'}}
                contentStyle={{width: window.innerWidth > 992 ? '30%': '75%'}}
                bodyStyle={{width: '100%', padding: '0px 60px 20px 60px'}}
                actionsContainerStyle={{borderTop: '1px solid rgb(224, 224, 224)'}}
                onRequestClose={this.props._toggleAddEditModal.bind(this, null, null)}
            >
                <TextField
                    name="name"
                    fullWidth={true}
                    value={this.state.group.name}
                    floatingLabelText="Group Name"
                    onChange={this._handleInputChange}
                />    
                {
                    !this.props.isEditModal &&  
                    <TextField
                        name="securityCode"
                        fullWidth={true}
                        value={this.state.group.securityCode}
                        floatingLabelText="Security Code"
                        onChange={this._handleInputChange}
                    />    
                }  
                <TextField
                    name="adminName"
                    fullWidth={true}
                    value={this.state.group.adminName}
                    floatingLabelText="Admin Name"
                    onChange={this._handleInputChange}
                />    
                <TextField
                    name="adminEmail"
                    fullWidth={true}
                    value={this.state.group.adminEmail}
                    floatingLabelText="Admin Email"
                    onChange={this._handleInputChange}
                />
            </Dialog>
        );
    };
}

AddEditGroupModal.propType = {
    _addGroup           : PropTypes.func,
    _editGroup          : PropTypes.func,
    isEditModal         : PropTypes.bool,
    selectedGroup       : PropTypes.object,
    showAddEditModal    : PropTypes.bool,
    _toggleAddEditModal : PropTypes.func,
}