import React, {
    Component
} from 'react';

//Helpers
import _ from 'lodash';
import PropTypes from 'prop-types';

//constants
import { USERS_PAGE, GROUPS_PAGE, QUIZZES_PAGE } from '../../constants';

//Third Party Components
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Toggle from 'material-ui/Toggle';
import FontIcon from 'material-ui/FontIcon';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';

class DataTable extends Component {

    constructor(props){
      super(props);
      this.state = {
        keys: [],
        tableHeight: window.innerHeight - 220,
      };

    }

    shouldComponentUpdate = (nextProps, nextState) => {
      return (this.props.data !== nextProps.data || 
              this.props.sortBy !== nextProps.sortBy ||
              this.props.sortType !== nextProps.sortType ||
              this.props.selectedUsers !== nextProps.selectedUsers);
    }

    componentWillMount() {
      this.setState({
        keys: Object.keys(this.props.headers)
      });
    }

    getUserTableCoulmns = (user, index) => {
        return [
                <TableRowColumn style={{width: 72}}>
                  <Checkbox
                    checked={this.props.selectedUsers.indexOf(user.id) != -1}
                    onCheck={(e, checked) => this.props._setSelectedUsers(user.id, true, checked)}
                  />                  
                </TableRowColumn>,
                <TableRowColumn>{user.firstName}</TableRowColumn>,
                <TableRowColumn>{user.lastName}</TableRowColumn>,
                <TableRowColumn>{user.email}</TableRowColumn>,
                <TableRowColumn>{user.avg}</TableRowColumn>,
                <TableRowColumn>{user.username}</TableRowColumn>,
                <TableRowColumn>
                    <Toggle defaultToggled={user.active} onToggle={(e, active) => this.props._toggleUserActiveStatus(user.id, index, active)}/>
                </TableRowColumn>,
                <TableRowColumn>{_.join(_.map(user.groups, 'title'))}</TableRowColumn>
            ];
    }

    getGroupTableCoulmns = (group) => {
        return [
                <TableRowColumn>{group.title}</TableRowColumn>,
                <TableRowColumn>{group.admin.firstName + group.admin.lastName}</TableRowColumn>,
                <TableRowColumn>{group.admin.email}</TableRowColumn>,
                <TableRowColumn>{group.totalUsers}</TableRowColumn>,
                <TableRowColumn>
                    <Toggle defaultToggled={group.active} />
                </TableRowColumn>,
            ];
    }

    getQuizTableCoulmns = (quiz) => {
        return [
                <TableRowColumn>{quiz.name}</TableRowColumn>,
                <TableRowColumn>{quiz.totalQuestions}</TableRowColumn>,
                <TableRowColumn>{quiz.qustionsForQuiz}</TableRowColumn>,
                <TableRowColumn>{quiz.timeLimit}</TableRowColumn>,
                <TableRowColumn>{quiz.passingScore}</TableRowColumn>,
                <TableRowColumn>
                    <Toggle defaultToggled={quiz.active} />
                </TableRowColumn>,
            ];
    }

    render() {
        return (
          <div className="data-table">
            <Table 
              selectable={false}
              fixedHeader={true}
              { ...(window.innerWidth > 992 && {height: this.state.tableHeight.toString() + 'px'}) }
            >
              <TableHeader
                displaySelectAll={false}
                adjustForCheckbox={false}              
              >
                <TableRow>
                  <TableHeaderColumn style={{width: 72}}>
                    <Checkbox
                      checked={this.props.selectedUsers.length === this.props.data.length}
                      onCheck={(e, checked) => this.props._setSelectedUsers(null, true, checked, true)}
                    />             
                  </TableHeaderColumn>
                  {
                    this.state.keys.map((key, index) => {
                      return (
                        <TableHeaderColumn key={index} onTouchTap={(e) => this.props._sortWRTHeader(key)}>
                          {this.props.headers[key]} &nbsp;
                          {
                            this.props.sortBy === key ? 
                            <i className={this.props.sortType === 'asc' ? 'fa fa-sort-desc' : 'fa fa-sort-asc'}></i> :
                            <i className="fa fa-sort"></i>
                          }
                        </TableHeaderColumn>
                      );
                    })
                  }
                  <TableHeaderColumn>Actions</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                { 
                  this.props.data.map((row, index) => {
                    return (
                        <TableRow key={index}>
                          {this.props.parent === USERS_PAGE ? this.getUserTableCoulmns(row, index) : null}
                          {this.props.parent === GROUPS_PAGE ? this.getGroupTableCoulmns(row) : null}
                          {this.props.parent === QUIZZES_PAGE ? this.getQuizTableCoulmns(row) : null}

                          <TableRowColumn>
                            <div className="btn-group">
                              <RaisedButton 
                                style={{minWidth: '50px'}} 
                                onTouchTap={(e) => this.props._toggleAddEditModal(row, index)} 
                                icon={<FontIcon className="fa fa-pencil" style={{fontSize: '14px'}}/>} 
                              />
                              <RaisedButton 
                                style={{minWidth: '50px'}} 
                                onTouchTap={(e) => this.props._setSelectedUsers(row.id)} 
                                icon={<FontIcon className="fa fa-trash" style={{fontSize: '14px'}}/>} 
                              />
                            </div>                              
                          </TableRowColumn>
                        </TableRow>                      
                    );
                  })
                }
              </TableBody>
            </Table>
          </div>
        );
    };
}

DataTable.propType = {
    headers             : PropTypes.object,
    data                : PropTypes.object, 
    selectedUsers       : PropTypes.object, 
    sortType            : PropTypes.string, 
    sortBy              : PropTypes.string,
    _toggleDltModal     : PropTypes.func,
    _toggleAddEditModal : PropTypes.func,
    _sortWRTHeader      : PropTypes.func,   
}

export default DataTable;