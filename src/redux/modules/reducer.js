import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-async-connect';
import firebase from './firebase';


// import firebase from './firebase';
import auth from './auth';
import {reducer as form} from 'redux-form';

export default combineReducers({
  routing: routeReducer,
  reduxAsyncConnect,
  auth,
  form,
  firebase
});
