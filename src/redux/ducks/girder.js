import { createAction, handleActions } from 'redux-actions';

// Actions
export const NEW_TOKEN   = 'NEW_TOKEN';
export const INVALIDATE_TOKEN = 'INVALIDATE_TOKEN';
export const REQUEST_TOKEN_INVALIDATION = 'REQUEST_TOKEN_INVALIDATION';
export const AUTHENTICATE = 'AUTHENTICATE';
export const SET_AUTHENTICATING = 'SET_AUTHENTICATING';
export const SET_ME = 'SET_ME';
export const REQUEST_ME = 'REQUEST_ME'
export const RECEIVE_ME = 'RECEIVE_ME'
export const LOAD_ME = 'LOAD_ME'

export const LOAD_OAUTH_PROVIDERS = 'LOAD_OAUTH_PROVIDERS';
export const REQUEST_OAUTH_PROVIDERS = 'REQUEST_OAUTH_PROVIDERS';
export const RECEIVE_OAUTH_PROVIDERS = 'RECEIVE_OAUTH_PROVIDERS';


export const initialState = {
    token: null,
    authenticating: false,
    oauth: {
      providers: {}
    },
    me: null
  };

// Reducer
const reducer = handleActions({
  NEW_TOKEN: (state, action) => {
    const token = action.payload.token;
    const providers = null;
    const oauth = {
        providers
    }
    return {...state, token, oauth};
  },
  REQUEST_TOKEN_INVALIDATION: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error:null };
    }
  },
  REQUEST_OAUTH_PROVIDERS: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error:null };
    }
  },
  RECEIVE_OAUTH_PROVIDERS: (state, action) => {
    const providers = action.payload.providers
    const oauth = {
        providers
    }
    return {...state, oauth};
  },
  SET_AUTHENTICATING: (state, action) => {
    const authenticating = action.payload

    return {...state, authenticating};
  },
  SET_ME: (state, action) => {
    const me = action.payload

    return {...state, me};
  },
  RECEIVE_ME: (state, action) => {
    const me = action.payload

    return {...state, me};
  },

}, initialState);

// Action Creators

// Fetch user token
export const newToken = createAction(NEW_TOKEN, (token) => ({ token }));
export const requestTokenInvalidation = createAction(REQUEST_TOKEN_INVALIDATION);
export const setMe = createAction(SET_ME);
export const requestMe = createAction(REQUEST_ME);
export const receiveMe = createAction(RECEIVE_ME);
export const loadMe = createAction(LOAD_ME);

// Auth
export const authenticate = createAction(AUTHENTICATE, (token) => ({ token }));
export const setAuthenticating = createAction(SET_AUTHENTICATING);
export const invalidateToken = createAction(INVALIDATE_TOKEN);

// OAuth
export const loadOauthProviders = createAction(LOAD_OAUTH_PROVIDERS);
export const requestOauthProviders = createAction(REQUEST_OAUTH_PROVIDERS);
export const receiveOauthProviders = createAction(RECEIVE_OAUTH_PROVIDERS, (providers) => ({providers}));

export default reducer;

