import { select, put, call, all, takeEvery} from 'redux-saga/effects'
import _ from 'lodash'

import { file } from '../rest/girder'
import { LOAD_CALCULATION_NOTEBOOKS, requestCalculationNotebooks,
  receiveCalculationNotebooks } from '../redux/ducks/calculations';
import selectors from '../redux/selectors';

export function* loadCalculationNotebooks(action) {
  try {
    const { calculationId } = action.payload;
    yield put(requestCalculationNotebooks(calculationId));

    const calculations = yield select(selectors.calculations.getCalculationsById);
    const calculation = calculations[calculationId];
    const notebooks = calculation.notebooks;

    if (_.isNil(notebooks)) {
      put(receiveCalculationNotebooks(calculationId, []));
      return;
    }

    const calls = []
    for (const notebook of notebooks) {
      calls.push(call(file.get, notebook));
    }

    const files = yield all(calls);

    yield put(receiveCalculationNotebooks(calculationId, files));
  }
  catch(error) {
    yield put(requestCalculationNotebooks(error));
  }
}

export function* watchLoadCalculationNotebooks() {
  yield takeEvery(LOAD_CALCULATION_NOTEBOOKS, loadCalculationNotebooks);
}

