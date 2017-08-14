import { createAction, handleActions } from 'redux-actions';

// Actions
export const LOAD_CALCULATION_BY_ID   = 'LOAD_CALCULATION_BY_ID';
export const REQUEST_CALCULATION_BY_ID = 'REQUEST_CALCULATION_BY_ID';
export const RECEIVE_CALCULATION   = 'RECEIVE_CALCULATION';

export const LOAD_ORBITAL   = 'LOAD_ORBITAL';
export const REQUEST_ORBITAL = 'REQUEST_ORBITAL';
export const RECEIVE_ORBITAL   = 'RECEIVE_ORBITAL';


export const initialState = {
    byId: {},
    orbitalsById: {},
    error: null,
  };

// Reducer
const reducer = handleActions({
  REQUEST_CALCULATION_BY_ID: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error:null };
    }
  },
  RECEIVE_CALCULATION: (state, action) => {
    const calculation = action.payload.calculation;
    const byId = {...state.byId, [calculation._id]: calculation };
    return {...state, byId};
  },
  REQUEST_ORBITAL: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error:null };
    }
  },
  RECEIVE_ORBITAL: (state, action) => {
    const id = action.payload.id;
    const mo = action.payload.mo;
    const orbital = action.payload.orbital;

    let orbitals = state.orbitalsById.id || {}
    orbitals = {...orbitals, [mo]: orbital};

    const orbitalsById = {...state.orbitalsById, [id]: orbitals };
    return {...state, orbitalsById};
  }
}, initialState);

// Action Creators

// Fetch calculation
export const loadCalculationById = createAction(LOAD_CALCULATION_BY_ID, (id) => ({ id }));

export const requestCalculationById = createAction(REQUEST_CALCULATION_BY_ID, (id) => ({ id }));

export const receiveCalculation = createAction(RECEIVE_CALCULATION, (calculation) => ({ calculation }));

//Fetch orbitals
export const loadOrbital = createAction(LOAD_ORBITAL, (id, mo) => ({ id, mo }));

export const requestOrbital = createAction(REQUEST_ORBITAL, (id, mo) => ({ id, mo }));

export const receiveOrbital = createAction(RECEIVE_ORBITAL, (id, mo, orbital) => ({ id, mo, orbital }));


export default reducer;

