//function that takes state and action
import { SET_ALERT, REMOVE_ALERT } from '../actions/types';
const initialState = [
    // { e.g of this state
    //     id:1,
    //     msg: 'Please login',
    //     alertType: 'success',
    // }
]
export default function(state = initialState, action) {
    const { type, payload } = action;
    switch(type) {
        case SET_ALERT:
            // call action and set set, state is immutable
            //include any other state 
            //that is why use spread opperator - copy that state
            //if we have an alert 
            return [...state, payload];
        case REMOVE_ALERT:
            return state.filter(x => x.id !== payload)
        default:
            return state;
       
    }
}