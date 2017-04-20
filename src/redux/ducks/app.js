// Actions
export const SELECT_MOLECULE = 'SELECT_MOLECULE';

export const initialState = {
    selectedMoleculeId: null
  };


// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SELECT_MOLECULE: {
      const selectedMoleculeId = action.payload.id;
      return Object.assign({}, state, { selectedMoleculeId });
    }
    default: return state;
  }
}

// Action Creators
export function selectMolecule(id) {
  return {
    type: SELECT_MOLECULE,
    payload: {
      id
    }
  };
}
