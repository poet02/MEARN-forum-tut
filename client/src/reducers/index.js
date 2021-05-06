import { combineReducers } from 'redux'; ///need to combine reducers
import alert from './alert'; ///need to combine reducers
import auth from './auth';
import profile from './profile';
//will soon have auth reducer
//this is basically for the redux dev tools
export default combineReducers({
    alert, auth, profile
});