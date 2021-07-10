import { userService } from '../../helpers/authservice/user.service';
import router from '../../router/index'

const customer = JSON.parse(localStorage.getItem('customer'));
export const state = customer
    ? { status: { loggeduser: true }, customer }
    : { status: {}, customer: null };

export const actions = {
    // Logs in the customer.
    // eslint-disable-next-line no-unused-vars
    login({ dispatch, commit }, { email, password }) {
        commit('loginRequest', { email });

        userService.login(email, password)
            .then(
                customer => {
                    commit('loginSuccess', customer);
                    router.push('/');
                },
                error => {
                    commit('loginFailure', error);
                    dispatch('notification/error', error, { root: true });
                }
            );
    },
    loginWithThirdParty({ dispatch, commit }, { payload }) {
        // commit('loginRequest', { email });

        userService.loginWithThirdParty(payload)
            .then(
                customer => {
                    commit('loginSuccess', customer);
                    router.push('/');
                },
                error => {
                    commit('loginFailure', error);
                    dispatch('notification/error', error, { root: true });
                }
            );
    },
    // Logout the customer
    logout({ commit }) {
        userService.logout();
        commit('logout');
    },
    // register the customer
    registeruser({ dispatch, commit }, customer) {
        commit('registerRequest', customer);
        userService.register(customer)
            .then(
                customer => {
                    commit('registerSuccess', customer);
                    dispatch('notification/success', 'Registration successful', { root: true });

                    router.push('/login');

                },
                error => {
                    commit('registerFailure', error);
                    dispatch('notification/error', error, { root: true });
                }
            );
    }
};

export const mutations = {
    loginRequest(state, customer) {
        state.status = { loggingIn: true };
        state.customer = customer;
    },
    loginSuccess(state, customer) {
        state.status = { loggeduser: true };
        state.customer = customer;
    },
    loginFailure(state) {
        state.status = {};
        state.customer = null;
    },
    logout(state) {
        state.status = {};
        state.customer = null;
    },
    registerRequest(state) {
        state.status = { registering: true };
    },
    registerSuccess(state) {
        state.status = {};
    },
    registerFailure(state) {
        state.status = {};
    }
};

