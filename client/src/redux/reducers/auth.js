import { LOGIN, LOOFF } from '../actions/auth';

const initialState = {
  login: localStorage.getItem('isLoggedIn') === 'true'
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      localStorage.setItem('isLoggedIn', action.status);
      return {
        ...state,
        login: action.status
      };
      case LOOFF:
        localStorage.removeItem('isLoggedIn');
        return {
          ...state,
          login: action.status
        };
    default:
      return state;
  }
};

export default authReducer;
