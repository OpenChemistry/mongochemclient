import { createAction, handleActions } from 'redux-actions';

// Actions
export const SELECT_MOLECULE = 'SELECT_MOLECULE';
export const SELECT_AUTH_PROVIDER = 'SELECT_AUTH_PROVIDER';
export const SHOW_NERSC_LOGIN = 'SHOW_NERSC_LOGIN';


export const initialState = {
  selectedMoleculeId: null,
  selectAuthProvider: false,
  nersc: {
    login: {
      show: false
    }
  }
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
  throw: (state, action) => state
}, initialState);

// Action Creators
export const selectMolecule = createAction(SELECT_MOLECULE, (id) => ({id}));
export const selectAuthProvider = createAction(SELECT_AUTH_PROVIDER);
export const showNerscLogin = createAction(SHOW_NERSC_LOGIN);

export default reducer;
