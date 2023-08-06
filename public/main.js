const button = document.getElementById(`button`);

const getStuff = () => {
    axios.get(`https://fakerapi.it/api/v1/custom?_quantity=10&player_name=name&player_stat=number&player_stat2=number`)
    .then(res => {
        console.log(res.data.data)
        let result = document.createElement(`p`);
        result.innerText = res.data.data;
        document.getElementById(`here`).appendChild(result);
    })
}

button.addEventListener(`click`, getStuff)