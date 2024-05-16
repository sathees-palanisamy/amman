export const LOGIN = 'LOGIN';
export const LOOFF = 'LOOFF';

export const loginFunc = inputState => {
    return { type: LOGIN, status: inputState };
};

export const logoffFunc = inputState => {
    return { type: LOOFF, status: inputState };
};