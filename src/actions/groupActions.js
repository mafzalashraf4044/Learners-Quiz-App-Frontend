import axios from 'axios';

export const createGroup = (group) => {
    return { type: 'CREATE_GROUP', group };
}

export const editGroup = (group, index) => {
    return { type: 'EDIT_GROUP', group, index };
}

export const dltGroup = (index) => {
    return { type: 'DLT_GROUP', index };
}

export const loadGroupsSuccessfull = (groups) => {
    return {type: 'LOAD_GROUPS_SUCCESSFUL', groups};
}

export const loadGroups = () => {
    return (dispatch) => {
        return axios.get('http://localhost:1337/groups/all?fields=["title","admin","active"]').then((res) => {
            if(res.status === 200){
                console.log('res',res.data)
                dispatch(loadGroupsSuccessfull(res.data.groups));
            }
        }).catch((err) => {
            console.log("err", err);
        });
    }
}
