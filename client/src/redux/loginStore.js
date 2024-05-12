import { initStore } from './store';

const configureLoginStore = () => {
    const actions = {
        LOGIN: (state) => ({login: true }),
        LOOFF: (state) => ({login: false }),
    };

    initStore(actions, { login: false });
};

export default configureLoginStore;