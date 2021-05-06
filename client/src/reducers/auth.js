import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state, //what is currently in state
        isAuthenticated: true,
        loading: false,
        user: payload,
      };

    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      console.log("success login");

      localStorage.setItem("token", payload.token);
      return {
        ...state, //what is currently in state
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case AUTH_ERROR:
    case LOGOUT:
    case LOGIN_FAIL:
    case REGISTER_FAIL:
      // if (localStorage.getItem("token") !== null) {
      localStorage.removeItem("token");
      // }
      return {
        ...state, //what is currently in state
        isAuthenticated: false,
        loading: false,
        token: null,
      };

    default:
      return state;
  }
}
