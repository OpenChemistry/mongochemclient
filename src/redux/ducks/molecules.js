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
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case RECEIVE_MOLECULES: {
      const molecules = action.payload.molecules;
      return Object.assign({}, state, { molecules });
    }
    case RECEIVE_MOLECULE: {
      const molecule = action.payload.molecule;
      const byId = Object.assign({}, state.byId, { [molecule._id]: molecule })
      return Object.assign({}, state, { byId });
    }
    default: return state;
  }
}

// Action Creators

// Fetch molecules
export function loadMolecules() {
  return { type: LOAD_MOLECULES, };
}

export function requestMolecules() {
  return { type: REQUEST_MOLECULES };
}

export function receiveMolecules(molecules) {
  return {
      type: RECEIVE_MOLECULES,
      payload: {
          molecules
      }
  };
}

// Fetch molecule
export function loadMolecule(inchikey) {
  return {
    type: LOAD_MOLECULE,
    payload: {
      inchikey
    }
  };
}

export function requestMolecule(inchikey) {
  return {
    type: REQUEST_MOLECULE,
    payload: {
      inchikey
    }
  }
}

export function receiveMolecule(molecule) {
  return {
    type: RECEIVE_MOLECULE,
    payload: {
      molecule
    }
  };
}

// Select molecule
export function selectMolecule(_id) {
  return {
    type: SELECT_MOLECULE,
    payload: {
      _id
    }
  };
}


