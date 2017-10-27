import { Enum } from 'enumify';
import { CalculationState } from '../../utils/constants'
import _ from 'lodash'

export const getTaskFlow = (state, _id) => _id in state.cumulus.taskflows.byId ?  state.cumulus.taskflows.byId[_id] : null;

export const getTaskFlowStatus = (state, _id) => {
  const taskflow = getTaskFlow(state, _id);
  if (taskflow) {
    return taskflow.status;
  }

  return null;
}

export const getJob = (state, _id) => _id in state.cumulus.jobs.byId ?  state.cumulus.jobs.byId[_id] : null;

export const getTaskFlowJobIds = (state, _id) => _id in state.cumulus.taskflows.idToJobIds ? state.cumulus.taskflows.idToJobIds[_id] : null;

class TaskFlowState  extends Enum {}
TaskFlowState.initEnum(['created', 'running', 'error',
                        'unexpectederror', 'terminating', 'terminated',
                        'deleting', 'deleted', 'complete']);

class JobState extends Enum {}
JobState.initEnum(['created', 'running', 'terminated', 'terminating',
                   'unexpectederror', 'queued', 'error', 'complete']);

export const getCalculationStatus = (state, taskFlowId) => {

  const taskFlow = getTaskFlow(state, taskFlowId);
  if (!taskFlow) {
    return null;
  }

  // TaskFlow is 'running'
  if (taskFlow.status === TaskFlowState.running.name) {
    const jobIds = getTaskFlowJobIds(state, taskFlowId);
    if (!jobIds) {
      return CalculationState.initializing.name;
    }
    else {
      // For now we should only have one.
      const jobId = jobIds[0];
      const job = getJob(state, jobId);
      if (job.status === JobState.created.name) {
        return CalculationState.initializing.name;
      }
      else if (job.status !== JobState.complete.name) {
        return job.status;
      }
      else {
        return CalculationState.uploading.name;
      }
    }
  }
  else {
    return taskFlow.status;
  }
}

export const getCalculationCode = (state, taskFlowId) => {

  const taskFlow = getTaskFlow(state, taskFlowId);
  if (!taskFlow) {
    return null;
  }

  if (_.hasIn(taskFlow, 'meta.code')) {
    return taskFlow['meta']['code']
  }

  return null;
}

export const getCalculationType = (state, taskFlowId) => {

  const taskFlow = getTaskFlow(state, taskFlowId);
  if (!taskFlow) {
    return null;
  }

  if (_.hasIn(taskFlow, 'meta.type')) {
    return taskFlow['meta']['type']
  }

  return null;
}
