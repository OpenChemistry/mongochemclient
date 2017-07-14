export const getTaskFlowStatus = (state, _id) => _id in state.cumulus.taskflows.statusById ?  state.cumulus.taskflows.statusById[_id] : null

