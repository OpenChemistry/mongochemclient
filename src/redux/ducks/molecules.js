import { createAction, handleActions } from 'redux-actions';

// Actions
export const LOAD_MOLECULES   = 'LOAD_MOLECULES';
export const REQUEST_MOLECULES   = 'REQUEST_MOLECULES';
export const RECEIVE_MOLECULES   = 'RECEIVE_MOLECULES';

export const LOAD_MOLECULE   = 'LOAD_MOLECULE';
export const REQUEST_MOLECULE   = 'REQUEST_MOLECULE';
export const RECEIVE_MOLECULE   = 'RECEIVE_MOLECULE';

export const SELECT_MOLECULE = 'SELECT_MOLECULE';

export const initialState = {
    molecules: [],
    byId: {},
  };


// Reducer
const reducer = handleActions({
  RECEIVE_MOLECULES: (state, action) => {
    const molecules = action.payload.molecules;
    return Object.assign({}, state, { molecules });
  },
  RECEIVE_MOLECULE: (state, action) => {
    const molecule = action.payload.molecule;
    const byId = Object.assign({}, state.byId, { [molecule._id]: molecule })
    return Object.assign({}, state, { byId });
  }
}, initialState);

// Action Creators

// Fetch molecules
export const loadMolecules = createAction(LOAD_MOLECULES);

export const requestMolecules = createAction(REQUEST_MOLECULES);

export const receiveMolecules = createAction(RECEIVE_MOLECULES, (molecules) => ({ molecules }));


// Fetch molecule
export const loadMolecule = createAction(LOAD_MOLECULE, (inchikey) => ({ inchikey }));

export const requestMolecule = createAction(REQUEST_MOLECULE, (inchikey) => ({ inchikey }));

export const receiveMolecule = createAction(RECEIVE_MOLECULE, (molecule) => ({ molecule }));

export default reducer;

