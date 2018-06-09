//Helpers
import update from 'immutability-helper';

export default (users = [], action) => {
    switch(action.type){
        case 'USER_CREATED':
            return update(users, {$push: [action.user]});
        case 'USER_EDITED':
            return update(users, {$splice: [[action.index, 1, action.user]]});
        case 'USERS_DLTED':
            return users.filter((user) => {
                return action.selectedUsers.indexOf(user.id) === -1;
            });
        case 'USER_ACTIVE_STATUS_UPDATED':
            return update(users, {[action.index]: {active: {$set: action.active}}});
        case 'LOAD_USERS_SUCCESSFUL':
            return action.users;
        default:
            return users;
    }
}