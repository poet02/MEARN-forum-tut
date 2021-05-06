import { createStore, applyMiddleware} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

// Redux Thunk is middleware that allows you to return functions, rather than just actions, within Redux.
// This allows for delayed actions, including working with promises. ... Redux Thunk 
//allows us to dispatch those actions asynchronously and resolve each promise that gets returned

const initialState = {};

const middleware = [thunk];

const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
); 

export default store;