import { createAction, handleActions } from 'redux-actions';

// Actions
export const SELECT_MOLECULE = 'SELECT_MOLECULE';
export const SELECT_AUTH_PROVIDER = 'SELECT_AUTH_PROVIDER';
export const SHOW_NERSC_LOGIN = 'SHOW_NERSC_LOGIN';

export const LOAD_NOTEBOOKS   = 'LOAD_NOTEBOOKS';
export const REQUEST_NOTEBOOKS   = 'REQUEST_NOTEBOOKS';
export const RECEIVE_NOTEBOOKS   = 'RECEIVE_NOTEBOOKS';

export const REQUEST_OC_FOLDER = 'REQUEST_OC_FOLDER';
export const RECEIVE_OC_FOLDER = 'RECEIVE_OC_FOLDER';


export const initialState = {
  selectedMoleculeId: null,
  selectAuthProvider: false,
  nersc: {
    login: {
      show: false
    }
  },
  notebooks: []
};

// Reducer
const reducer = handleActions({
  SELECT_MOLECULE: (state, action) => {
    const selectedMoleculeId = action.payload.id;
    return {...state, selectedMoleculeId };
  },
  SELECT_AUTH_PROVIDER: (state, action) => {
    const selectAuthProvider = action.payload;
    return {...state, selectAuthProvider };
  },
  SHOW_NERSC_LOGIN: (state, action) => {
    const show = action.payload;
    const nersc = {
        login: {
          show
        }
    };
    return {...state, nersc };
  },
  REQUEST_NOTEBOOKS: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error:null };
    }
  },
  RECEIVE_NOTEBOOKS: (state, action) => {
    const notebooks = action.payload.notebooks;
    return {...state,  notebooks };
  },
  REQUEST_OC_FOLDER: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error:null };
    }
  },
  RECEIVE_OC_FOLDER: (state, action) => {
    const ocFolder = action.payload.folder;


    return {...state,  ocFolder };
  },
  throw: (state, action) => state
}, initialState);

// Action Creators
export const selectMolecule = createAction(SELECT_MOLECULE, (id) => ({id}));
export const selectAuthProvider = createAction(SELECT_AUTH_PROVIDER);
export const showNerscLogin = createAction(SHOW_NERSC_LOGIN);

export const loadNotebooks = createAction(LOAD_NOTEBOOKS);
export const requestNotebooks = createAction(REQUEST_NOTEBOOKS);
export const receiveNotebooks = createAction(RECEIVE_NOTEBOOKS, (notebooks) => ({ notebooks }));

export const requestOcFolder = createAction(REQUEST_OC_FOLDER);
export const receiveOcFolder = createAction(RECEIVE_OC_FOLDER, (folder) =>({folder}));

export default reducer;
