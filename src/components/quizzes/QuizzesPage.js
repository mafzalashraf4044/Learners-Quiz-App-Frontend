import React, {
  Component
} from 'react';

//Helpers
import _ from 'lodash';
import PropTypes from 'prop-types';

//constants
import { QUIZZES_PAGE } from '../../constants';

//React-Redux
import { connect } from 'react-redux';
import * as quizActions from '../../actions/quizActions';

//Third Party Components
import Paper from 'material-ui/Paper';
import { Grid, Row, Col } from 'react-bootstrap';

//Custom Components
import DataTable from '../common/DataTable';
import ActionBar from '../common/ActionBar';
import AddEditQuizModal from './AddEditQuizModal';
import ConfirmDltPopup from '../common/ConfirmDltPopup';

class QuizzesPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      headers: {
        name: "Name",
        totalQuestions: "Number of Questions",
        qustionsForQuiz: "Qustions for Quiz",
        timeLimit: "Time Limit",
        passingScore: "Passing Score",
        active: "Active",
      },
      quizzes: [],
      searchTerm: '',
      sortType: null,
      sortBy: null,
      selectedQuiz: null,
      showDltModal: false,
      showAddEditModal: false,
      isEditModal: false,
    };
  }

  componentWillMount(){
    this.setState({
      quizzes: this.props.quizzes,
    });
  }

  componentWillReceiveProps = (props) => {
    this.setState({
      quizzes: props.quizzes,
    });
  }

  /* Asc  : if sortType = null || 'desc' or sortBy is Changed
   * Desc : if sortType = 'asc'
   * If searchTerm is defined, filter the sorted data
   */
  
  _sortWRTHeader = (sortBy) => {
    console.log("sortBy", sortBy)
    this.setState((prevState, props) => ({
      quizzes: prevState.sortType !== 'asc' || prevState.sortBy !== sortBy ?                 
      _.orderBy(prevState.quizzes, [(o) => typeof o[sortBy] === 'string' ? o[sortBy].toLowerCase() : o[sortBy]], ['asc']) :
      _.orderBy(prevState.quizzes, [(o) => typeof o[sortBy] === 'string' ? o[sortBy].toLowerCase() : o[sortBy]], ['desc']),
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
      quizzes: this.props.quizzes.filter((row) => {
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
      quizzes: this.props.quizzes,
      searchTerm: null,
      sortBy: null,
      sortType: null
    });
  }

  _addQuiz = (quiz) => {
    this.props.createQuiz(quiz);
    this._toggleAddEditModal();
  }

  _editQuiz = (quiz) => {
    this.props.editQuiz(quiz, this.state.selectedQuiz.index);
    this._toggleAddEditModal();
  }

  _dltSelectedQuiz = () => {
    this.props.dltQuiz(this.state.selectedQuiz.index);
    this._toggleDltModal();
  }

  _toggleAddEditModal = (selected = null, index = null) => {
    this.setState((prevState, props) => ({
      selectedQuiz: prevState.showAddEditModal || !selected ? null : {
        data: selected,
        index: index,       
      },
      isEditModal: selected ? true : false,
      showAddEditModal: prevState.showAddEditModal ? false : true,

    }));
  }

  _toggleDltModal = (selected = null, index = null) => {
    this.setState((prevState, props) => ({
      selectedQuiz: prevState.showdDltModal ? null : {
        data: selected,
        index: index,       
      },
      showDltModal: prevState.showDltModal ? false : true,
    }));
  }

  render() {
    return (
      <div className="quizzes-page">
        <Grid className="data-table-container" fluid={true}>
          <Row>
            <Col xs={12}>
              <Paper zDepth={1}>
                <ActionBar 
                  searchTerm={this.state.searchTerm}
                  _filterData={this._filterData}
                  _handleSearchTermChange={this._handleSearchTermChange}
                  _clearFilteredData={this._clearFilteredData}
                  _toggleAddEditModal={this._toggleAddEditModal}
                />

                <DataTable 
                  parent={QUIZZES_PAGE}
                  headers={this.state.headers} 
                  data={this.state.quizzes} 
                  sortType={this.state.sortType} 
                  sortBy={this.state.sortBy} 
                  _toggleDltModal={this._toggleDltModal}
                  _toggleAddEditModal={this._toggleAddEditModal}
                  _sortWRTHeader={this._sortWRTHeader}
                />
              </Paper>
            </Col>
          </Row>

          <AddEditQuizModal
            _addQuiz={this._addQuiz}
            _editQuiz={this._editQuiz}
            isEditModal={this.state.isEditModal}
            selectedQuiz={this.state.selectedQuiz}
            showAddEditModal={this.state.showAddEditModal}
            _toggleAddEditModal={this._toggleAddEditModal}
          />
          
          <ConfirmDltPopup 
            type="Quiz"
            showDltModal={this.state.showDltModal}
            _toggleDltModal={this._toggleDltModal}
            _dltSelected={this._dltSelectedQuiz}
          />
        
        </Grid>
      </div>
    );
  }
}

QuizzesPage.propTypes = {
  createQuiz: PropTypes.func.isRequired,
  editQuiz: PropTypes.func.isRequired,
  dltQuiz: PropTypes.func.isRequired,
  quizzes: PropTypes.array.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {quizzes: state.quizzes};
}

const mapDispatchToProps = (dispatch) => {
  return {
    createQuiz: quiz => dispatch(quizActions.createQuiz(quiz)),
    editQuiz: (quiz, index) => dispatch(quizActions.editQuiz(quiz, index)),
    dltQuiz: index => dispatch(quizActions.dltQuiz(index)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizzesPage);