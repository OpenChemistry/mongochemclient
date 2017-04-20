import { createAction, handleAction } from 'redux-actions';

// Actions
export const SELECT_MOLECULE = 'SELECT_MOLECULE';

export const initialState = {
  selectedMoleculeId: null
};

// Reducer
const reducer = handleAction(SELECT_MOLECULE, {
  next: (state, action) => {
    const selectedMoleculeId = action.payload.id;
    return Object.assign({}, state, { selectedMoleculeId });
  },
  throw: (state, action) => state
}, initialState);

// Action Creators
export const selectMolecule = createAction(SELECT_MOLECULE, (id) => ({id}));

export default reducer;