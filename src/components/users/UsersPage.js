import React, {
  Component
} from 'react';

//Helpers
import _ from 'lodash';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

//constants
import { USERS_PAGE } from '../../constants';

//React-Redux
import { connect } from 'react-redux';
import * as userActions from '../../actions/userActions';

//Third Party Components
import Paper from 'material-ui/Paper';
import { Grid, Row, Col } from 'react-bootstrap';

//Custom Components
import DataTable from '../common/DataTable';
import ActionBar from '../common/ActionBar';
import AddEditUserModal from './AddEditUserModal';
import ConfirmDltPopup from '../common/ConfirmDltPopup';

class UsersPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      headers: {
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        avg: "Average Score",
        username: "Username",
        active: "Active",
        groups: "Groups", //Array
        //quizzes, username, password
      },
      users: [],
      searchTerm: '',
      sortType: null,
      sortBy: null,
      selectedUser: null, //for edit
      selectedUsers: [], //for dlt
      showDltModal: false,
      showAddEditModal: false,
      isEditModal: false,
    };
  }

  componentWillMount = () => {
    this.setState({
      users: this.props.users,
    });
  }

  componentWillReceiveProps = (props) => {
    this.setState({
      users: props.users,
    });
  }

  /* Asc  : if sortType = null || 'desc' or sortBy is Changed
   * Desc : if sortType = 'asc'
   * If searchTerm is defined, filter the sorted data
   */

  _sortWRTHeader = (sortBy) => {
    this.setState((prevState, props) => ({
      users: prevState.sortType !== 'asc' || prevState.sortBy !== sortBy ?                 
      _.orderBy(prevState.users, [(o) => o[sortBy] === 'string' ? o[sortBy].toLowerCase() : o[sortBy]], ['asc']) :
      _.orderBy(prevState.users, [(o) => o[sortBy] === 'string' ? o[sortBy].toLowerCase() : o[sortBy]], ['desc']),
      sortBy: sortBy,
      sortType: prevState.sortType !== 'asc' || prevState.sortBy !== sortBy ? 'asc' : 'desc',
    }));
  }

  _handleSearchTermChange = (event) => {
    this.setState({
      searchTerm: event.target.value,
    });
  }

  //Sorting will be lost after filtering
  _filterData = () => {
    this.setState((prevState, props) => ({
      users: this.props.users.filter((row) => {
        let isTrue = false;
        for (let key in row) {
          //Booleans can not be filtered
          //Filtering Values of type !== object
          if(typeof row[key] !== 'object' && typeof row[key] !== 'boolean'){
            isTrue = row[key].toString().toLowerCase().indexOf(this.state.searchTerm.toLowerCase()) !== -1 ? true : false;
            if(isTrue){
              break;
            }
          }else if(typeof row[key] !== 'boolean'){
            // Filtering for Arrays(type === object)
            for(let i = 0; i<row[key].length; i++){
              isTrue = row[key][i].toString().toLowerCase().indexOf(this.state.searchTerm.toLowerCase()) !== -1 ? true : false;
              if(isTrue){
                break;
              }
            }
          }
        }

        return isTrue;
      }),
      sortBy: null,
      sortType: null,
    }));
  }

  _clearFilteredData = () => {
    this.setState({
      users: this.props.users,
      searchTerm: '',
      sortBy: null,
      sortType: null
    });
  }

  _addUser = (user) => {
    this.props.createUser(user).then(() => {
      this._toggleAddEditModal();
    });
  }

  _editUser = (user) => {
    this.props.editUser(user, this.state.selectedUser.index).then(() => {
      this._toggleAddEditModal();
    });
  }

  _dltSelectedUsers = () => {
    console.log("selectedUsers", this.state.selectedUsers)
    this.props.dltSelectedUsers(this.state.selectedUsers).then(() => {
      this._toggleDltModal();
    });
  }

  _toggleUserActiveStatus = (id, index, active) => {
    this.props.toggleUserActiveStatus(id, index, active);
  }

  _toggleAddEditModal = (selected = null, index = null) => {
    this.setState((prevState, props) => ({
      selectedUser: prevState.showAddEditModal || !selected ? null : {
        data: selected,
        index: index,       
      },
      isEditModal: selected ? true : false,
      showAddEditModal: prevState.showAddEditModal ? false : true,
    }));
  }

  _setSelectedUsers = (id, multiple = false, checked = false, selectAll = false) => {

    //For deleting all users
    if(selectAll){
      //If selecte all checkbox is checked, select all users, else remove all users
      this.setState((prevState, props) => ({
        selectedUsers: checked ? _.map(prevState.users, 'id') : [],
      }));

    }else{
      //For deleting single user, using action button
      if(!multiple){
        this.setState((prevState, props) => ({
          selectedUsers: [id]
        }), () => {
          this._toggleDltModal();
        });
      }else{
        //For deleting multiple users, selected via checkboxes
        if(checked){
          this.setState((prevState, props) => ({
            selectedUsers: update(prevState.selectedUsers, {$push: [id]}),
          }));
        }else{
          this.setState((prevState, props) => ({
            selectedUsers: _.pull(prevState.selectedUsers, id)
          }));
        }
      }
    }
  }

  _toggleDltModal = () => {
    this.setState((prevState, props) => ({
      showDltModal: prevState.showDltModal ? false : true,
      selectedUsers: prevState.showDltModal ? [] : prevState.selectedUsers,
    }));
  }

  render() {
    return (
      <div className="users-page">
        <Grid className="data-table-container" fluid={true}>
          <Row>
            <Col xs={12}>
              <Paper zDepth={1}>
                <ActionBar 
                  searchTerm={this.state.searchTerm}
                  _filterData={this._filterData}
                  _toggleDltModal={this._toggleDltModal}
                  _handleSearchTermChange={this._handleSearchTermChange}
                  _clearFilteredData={this._clearFilteredData}
                  _toggleAddEditModal={this._toggleAddEditModal}
                />

                <DataTable
                  parent={USERS_PAGE}
                  headers={this.state.headers} 
                  data={this.state.users}
                  selectedUsers={this.state.selectedUsers}
                  sortType={this.state.sortType} 
                  sortBy={this.state.sortBy} 
                  _setSelectedUsers={this._setSelectedUsers}
                  _toggleDltModal={this._toggleDltModal}
                  _toggleAddEditModal={this._toggleAddEditModal}
                  _toggleUserActiveStatus={this._toggleUserActiveStatus}
                  _sortWRTHeader={this._sortWRTHeader}
                />
              </Paper>
            </Col>
          </Row>

          <AddEditUserModal
            _addUser={this._addUser}
            _editUser={this._editUser}
            groups={this.props.groups}
            isEditModal={this.state.isEditModal}
            selectedUser={this.state.selectedUser}
            showAddEditModal={this.state.showAddEditModal}
            _toggleAddEditModal={this._toggleAddEditModal}
          />
          
          <ConfirmDltPopup
            type='User'
            showDltModal={this.state.showDltModal}
            _toggleDltModal={this._toggleDltModal}
            _dltSelected={this._dltSelectedUsers}
          />
        
        </Grid>        
      </div>
    );
  }
}

UsersPage.propTypes = {
  createUser : PropTypes.func.isRequired,
  editUser   : PropTypes.func.isRequired,
  dltUser    : PropTypes.func.isRequired,
  users      : PropTypes.array.isRequired,
  groups     : PropTypes.array.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return { 
    users: state.users,
    groups: state.groups,
   };
}

const mapDispatchToProps = (dispatch) => {
  return {
    createUser: user => dispatch(userActions.createUser(user)),
    editUser: (user, index) => dispatch(userActions.editUser(user, index)),
    dltSelectedUsers: selectedUsers => dispatch(userActions.dltSelectedUsers(selectedUsers)),
    toggleUserActiveStatus: (id, index, active) => dispatch(userActions.toggleUserActiveStatus(id, index, active)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersPage);