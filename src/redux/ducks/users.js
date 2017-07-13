import { createAction, handleActions } from 'redux-actions';

// Actions
export const LOAD_USER_ME   = 'LOAD_USER_ME';
export const REQUEST_USER_ME   = 'REQUEST_USER_ME';
export const RECEIVE_USER_ME   = 'RECEIVE_USER_ME';


export const initialState = {
    me: {},
    error: null,
  };

// Reducer
const reducer = handleActions({
  REQUEST_USER_ME: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error:null };
    }
  },
  RECEIVE_USER_ME: (state, action) => {
    const me = action.payload.me;
    return {...state, me};
  }
}, initialState);

// Action Creators

// Fetch users
export const loadUserMe = createAction(LOAD_USER_ME);
export const requestUserMe = createAction(REQUEST_USER_ME);
export const receiveUserMe = createAction(RECEIVE_USER_ME, (me) => ({ me }));

export default reducer;

