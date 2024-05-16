import { LOGIN, LOOFF } from '../actions/auth';

const initialState = {login: false };

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        login: action.status
      };
      case LOOFF:
        return {
          ...state,
          login: action.status
        };
    default:
      return state;
  }
};

export default authReducer;
