import { createAction, handleActions } from 'redux-actions';

export const AUTHENTICATE_NERSC = 'AUTHENTICATE_NERSC';
export const AUTHENTICATE_WITH_NEWT = 'AUTHENTICATE_WITH_NEWT';

export const initialState = {
  newt: {
    error: null
  }
};

// Reducer
const reducer = handleActions({
  AUTHENTICATE_WITH_NEWT: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error: null };
    }
  }
}, initialState);


export const authenticateNersc = createAction(AUTHENTICATE_NERSC,
    (username, password, reject, resolve) => ({username, password, reject, resolve}));
export const authenticateWithNewt = createAction(AUTHENTICATE_WITH_NEWT)

export default reducer;
