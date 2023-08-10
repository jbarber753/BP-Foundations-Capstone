const loginSwitch = document.getElementById(`login-switch`);
const registerSwitch = document.getElementById(`register-switch`);
const loginForm = document.getElementById(`login-form`);
const registerForm = document.getElementById(`register-form`);

const register = body => {
    axios.post(`/register`, body)
    .then(res => {
        window.location.href = `./index.html`
    })
    .catch(error => alert(error.response.data))
}

const login = body => {
    axios.post(`/login`, body)
    .then(res => {
        window.location.href = `./index.html`;
    })
    .catch(error => alert(error.response.data))
}

const handleRegister = event => {
    event.preventDefault();
    let email = document.getElementById(`email`);
    let username = document.getElementById(`new-username`);
    let password = document.getElementById(`new-password`);
    let confirmPassword = document.getElementById(`confirm-password`);
    let newUser = {
        email: email.value,
        username: username.value,
        password: password.value
    }
    if (password.value !== confirmPassword.value){
        alert(`Password and Confirm Password must match!`)
    }
    else if (!email.value.includes(`@`)){
       alert(`Must enter a valid email address!`)
    }
    else{
        register(newUser);
    }
    email.value = '';
    username.value = '';
    password.value = '';
    confirmPassword.value = '';
}

const handleLogin = event => {
    event.preventDefault();
    let username = document.getElementById(`username`);
    let password = document.getElementById(`password`);
    let user = {
        username: username.value,
        password: password.value
    }
    login(user);
    username.value = '';
    password.value = '';
}

const handleSwitch = event => {
    if (event.target.id === `register-switch`){
        registerForm.style.display = `flex`;
        loginForm.style.display = `none`;
    }
    else{
        registerForm.style.display = `none`;
        loginForm.style.display = `flex`;
    }
}

loginSwitch.addEventListener(`click`, handleSwitch);
registerSwitch.addEventListener(`click`, handleSwitch);
registerForm.addEventListener(`submit`, handleRegister);
loginForm.addEventListener(`submit`, handleLogin);