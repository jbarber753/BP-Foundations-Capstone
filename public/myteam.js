const loginButton = document.getElementById(`login-nav`);
const logoutButton = document.getElementById(`logout-nav`);
const teamButton = document.getElementById(`team-nav`);

const baseURL = `http://localhost:4000`;

const checkAuth = () => {
    axios.get(`${baseURL}/auth`)
    .then(res => {
        if (!res.data){
            loginButton.style.display = `inline`;
            logoutButton.style.display = `none`;
            teamButton.style.display = `none`;
        }
        else{
            loginButton.style.display = `none`;
            logoutButton.style.display = `inline`;
            teamButton.style.display = `inline`;
            teamButton.textContent = `${res.data}'s Team`
        }
    })
}

checkAuth();