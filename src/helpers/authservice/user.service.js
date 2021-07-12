import { authHeader } from './auth-header';
import { createJWTToken } from '../common';
import { parseAndVerifyJWTToken } from '../common';
import axios from "axios";

export const userService = {
    login,
    loginWithThirdParty,
    logout,
    register,
    getAll,
};

var backendURL = process.env.VUE_APP_BACKEND_URL;

function login(email, password) {

    const data = {
        email: email,
        password: password
    }
    const headers = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    var jwtToken = createJWTToken(data);

    const payload = {
        creds: jwtToken,
    }

    return axios
        .post(`${backendURL}/api/auth/login`, payload, headers)
        .then(response => {
            var dataToken = response.data.token;
            var customer = parseAndVerifyJWTToken(dataToken);
            if (customer.token) {
                localStorage.setItem('customer', JSON.stringify(customer));
            }
        }).catch(handleAxiosError);
}

function loginWithThirdParty(payload) {


    const headers = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return axios
        .post(`${backendURL}/api/auth/login/third-party`, payload, headers)
        .then(response => {
            var dataToken = response.data.token;
            var customer = parseAndVerifyJWTToken(dataToken);
            if (customer.token) {
                localStorage.setItem('customer', JSON.stringify(customer));
            }
        }).catch(handleAxiosError);
}

function logout() {
    // remove customer from local storage to log user out
    var customer = getLoggedInCustomer();
    if (customer) {
        const headers = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        localStorage.removeItem('customer');

        axios
            .post(`${backendURL}/api/auth/logout/${customer.id}`, headers)
            .catch(error => {
                if (error.response) {
                    window.console.log(error.response.data);
                }
            })
    }
}


function register(customer) {

    const payload = {
        first_name: customer.firstname,
        last_name: customer.lastname,
        email: customer.email,
        password: customer.password,
        password_confirmation: customer.passwordConfirm,
    }
    const headers = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return axios
        .post(`${backendURL}/api/auth/signup`, payload, headers)
        .then(response => {
            alert(`Customer(${response.data.data.id}) signup successful`);
        }).catch(handleAxiosError);
}

export function handleAxiosError(error) {
    if (error.response) {
        var data = error.response.data;
        if (error.response.status === 401) {
            // auto logout if 401 response returned from api
            logout();
            location.reload(true);
        }
        const errorMsg = (data && data.message) || error.response.statusText;

        return Promise.reject(errorMsg);
    }
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`/users`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}

export function getLoggedInCustomer() {
    return JSON.parse(localStorage.getItem('customer'));
}
