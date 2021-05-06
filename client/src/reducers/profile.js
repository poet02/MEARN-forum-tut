import {GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE} from "../actions/types";

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {}, 
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch(type) {
    case GET_PROFILE:
      console.log('instate', payload);
      return {
        ...state,
        profile: payload,
        loading: false
      }
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      }
    case CLEAR_PROFILE:
      return {
        ...state,
        error: payload,
        profile: null,
        repos: [],
        loading: false
      }
    default: 
    return state;
  }
};
