import React, {
  Component
} from 'react';

//Helpers
import _ from 'lodash';
import PropTypes from 'prop-types';

//React-Redux
import { connect } from 'react-redux';
import * as groupActions from '../../actions/groupActions';

//Third Party Components
import Paper from 'material-ui/Paper';
import { Grid, Row, Col } from 'react-bootstrap';

//Custom Components
import DataTable from '../common/DataTable';
import ActionBar from '../common/ActionBar';
import AddEditGroupModal from './AddEditGroupModal';
import ConfirmDltPopup from '../common/ConfirmDltPopup';

//constants
import { GROUPS_PAGE } from '../../constants';

class GroupsPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      headers: {
        title: "Title",
        adminName: "Admin Name",
        adminEmail: "Admin Email",
        totalUsers: "Total Users",
        active: "Active",
      },
      groups: [],
      searchTerm: '',
      sortType: null,
      sortBy: null,
      selectedGroup: null,
      showDltModal: false,
      showAddEditModal: false,
      isEditModal: false,
    };
  }

  componentWillMount = () => {
    this.setState({
      groups: this.props.groups,
    });
  }

  componentWillReceiveProps = (props) => {
    this.setState({
      groups: props.groups,
    });
  }

  /* Asc  : if sortType = null || 'desc' or sortBy is Changed
   * Desc : if sortType = 'asc'
   * If searchTerm is defined, filter the sorted data
   */

  _sortWRTHeader = (sortBy) => {
    this.setState((prevState, props) => ({
      groups: prevState.sortType !== 'asc' || prevState.sortBy !== sortBy ?                 
      _.orderBy(prevState.groups, [(o) => o[sortBy] === 'string' ? o[sortBy].toLowerCase() : o[sortBy]], ['asc']) :
      _.orderBy(prevState.groups, [(o) => o[sortBy] === 'string' ? o[sortBy].toLowerCase() : o[sortBy]], ['desc']),
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
      groups: this.props.groups.filter((row) => {
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
      groups: this.props.groups,
      searchTerm: null,
      sortBy: null,
      sortType: null
    });
  }

  _addGroup = (group) => {
    this.props.createGroup(group);
    this._toggleAddEditModal();
  }

  _editGroup = (group) => {
    this.props.editGroup(group, this.state.selectedGroup.index);
    this._toggleAddEditModal();
  }

  _dltSelectedGroup = () => {
    this.props.dltGroup(this.state.selectedGroup.index);
    this._toggleDltModal();
  }

  _toggleAddEditModal = (selected = null, index = null) => {
    this.setState((prevState, props) => ({
      selectedGroup: prevState.showAddEditModal || !selected ? null : {
        data: selected,
        index: index,       
      },
      isEditModal: selected ? true : false,
      showAddEditModal: prevState.showAddEditModal ? false : true,
    }));
  }

  _toggleDltModal = (selected = null, index = null) => {
    this.setState((prevState, props) => ({
      selectedGroup: prevState.showdDltModal ? null : {
        data: selected,
        index: index,       
      },
      showDltModal: prevState.showDltModal ? false : true,
    }));
  }

  render() {
    return (
      <div className="groups-page">
        <Grid className="data-table-container" fluid={true}>
          <Row>
            <Col xs={12}>
              <Paper zDepth={1} >
                <ActionBar 
                  searchTerm={this.state.searchTerm}
                  _filterData={this._filterData}
                  _handleSearchTermChange={this._handleSearchTermChange}
                  _clearFilteredData={this._clearFilteredData}
                  _toggleAddEditModal={this._toggleAddEditModal}
                />

                <DataTable 
                  parent={GROUPS_PAGE}
                  headers={this.state.headers} 
                  data={this.state.groups} 
                  sortType={this.state.sortType} 
                  sortBy={this.state.sortBy} 
                  _toggleDltModal={this._toggleDltModal}
                  _toggleAddEditModal={this._toggleAddEditModal}
                  _sortWRTHeader={this._sortWRTHeader}
                />
              </Paper>
            </Col>
          </Row>

          <AddEditGroupModal
            _addGroup={this._addGroup}
            _editGroup={this._editGroup}
            isEditModal={this.state.isEditModal}
            selectedGroup={this.state.selectedGroup}
            showAddEditModal={this.state.showAddEditModal}
            _toggleAddEditModal={this._toggleAddEditModal}
          />
          
          <ConfirmDltPopup
            type='Group'
            showDltModal={this.state.showDltModal}
            _toggleDltModal={this._toggleDltModal}
            _dltSelected={this._dltSelectedGroup}
          />
        
        </Grid>        
      </div>
    );
  }
}

GroupsPage.propTypes = {
  createGroup : PropTypes.func.isRequired,
  editGroup   : PropTypes.func.isRequired,
  dltGroup    : PropTypes.func.isRequired,
  groups      : PropTypes.array.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return { groups: state.groups };
}

const mapDispatchToProps = (dispatch) => {
  return {
    createGroup: group => dispatch(groupActions.createGroup(group)),
    editGroup: (group, index) => dispatch(groupActions.editGroup(group, index)),
    dltGroup: index => dispatch(groupActions.dltGroup(index)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupsPage);