"use strict";

const apiBaseURL = ""

function getLoginData () {
    const loginJSON = window.localStorage.getItem("login-data");
    return JSON.parse(loginJSON) || {};
}


// You can use this function to see whether the current visitor is
// logged in. It returns either `true` or `false`.
function isLoggedIn () {
    const loginData = getLoginData();
    return Boolean(loginData.token);
}


// add function for login data
function login (loginData) {
    // POST /auth/login
    const options = { 
        method: "POST",
        headers: {
            // This header specifies the type of content we're sending.
           
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
    };

    return fetch(apiBaseURL + "/auth/login", options)
        .then(response => response.json())
        .then(loginData => {
            if (loginData.message === "Invalid username or password") {
                console.error(loginData)
                // add error notification
                return null
            }

            window.localStorage.setItem("login-data", JSON.stringify(loginData));
            window.location.assign("/posts");  // redirect

            return loginData;
        });
}


// This is the `logout()` function you will use for any logout button

function logout () {
    const loginData = getLoginData();

    // GET /auth/logout
    const options = { 
        method: "GET",
        headers: { 
            // This header is how we authenticate our user with the
           
            Authorization: `Bearer ${loginData.token}`,
        },
    };

    fetch(apiBaseURL + "/auth/logout", options)
        .then(response => response.json())
        .then(data => console.log(data))
        .finally(() => {
            // We're using `finally()` so that we will continue with the
        

            window.localStorage.removeItem("login-data");  // remove login data from LocalStorage
            window.location.assign("/");  // redirect back to landing page
        });
}

// Add event listener for the login/logout button
document.getElementById('login-btn').addEventListener('click', () => {
    if (isLoggedIn()) {
        logout();
    } else {
        // Display the login form
        document.getElementById('login-form').style.display = 'block';
    }
});

// Add event listener for the login form submit button
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const loginData = {
        username: document.getElementById('login-username').value,
        password: document.getElementById('login-password').value,
    };
    login(loginData);
});