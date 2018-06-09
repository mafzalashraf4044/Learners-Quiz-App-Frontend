import _ from 'lodash';
import axios from 'axios';

export const userCreated = (user) => {
    return {type: 'USER_CREATED', user};
};

export const userEdited = (user, index) => {
    return {type: 'USER_EDITED', user, index};
}

export const usersDeleted = (selectedUsers) => {
    return {type: 'USERS_DLTED', selectedUsers};
}

export const userActiveStatusUpdated = (index, active) => {
    return {type: 'USER_ACTIVE_STATUS_UPDATED', index, active};
}

export const loadUsersSuccessful = (users) => {
    return {type: 'LOAD_USERS_SUCCESSFUL', users};
}

export const loadUsers = () => {
    return (dispatch) => {
        return axios.get('http://localhost:1337/users/all?fields=["firstName","lastName","email","username","active"]').then((res) => {
            if(res.status === 200){
                console.log('res',res.data)
                dispatch(loadUsersSuccessful(res.data.users));
            }
        }).catch((err) => {
            console.log("err", err);
        });
    }
}

export const createUser = (user) => {
    return (dispatch) => {
        return axios.post('http://localhost:1337/users/create', user).then((res) => {
            if(res.status === 200){
                dispatch(userCreated(res.data.user));
            }else if(res.status === 400){

            }
        }).catch((err) => {
            console.log("err", err);
            throw(err);
        });
    }
}

export const editUser = (user, index) => {
    return (dispatch) => {
        return axios.post('http://localhost:1337/users/edit/' + user.id, user).then((res) => {
            if(res.status === 200){
                dispatch(userEdited(res.data.user, index));
            }else if(res.status === 400){

            }
        }).catch((err) => {
            console.log("err", err);
            throw(err);
        });
    }
}

export const dltSelectedUsers = (selectedUsers) => {
    console.log("selectedusers", selectedUsers)
    return (dispatch) => {
        return axios.post('http://localhost:1337/users/delete-selected-users', {
            ids: selectedUsers
        }).then((res) => {
            if(res.status === 200){
                    dispatch(usersDeleted(selectedUsers));
            }else if(res.status === 400){

            }
        }).catch((err) => {
            console.log("err", err);
            throw(err);
        });
    }
}

export const toggleUserActiveStatus = (id, index, active) => {
    return (dispatch) => {
        return axios.post('http://localhost:1337/users/activate-deactivate-user/' + id, {
            active: active
        }).then((res) => {
            if(res.status === 200){
                dispatch(userActiveStatusUpdated(index, res.updatedActiveStatus));
            }else if(res.status === 400){

            }
        }).catch((err) => {
            console.log("err", err);
            throw(err);
        });
    }
}
