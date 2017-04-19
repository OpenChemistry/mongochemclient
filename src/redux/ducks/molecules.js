// Actions
export const LOAD_MOLECULES   = 'LOAD_MOLECULES';
export const REQUEST_MOLECULES   = 'REQUEST_MOLECULES';
export const RECEIVE_MOLECULES   = 'RECEIVE_MOLECULES';

export const initialState = {
    molecules: [],
  };


// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case RECEIVE_MOLECULES: {
      const molecules = action.payload.molecules;
      return Object.assign({}, state, { molecules });
    }
    default: return state;
  }
}

// Action Creators
export function loadMolecules() {
  return { type: LOAD_MOLECULES };
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

