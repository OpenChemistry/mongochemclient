import { createAction, handleActions } from 'redux-actions';

export const REDIRECT_TO_JUPYTERHUB = 'REDIRECT_TO_JUPYTERHUB';
export const REDIRECTING_TO_JUPYTERHUB = 'REDIRECTING_TO_JUPYTERHUB';
export const INVALIDATE_SESSION = 'INVALIDATE_SESSION'
export const REQUEST_SESSION_INVALIDATION = 'REQUEST_SESSION_INVALIDATION';

export const initialState = {
  error: null,
  redirecting: false
};

// Reducer
const reducer = handleActions({
  REDIRECTING_TO_JUPYTERHUB: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error, redirecting: false};
    }
    else {
      return {...state,  error: null, redirecting: true };
    }
  },
  REQUEST_SESSION_INVALIDATION: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error: null };
    }
  }
}, initialState);


export const redirectToJupyterHub = createAction(REDIRECT_TO_JUPYTERHUB)
export const redirectingToJupyterHub = createAction(REDIRECTING_TO_JUPYTERHUB)
export const invalidateSession = createAction(INVALIDATE_SESSION, (login) => ({login}))
export const requestSessionInvalidation = createAction(REQUEST_SESSION_INVALIDATION)

export default reducer;
