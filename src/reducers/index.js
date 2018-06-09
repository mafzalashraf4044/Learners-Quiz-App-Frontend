import { combineReducers } from 'redux';
import users from './userReducer';
import quizzes from './quizReducer';
import groups from './groupReducer';

const rootReducer = combineReducers({
    users,
    quizzes,
    groups,
});

export default rootReducer;