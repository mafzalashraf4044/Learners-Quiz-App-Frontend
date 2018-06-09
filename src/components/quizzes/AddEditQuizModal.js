import React, {
    Component
} from 'react';


//Helpers
import _ from 'lodash';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

//Third Party Components
import { Col, Row } from 'react-bootstrap';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';


export default class AddEditQuizModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quiz: {name: '', totalQuestions: '', qustionsForQuiz: '', timeLimit: '', passingScore: '', questions: []},
            currentQuestion: null,
            questionAreaHidden: true,
        };
    }

    shouldComponentUpdate = (nextProps, nextState) => {
      return (this.state !== nextState ||
              this.props.isEditModal !== nextProps.isEditModal || 
              this.props.showAddEditModal !== nextProps.showAddEditModal ||
              (this.props.selectedQuiz !== nextProps.selectedQuiz && nextProps.showAddEditModal)
              //If selected user is changed and AddEditModal is Open, selectedQuiz value can also be changed in case of confirmDltModal
              );
    }

    componentWillReceiveProps = (props) => {
        if(props.isEditModal){
            this.setState({
                quiz: props.selectedQuiz.data,
                currentQuestion: {
                    index: 0,
                    value: props.selectedQuiz.data.questions[0],
                },
                questionAreaHidden: true,
            });            
        }else{
            this.setState({
               quiz: {name: '', totalQuestions: '', qustionsForQuiz: '', timeLimit: '', passingScore: '', questions: []},
               currentQuestion: null,
               questionAreaHidden: true,
            });            
        }
    }
    
    _handleInputChange = (event) => {
        let target = event.target;
        this.setState((prevState, props) => ({
            quiz: update(prevState.quiz, {
                $merge: {
                    [target.name]: target.value,
                }
            }),
        }));
    }

    _handleTotalQuestionsChange = (value) => {
            value = parseInt(value, 10);
            this.setState((prevState, props) => {
                let questions = [];

                /*
                 * If we consider the 'value' parameter and totalQuestion(prevState). there are total 4 possibilities:
                 * 1 - value is null, totalQuestions is empty string (Will execute when the modal is shown)
                 * 2 - value is null, totalQuestions is not empty string (If we unset the value of totalQuestions field)
                 * 3 - value is not null, totalQuestions is empty string (Will execute when we change the value of totalQuestions field for the first time)
                 * 4 - value is not null, totalQuestions is not empty string (When we edit the value of text field without making it empty)
                 */

                /*
                 * Case-4: If Value is defined and totalQuestions is also defined in the prevState (Means there already exist some 
                 * questions), in this case there may be two possibilities, either value is greater than total questions or 
                 * it is less than total question
                 */
                if(_.isNumber(value) && (prevState.quiz.totalQuestions || prevState.quiz.totalQuestions === 0)){
                    if(value > prevState.quiz.totalQuestions){
                        questions = prevState.quiz.questions.concat(new Array(value - prevState.quiz.totalQuestions).fill({
                            text: '',
                            options: new Array(4).fill({
                                text: '',
                                isCorrect: false,
                            }),
                        }));
                    }else if(value < prevState.quiz.totalQuestions){
                        questions = prevState.quiz.questions.slice(0, value);
                    }
                }else if(_.isNumber(value)){
                    /*
                     * Case-3: This Condition will execute if value is defined but totalQuestion is not defined in the prevState, in
                     * this case we will create a new array of question.
                     */
                    questions = new Array(value).fill({
                        text: '',
                        options: new Array(4).fill({
                            text: '',
                            isCorrect: false,
                        }),
                    })
                }

                /*
                 * Case-2: If value is equal to null and totalQuestions(prevState) is defined and contain a one digit number. In this
                 * case we will do nothing and use the default questions array of length zero.  
                 */

                 /*
                  * Case-1: If both value and totalQuestions(prevState) is not defined we'll not set the state, i.e not return
                  * anything.
                  */
                 if(_.isNumber(value) || prevState.quiz.totalQuestions){
                    return ({
                        quiz: update(prevState.quiz, {
                            $merge: {
                                totalQuestions: value === null ? '' : value,
                                questions: questions,
                            }
                        }),
                        currentQuestion: _.isNumber(value) ? {
                            index: 0,
                            value: !prevState.quiz.totalQuestions ? {
                                text: '',
                                options: new Array(4).fill({
                                    text: '',
                                    isCorrect: false,
                                }),
                            } : questions[0]
                        } : null,
                    })
                 }
            });
    }

    _setCurrentQuestion = (isNext) => {
        
        this.setState((prevState, props) => {
            let index = isNext ? ((prevState.currentQuestion.index + 1) === prevState.quiz.questions.length ? 0 : prevState.currentQuestion.index + 1) : ((prevState.currentQuestion.index - 1) === -1 ? prevState.quiz.questions.length - 1: prevState.currentQuestion.index - 1);
            return ({
                quiz: update(prevState.quiz, {questions: {$splice: [[prevState.currentQuestion.index, 1, prevState.currentQuestion.value]]}}),
                currentQuestion: {
                    index:  index,
                    value: this.state.quiz.questions[index].text === '' ? {
                        text: '',
                        options: new Array(4).fill({
                            text: '',
                            isCorrect: false,
                        }),
                    } : this.state.quiz.questions[index]
                }
            })
        });
    }

    _handleQuestionTextChange = (event) => {
        let target = event.target;
        this.setState((prevState, props) => ({
            currentQuestion: update(prevState.currentQuestion, {
                value: {$merge: {text: target.value}}
            }),
        }));
   }

   _handleQuestionOptionChange = (event, index) => {
        let target = event.target;
        this.setState((prevState, props) => ({
            currentQuestion: update(prevState.currentQuestion, {
                value: {
                    options: {
                        [index]: {
                            $merge: {
                                text: target.value
                            }
                        }
                    }
                }
            }),
        }));
   }

   _handleIsOptionCorrect = (event, index) => {
        this.setState((prevState, props) => ({
            currentQuestion: update(prevState.currentQuestion, {
                value: {
                    options: {
                        [index]: {
                            $merge: {
                                isCorrect: prevState.currentQuestion.value.options[index].isCorrect ? false : true
                            }
                        }
                    }
                }
            }),
        }));       
   }

    _isCurrentQuestionFeildsMissing = (question = null) => {
        if(!question && this.state.currentQuestion){
            return this.state.currentQuestion.value.text === '' || _.some(this.state.currentQuestion.value.options, {text: ''})
        } else if(!question && !this.state.currentQuestion){
            return true;
        }

        return question.text === '' || _.some(question.options, {text: ''});
    }

    _isAllQuestionsFilled = () => {
        let isQuestionsMissing = false;
        let questions = this.state.quiz.questions;

        isQuestionsMissing = _.some(questions, {text: '', })

        for(let i = 0; i<questions.length; i++){
            isQuestionsMissing = this._isCurrentQuestionFeildsMissing(questions[i]);

            if((questions.length - 1) === this.state.currentQuestion.index){
               isQuestionsMissing = this._isCurrentQuestionFeildsMissing();
            }          
        }

        return isQuestionsMissing;
    }

    _getTooltipForCorrectAnswerBtn = (isCorrect) => {
        // return (<Tooltip id="tooltip">{!isCorrect ? 'Set as Correct Answer': 'Correct Answer'}</Tooltip>);
    }

    _getOptionsForQuestion = () => {
        return this.state.currentQuestion.value.options.map((option, index) => {
            return (
                <Row key={index}>
                    
                    <Col xs={12}>
                        <TextField
                            name="qustionsForQuiz"
                            fullWidth={true}
                            value={this.state.currentQuestion.value.options[index].text}
                            floatingLabelText={'Option - ' + String.fromCharCode(65 + index)}
                            onChange={(e) => this._handleQuestionOptionChange(e, index)}
                        />                       
                    </Col>
                </Row>
            );
           
        });
    }

    _submitForm = () => {
        this.setState((prevState, props) => ({
            quiz: update(prevState.quiz, {
                questions: {
                    $splice: [
                        [prevState.currentQuestion.index, 1, prevState.currentQuestion.value]
                    ]
                }
            }),
        }), () => {
            if (this.props.isEditModal) {
                this.props._editQuiz(this.state.quiz)
            } else {
                this.props._addQuiz(this.state.quiz)
            }
        });

    }


    render() {
        const actions = [
            <FlatButton
                label={this.props.isEditModal ? 'Save Changes' : 'Add'}
                primary={true}
                style={{display: this.state.questionAreaHidden ? 'none' : 'inline-block'}}
                onTouchTap={(e) => {
                    if(this.props.isEditModal){
                        this.props._editQuiz(this.state.quiz)
                    }else{
                        this.props._addQuiz(this.state.quiz)
                    }
                }}
            />,
            <FlatButton
                label="Go Back"
                style={{display: this.state.questionAreaHidden ? 'none' : 'inline-block'}}
                onTouchTap={() => this.setState({questionAreaHidden: true})}
            />,
            <FlatButton
                label="Add Questions" 
                style={{display: this.state.questionAreaHidden ? 'inline-block' : 'none'}}
                onTouchTap={() => this.setState({questionAreaHidden: false})}
            />,
            <FlatButton
                label="Close"
                primary={true}
                onTouchTap={this.props._toggleAddEditModal.bind(this, null, null)}
            />,
        ];

        return (
            <Dialog
                title={this.props.isEditModal ? 'Edit Quiz' : 'Add Quiz'}
                actions={actions}
                modal={false}
                autoScrollBodyContent={true}
                className="add-edit-quiz-modal"
                open={this.props.showAddEditModal}
                titleStyle={{borderBottom: '1px solid rgb(224, 224, 224)'}}
                contentStyle={{width: window.innerWidth > 992 ? '30%': '75%'}}
                bodyStyle={{width: '100%', padding: '0px 60px 20px 60px'}}
                actionsContainerStyle={{borderTop: '1px solid rgb(224, 224, 224)'}}
                onRequestClose={this.props._toggleAddEditModal.bind(this, null, null)}
            >
                {
                    this.state.questionAreaHidden &&
                    <Col xs={12}>
                        <TextField
                            name="name"
                            fullWidth={true}
                            value={this.state.quiz.name}
                            floatingLabelText="Quiz Name"
                            onChange={this._handleInputChange}
                        />    
                        <TextField
                            name="totalQuestions"
                            type="number"
                            fullWidth={true}
                            value={this.state.quiz.totalQuestions}
                            floatingLabelText="Total Questions"
                            onChange={e => this._handleTotalQuestionsChange(e.target.value)}
                        />    
                        <TextField
                            name="qustionsForQuiz"
                            type="number"
                            fullWidth={true}
                            value={this.state.quiz.qustionsForQuiz}
                            floatingLabelText="Questions For Quiz"
                            onChange={this._handleInputChange}
                        />    
                        <TextField
                            name="timeLimit"
                            type="number"
                            fullWidth={true}
                            value={this.state.quiz.timeLimit}
                            floatingLabelText="Time Limit"
                            onChange={this._handleInputChange}
                        />    
                        <TextField
                            name="passingScore"
                            type="number"
                            fullWidth={true}
                            value={this.state.quiz.passingScore}
                            floatingLabelText="Passing Score"
                            onChange={this._handleInputChange}
                        />    
                    </Col>
                }
 
                {
                    (this.state.quiz.questions.length > 0 && !this.state.questionAreaHidden) && 
                        <Col xs={12}>
                            <h3>Quiz Question {this.state.currentQuestion.index + 1} of {this.state.quiz.questions.length}</h3>
                            <TextField
                                fullWidth={true}
                                multiLine={true}
                                floatingLabelText="Type your question here ..."
                                name={'question' + this.state.currentQuestion.index} 
                                value={this.state.currentQuestion.value.text} 
                                onChange={this._handleQuestionTextChange}
                            />    
                            {
                                this._getOptionsForQuestion()
                            }
                            <div className="prev-next-btns">
                              <RaisedButton label="Previous" disabled={this._isCurrentQuestionFeildsMissing()} onTouchTap={(e) => this._setCurrentQuestion(false)} />
                              <RaisedButton label="next" disabled={this._isCurrentQuestionFeildsMissing()} onTouchTap={(e) => this._setCurrentQuestion(true)} />
                            </div>
                        </Col>
                }
            </Dialog>

        );
    };
}

AddEditQuizModal.propType = {
    _addQuiz            : PropTypes.func,
    _editQuiz           : PropTypes.func,
    isEditModal         : PropTypes.bool,
    selectedQuiz        : PropTypes.object,
    showAddEditModal    : PropTypes.bool,
    _toggleAddEditModal : PropTypes.func,
}