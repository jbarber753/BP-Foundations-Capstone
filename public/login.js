const loginSwitch = document.getElementById(`login-switch`);
const registerSwitch = document.getElementById(`register-switch`);
const loginForm = document.getElementById(`login-form`);
const registerForm = document.getElementById(`register-form`);

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