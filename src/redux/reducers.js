import molecules  from './ducks/molecules';
import { combineReducers } from 'redux';
import app  from './ducks/app';


export default combineReducers({
  molecules,
  app,
});
