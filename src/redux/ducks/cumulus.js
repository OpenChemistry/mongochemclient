import { createAction, handleActions } from 'redux-actions';
var jp = require('jsonpath');

// Actions
export const LOAD_TASKFLOW = 'LOAD_TASKFLOW';
export const REQUEST_TASKFLOW = 'REQUEST_TASKFLOW';
export const RECIEVE_TASKFLOW = 'RECIEVE_TASKFLOW';
export const RECIEVE_TASKFLOW_STATUS = 'RECIEVE_TASKFLOW_STATUS';

export const LOAD_JOB = 'LOAD_JOB';
export const REQUEST_JOB = 'REQUEST_JOB';
export const RECIEVE_JOB = 'RECIEVE_JOB';
export const RECIEVE_JOB_STATUS = 'RECIEVE_JOB_STATUS';


export const initialState = {
  taskflows: {
    byId: {},
    // maps taskflow ids to job ids
    idToJobIds: {},
  },
  jobs: {
    byId: {},
  }
};

// Reducer
const reducer = handleActions({
  // TaskFlows
  REQUEST_TASKFLOW: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error:null };
    }
  },
  RECIEVE_TASKFLOW: (state, action) => {
    const payload = action.payload;
    const taskflow = payload.taskflow;
    let taskflows = state.taskflows;
    const byId = {...taskflows.byId, [taskflow._id]: taskflow };
    taskflows = {...taskflows, byId};

    return {...state, taskflows}
  },
  RECIEVE_TASKFLOW_STATUS: (state, action) => {
    const payload = action.payload;
    const _id = payload._id;
    const status = payload.status;
    let taskflow = state.taskflows.byId[_id];
    taskflow = {...taskflow, status}
    let taskflows = state.taskflows;
    const byId = {...taskflows.byId, [_id]: taskflow};
    taskflows = {...taskflows, byId};

    return {...state, taskflows}
  },
  // Jobs
  REQUEST_JOB: (state, action) => {
    if (action.error) {
      return {...state, error: action.payload.error};
    }
    else {
      return {...state,  error:null };
    }
  },
  RECIEVE_JOB: (state, action) => {
    const payload = action.payload;
    const job = payload.job;
    let jobs = state.jobs;
    const byId = {...jobs.byId, [job._id]: job };
    jobs = {...jobs, byId};

    // See if this job has a taskFlowId associated with it
    let taskFlowId = jp.query(job, '$.params.taskFlowId')
    let taskflows = state.taskflows
    if (taskFlowId.length === 1) {
      taskFlowId = taskFlowId[0];
      let idToJobIds = state.taskflows.idToJobIds;
      let taskFlowJobs = []
      if (taskFlowId in idToJobIds) {
        taskFlowJobs = idToJobIds[taskFlowId];
      }

      if (!taskFlowJobs.includes(job._id)) {
        taskFlowJobs = taskFlowJobs.slice();
        taskFlowJobs.push(job._id);
        idToJobIds = {...idToJobIds, [taskFlowId]: taskFlowJobs};
        taskflows = {...taskflows, idToJobIds};
      }
    }

    return {...state, jobs, taskflows}
  },
  RECIEVE_JOB_STATUS: (state, action) => {
    const payload = action.payload;
    const _id = payload._id;
    const status = payload.status;
    let job = state.jobs.byId[_id];
    job = {...job, status}
    let jobs = state.jobs;
    const byId = {...jobs.byId, [_id]: job};
    jobs = {...jobs, byId};

    return {...state, jobs}
  },
  throw: (state, action) => state
}, initialState);

// Action Creators

export const loadTaskFlow = createAction(LOAD_TASKFLOW);
export const requestTaskFlow = createAction(REQUEST_TASKFLOW);
export const receiveTaskFlow = createAction(RECIEVE_TASKFLOW);
export const receiveTaskFlowStatus = createAction(RECIEVE_TASKFLOW_STATUS);

export const loadJob = createAction(LOAD_JOB);
export const requestJob = createAction(REQUEST_JOB);
export const receiveJob = createAction(RECIEVE_JOB);
export const receiveJobStatus = createAction(RECIEVE_JOB_STATUS);

export default reducer;
