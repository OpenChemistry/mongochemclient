import { createAction, handleActions } from 'redux-actions';

// Actions
export const LOAD_TASKFLOW_STATUS = 'LOAD_TASKFLOW_STATUS';
export const REQUEST_TASKFLOW_STATUS = 'REQUEST_TASKFLOW_STATUS';
export const RECIEVE_TASKFLOW_STATUS = 'RECIEVE_TASKFLOW_STATUS';

export const initialState = {
  taskflows: {
    statusById: {},
  }
};

// Reducer
const reducer = handleActions({
  REQUEST_TASKFLOW_STATUS: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error:null };
    }
  },
  RECIEVE_TASKFLOW_STATUS: (state, action) => {
    const payload = action.payload;
    let taskflows = state.taskflows;
    const statusById = {...taskflows.statusById, [payload._id]: payload.status };
    taskflows = {...taskflows, statusById};

    return {...state, taskflows}
  },
  NEW_TASKFLOW: (state, action) => {
    const payload = action.payload;
    const _id = payload._id;

    // If we have already seen this taskflow do nothing
    if (_id in state.statusById) {
      return state;
    }

    let taskflows = state.taskflows;
    const statusById = {...taskflows.statusById, [payload._id]: 'created' };
    taskflows = {...taskflows, statusById};

    return {...state, taskflows}
  },
  throw: (state, action) => state
}, initialState);

// Action Creators

export const loadTaskFlowStatus = createAction(LOAD_TASKFLOW_STATUS);
export const requestTaskFlowStatus = createAction(REQUEST_TASKFLOW_STATUS);
export const receiveTaskFlowStatus = createAction(RECIEVE_TASKFLOW_STATUS);

export default reducer;
