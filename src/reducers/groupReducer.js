//Helpers
import update from 'immutability-helper';

export default (groups = [], action) => {
    switch (action.type) {
        case 'CREATE_GROUP':
            return update(groups, {$push: [action.group]});
        case 'EDIT_GROUP':
            return update(groups, {$splice: [[action.index, 1, action.group]]});
        case 'DLT_GROUP':
            return update(groups, {$splice: [[action.index, 1]]});
        case 'LOAD_GROUPS_SUCCESSFUL':
            return action.groups;
        default:
            return groups;
    }
}