import { createAction, handleActions } from 'redux-actions';

export const REDIRECT_TO_JUPYTERHUB = 'REDIRECT_TO_JUPYTERHUB';
export const REDIRECTING_TO_JUPYTERHUB = 'REDIRECTING_TO_JUPYTERHUB';

export const initialState = {
  newt: {
    error: null
  }
};

// Reducer
const reducer = handleActions({
  REDIRECTING_TO_JUPYTERHUB: (state, action) => {
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

export default reducer;
