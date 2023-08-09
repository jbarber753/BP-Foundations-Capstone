const qbTable = document.getElementById(`qb-table`);
const rbTable = document.getElementById(`rb-table`);
const wrTable = document.getElementById(`wr-table`);
const teTable = document.getElementById(`te-table`);
const kTable = document.getElementById(`k-table`);
const dropDown = document.getElementById(`position-select`);
const tableHeaders = document.getElementsByTagName(`th`);
const loginButton = document.getElementById(`login-nav`);
const logoutButton = document.getElementById(`logout-nav`);
const teamButton = document.getElementById(`team-nav`);
const qbHeaders = document.getElementById(`qb-headers`);
const rbHeaders = document.getElementById(`rb-headers`);
const wrHeaders = document.getElementById(`wr-headers`);
const teHeaders = document.getElementById(`te-headers`);
const kHeaders = document.getElementById(`k-headers`);

const baseURL = `http://localhost:4000`;

let renderAddButtons = false;

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
            teamButton.textContent = `${res.data.username}'s Team`;
            renderAddButtons = true;
        }
    })
}

const logout = () => {
    axios.get(`${baseURL}/logout`)
    .then(() => {
        location.reload();
    })
}

const renderTable = () => {
    switch (dropDown.value){
        case `qb`:
            qbTable.style.display = `table`;
            rbTable.style.display = `none`;
            wrTable.style.display = `none`;
            teTable.style.display = `none`;
            kTable.style.display = `none`;
            break;
        case `rb`:
            qbTable.style.display = `none`;
            rbTable.style.display = `table`;
            wrTable.style.display = `none`;
            teTable.style.display = `none`;
            kTable.style.display = `none`;
            break;
        case `wr`:
            qbTable.style.display = `none`;
            rbTable.style.display = `none`;
            wrTable.style.display = `table`;
            teTable.style.display = `none`;
            kTable.style.display = `none`;
            break;
        case `te`:
            qbTable.style.display = `none`;
            rbTable.style.display = `none`;
            wrTable.style.display = `none`;
            teTable.style.display = `table`;
            kTable.style.display = `none`;
            break;
        case `k`:
            qbTable.style.display = `none`;
            rbTable.style.display = `none`;
            wrTable.style.display = `none`;
            teTable.style.display = `none`;
            kTable.style.display = `table`;
            break;
    }
}

const displayQBs = (stat, sort) => {
    while(qbTable.rows.length > 1){
        qbTable.deleteRow(-1);
    }
    if (!stat && !sort){
        axios.get(`${baseURL}/quarterbacks`)
        .then(res => {
            if (renderAddButtons){
                if (qbHeaders.children[0].id !== `qb-button-column`){
                    let buttonColumn = document.createElement(`th`);
                    buttonColumn.id = `qb-button-column`;
                    qbHeaders.insertBefore(buttonColumn, qbHeaders.children[0])
                }
            }
            for (let i = 1; i < res.data.length; i++){
                let newRow = qbTable.insertRow();
                if (renderAddButtons){
                    let buttonCell = newRow.insertCell();
                    buttonCell.classList.add(`button-cell`);
                    let buttonCellContent = document.createElement(`button`);
                    buttonCellContent.textContent = `Add Player`;
                    buttonCellContent.classList.add(`qb-add-button`);
                    buttonCellContent.id = res.data[i].id;
                    buttonCell.appendChild(buttonCellContent);
                    buttonCellContent.addEventListener(`click`, addPlayer);
                }
                let name = newRow.insertCell();
                name.classList.add(`name-cell`);
                let filler = newRow.insertCell();
                let team = newRow.insertCell();
                let passAttempts = newRow.insertCell();
                let completions = newRow.insertCell();
                let passingYards = newRow.insertCell();
                let passingTDs = newRow.insertCell();
                let interceptions = newRow.insertCell();
                let rushingAttempts = newRow.insertCell();
                let rushingYards = newRow.insertCell();
                let yardsPerCarry = newRow.insertCell();
                let rushingTDs = newRow.insertCell();
                let nameText = document.createTextNode(`${res.data[i].name}`);
                let teamText = document.createTextNode(`${res.data[i].team}`);
                let passAttemptsText = document.createTextNode(`${res.data[i].pass_attempts}`);
                let completionsText = document.createTextNode(`${res.data[i].completions}`);
                let passingYardsText = document.createTextNode(`${res.data[i].passing_yards}`);
                let passingTDsText = document.createTextNode(`${res.data[i].passing_tds}`);
                let interceptionsText = document.createTextNode(`${res.data[i].interceptions}`);
                let rushingAttemptsText = document.createTextNode(`${res.data[i].rushing_attempts}`);
                let rushingYardsText = document.createTextNode(`${res.data[i].rushing_yards}`);
                let yardsPerCarryText = document.createTextNode(`${res.data[i].yards_per_carry}`);
                let rushingTDsText = document.createTextNode(`${res.data[i].rushing_tds}`);
                name.appendChild(nameText);
                team.appendChild(teamText);
                passAttempts.appendChild(passAttemptsText);
                completions.appendChild(completionsText);
                passingYards.appendChild(passingYardsText);
                passingTDs.appendChild(passingTDsText);
                interceptions.appendChild(interceptionsText);
                rushingAttempts.appendChild(rushingAttemptsText);
                rushingYards.appendChild(rushingYardsText);
                yardsPerCarry.appendChild(yardsPerCarryText);
                rushingTDs.appendChild(rushingTDsText);
            }
        })
    }
    else{
        axios.get(`${baseURL}/quarterbacks?stat=${stat}&sort=${sort}`)
        .then(res => {
            if (renderAddButtons){
                if (qbHeaders.children[0].id !== `qb-button-column`){
                    let buttonColumn = document.createElement(`th`);
                    buttonColumn.id = `qb-button-column`;
                    qbHeaders.insertBefore(buttonColumn, qbHeaders.children[0])
                }
            }
            for (let i = 1; i < res.data.length; i++){
                let newRow = qbTable.insertRow();
                if (renderAddButtons){
                    let buttonCell = newRow.insertCell();
                    buttonCell.classList.add(`button-cell`);
                    let buttonCellContent = document.createElement(`button`);
                    buttonCellContent.textContent = `Add Player`;
                    buttonCellContent.classList.add(`qb-add-button`);
                    buttonCellContent.id = res.data[i].id;
                    buttonCell.appendChild(buttonCellContent);
                    buttonCellContent.addEventListener(`click`, addPlayer);
                }
                let name = newRow.insertCell();
                name.classList.add(`name-cell`);
                let filler = newRow.insertCell();
                let team = newRow.insertCell();
                let passAttempts = newRow.insertCell();
                let completions = newRow.insertCell();
                let passingYards = newRow.insertCell();
                let passingTDs = newRow.insertCell();
                let interceptions = newRow.insertCell();
                let rushingAttempts = newRow.insertCell();
                let rushingYards = newRow.insertCell();
                let yardsPerCarry = newRow.insertCell();
                let rushingTDs = newRow.insertCell();
                let nameText = document.createTextNode(`${res.data[i].name}`);
                let teamText = document.createTextNode(`${res.data[i].team}`);
                let passAttemptsText = document.createTextNode(`${res.data[i].pass_attempts}`);
                let completionsText = document.createTextNode(`${res.data[i].completions}`);
                let passingYardsText = document.createTextNode(`${res.data[i].passing_yards}`);
                let passingTDsText = document.createTextNode(`${res.data[i].passing_tds}`);
                let interceptionsText = document.createTextNode(`${res.data[i].interceptions}`);
                let rushingAttemptsText = document.createTextNode(`${res.data[i].rushing_attempts}`);
                let rushingYardsText = document.createTextNode(`${res.data[i].rushing_yards}`);
                let yardsPerCarryText = document.createTextNode(`${res.data[i].yards_per_carry}`);
                let rushingTDsText = document.createTextNode(`${res.data[i].rushing_tds}`);
                name.appendChild(nameText);
                team.appendChild(teamText);
                passAttempts.appendChild(passAttemptsText);
                completions.appendChild(completionsText);
                passingYards.appendChild(passingYardsText);
                passingTDs.appendChild(passingTDsText);
                interceptions.appendChild(interceptionsText);
                rushingAttempts.appendChild(rushingAttemptsText);
                rushingYards.appendChild(rushingYardsText);
                yardsPerCarry.appendChild(yardsPerCarryText);
                rushingTDs.appendChild(rushingTDsText);
            }
        })
    }
}

const displayRBs = (stat, sort) => {
    while(rbTable.rows.length > 1){
        rbTable.deleteRow(-1);
    }
    if (!stat && !sort){
        axios.get(`${baseURL}/runningbacks`)
        .then(res => {
            if (renderAddButtons){
                if (rbHeaders.children[0].id !== `rb-button-column`){
                    let buttonColumn = document.createElement(`th`);
                    buttonColumn.id = `rb-button-column`;
                    rbHeaders.insertBefore(buttonColumn, rbHeaders.children[0])
                }
            }
            for (let i = 1; i < res.data.length; i++){
                let newRow = rbTable.insertRow();
                if (renderAddButtons){
                    let buttonCell = newRow.insertCell();
                    buttonCell.classList.add(`button-cell`);
                    let buttonCellContent = document.createElement(`button`);
                    buttonCellContent.textContent = `Add Player`;
                    buttonCellContent.classList.add(`rb-add-button`);
                    buttonCellContent.id = res.data[i].id;
                    buttonCell.appendChild(buttonCellContent);
                    buttonCellContent.addEventListener(`click`, addPlayer);
                }
                let name = newRow.insertCell();
                name.classList.add(`name-cell`);
                let filler = newRow.insertCell();
                let team = newRow.insertCell();
                let rushingAttempts = newRow.insertCell();
                let rushingYards = newRow.insertCell();
                let yardsPerCarry = newRow.insertCell();
                let receivingTargets = newRow.insertCell();
                let receptions = newRow.insertCell();
                let receivingYards = newRow.insertCell();
                let yardsPerReception = newRow.insertCell();
                let touchdowns = newRow.insertCell();
                let nameText = document.createTextNode(`${res.data[i].name}`);
                let teamText = document.createTextNode(`${res.data[i].team}`);
                let rushingAttemptsText = document.createTextNode(`${res.data[i].rushing_attempts}`);
                let rushingYardsText = document.createTextNode(`${res.data[i].rushing_yards}`);
                let yardsPerCarryText = document.createTextNode(`${res.data[i].yards_per_carry}`);
                let receivingTargetsText = document.createTextNode(`${res.data[i].receiving_targets}`);
                let receptionsText = document.createTextNode(`${res.data[i].receptions}`);
                let receivingYardsText = document.createTextNode(`${res.data[i].receiving_yards}`);
                let yardsPerReceptionText = document.createTextNode(`${res.data[i].yards_per_reception}`);
                let touchdownsText = document.createTextNode(`${res.data[i].touchdowns}`);
                name.appendChild(nameText);
                team.appendChild(teamText);
                rushingAttempts.appendChild(rushingAttemptsText);
                rushingYards.appendChild(rushingYardsText);
                yardsPerCarry.appendChild(yardsPerCarryText);
                receivingTargets.appendChild(receivingTargetsText);
                receptions.appendChild(receptionsText);
                receivingYards.appendChild(receivingYardsText);
                yardsPerReception.appendChild(yardsPerReceptionText);
                touchdowns.appendChild(touchdownsText);
            }
        })
    }
    else{
        axios.get(`${baseURL}/runningbacks?stat=${stat}&sort=${sort}`)
        .then(res => {
            if (renderAddButtons){
                if (rbHeaders.children[0].id !== `rb-button-column`){
                    let buttonColumn = document.createElement(`th`);
                    buttonColumn.id = `rb-button-column`;
                    rbHeaders.insertBefore(buttonColumn, rbHeaders.children[0])
                }
            }
            for (let i = 1; i < res.data.length; i++){
                let newRow = rbTable.insertRow();
                if (renderAddButtons){
                    let buttonCell = newRow.insertCell();
                    buttonCell.classList.add(`button-cell`);
                    let buttonCellContent = document.createElement(`button`);
                    buttonCellContent.textContent = `Add Player`;
                    buttonCellContent.classList.add(`rb-add-button`);
                    buttonCellContent.id = res.data[i].id;
                    buttonCell.appendChild(buttonCellContent);
                    buttonCellContent.addEventListener(`click`, addPlayer);
                }
                let name = newRow.insertCell();
                name.classList.add(`name-cell`);
                let filler = newRow.insertCell();
                let team = newRow.insertCell();
                let rushingAttempts = newRow.insertCell();
                let rushingYards = newRow.insertCell();
                let yardsPerCarry = newRow.insertCell();
                let receivingTargets = newRow.insertCell();
                let receptions = newRow.insertCell();
                let receivingYards = newRow.insertCell();
                let yardsPerReception = newRow.insertCell();
                let touchdowns = newRow.insertCell();
                let nameText = document.createTextNode(`${res.data[i].name}`);
                let teamText = document.createTextNode(`${res.data[i].team}`);
                let rushingAttemptsText = document.createTextNode(`${res.data[i].rushing_attempts}`);
                let rushingYardsText = document.createTextNode(`${res.data[i].rushing_yards}`);
                let yardsPerCarryText = document.createTextNode(`${res.data[i].yards_per_carry}`);
                let receivingTargetsText = document.createTextNode(`${res.data[i].receiving_targets}`);
                let receptionsText = document.createTextNode(`${res.data[i].receptions}`);
                let receivingYardsText = document.createTextNode(`${res.data[i].receiving_yards}`);
                let yardsPerReceptionText = document.createTextNode(`${res.data[i].yards_per_reception}`);
                let touchdownsText = document.createTextNode(`${res.data[i].touchdowns}`);
                name.appendChild(nameText);
                team.appendChild(teamText);
                rushingAttempts.appendChild(rushingAttemptsText);
                rushingYards.appendChild(rushingYardsText);
                yardsPerCarry.appendChild(yardsPerCarryText);
                receivingTargets.appendChild(receivingTargetsText);
                receptions.appendChild(receptionsText);
                receivingYards.appendChild(receivingYardsText);
                yardsPerReception.appendChild(yardsPerReceptionText);
                touchdowns.appendChild(touchdownsText);
            }
        })
    }
}

const displayWRs = (stat, sort) => {
    while(wrTable.rows.length > 1){
        wrTable.deleteRow(-1);
    }
    if(!stat && !sort){
        axios.get(`${baseURL}/widereceivers`)
        .then(res => {
            if (renderAddButtons){
                if (wrHeaders.children[0].id !== `wr-button-column`){
                    let buttonColumn = document.createElement(`th`);
                    buttonColumn.id = `wr-button-column`;
                    wrHeaders.insertBefore(buttonColumn, wrHeaders.children[0])
                }
            }
            for (let i = 1; i < res.data.length; i++){
                let newRow = wrTable.insertRow();
                if (renderAddButtons){
                    let buttonCell = newRow.insertCell();
                    buttonCell.classList.add(`button-cell`);
                    let buttonCellContent = document.createElement(`button`);
                    buttonCellContent.textContent = `Add Player`;
                    buttonCellContent.classList.add(`wr-add-button`);
                    buttonCellContent.id = res.data[i].id;
                    buttonCell.appendChild(buttonCellContent);
                    buttonCellContent.addEventListener(`click`, addPlayer);
                }
                let name = newRow.insertCell();
                name.classList.add(`name-cell`);
                let filler = newRow.insertCell();
                let team = newRow.insertCell();
                let receivingTargets = newRow.insertCell();
                let receptions = newRow.insertCell();
                let receivingYards = newRow.insertCell();
                let yardsPerReception = newRow.insertCell();
                let rushingAttempts = newRow.insertCell();
                let rushingYards = newRow.insertCell();
                let yardsPerCarry = newRow.insertCell();
                let touchdowns = newRow.insertCell();
                let nameText = document.createTextNode(`${res.data[i].name}`);
                let teamText = document.createTextNode(`${res.data[i].team}`);
                let receivingTargetsText = document.createTextNode(`${res.data[i].receiving_targets}`);
                let receptionsText = document.createTextNode(`${res.data[i].receptions}`);
                let receivingYardsText = document.createTextNode(`${res.data[i].receiving_yards}`);
                let yardsPerReceptionText = document.createTextNode(`${res.data[i].yards_per_reception}`);
                let rushingAttemptsText = document.createTextNode(`${res.data[i].rushing_attempts}`);
                let rushingYardsText = document.createTextNode(`${res.data[i].rushing_yards}`);
                let yardsPerCarryText = document.createTextNode(`${res.data[i].yards_per_carry}`);
                let touchdownsText = document.createTextNode(`${res.data[i].touchdowns}`);
                name.appendChild(nameText);
                team.appendChild(teamText);
                receivingTargets.appendChild(receivingTargetsText);
                receptions.appendChild(receptionsText);
                receivingYards.appendChild(receivingYardsText);
                yardsPerReception.appendChild(yardsPerReceptionText);
                rushingAttempts.appendChild(rushingAttemptsText);
                rushingYards.appendChild(rushingYardsText);
                yardsPerCarry.appendChild(yardsPerCarryText);
                touchdowns.appendChild(touchdownsText);
            }
        })
    }
    else{
        axios.get(`${baseURL}/widereceivers?stat=${stat}&sort=${sort}`)
        .then(res => {
            if (renderAddButtons){
                if (wrHeaders.children[0].id !== `wr-button-column`){
                    let buttonColumn = document.createElement(`th`);
                    buttonColumn.id = `wr-button-column`;
                    rbHeaders.insertBefore(buttonColumn, wrHeaders.children[0])
                }
            }
            for (let i = 1; i < res.data.length; i++){
                let newRow = wrTable.insertRow();
                if (renderAddButtons){
                    let buttonCell = newRow.insertCell();
                    buttonCell.classList.add(`button-cell`);
                    let buttonCellContent = document.createElement(`button`);
                    buttonCellContent.textContent = `Add Player`;
                    buttonCellContent.classList.add(`wr-add-button`);
                    buttonCellContent.id = res.data[i].id;
                    buttonCell.appendChild(buttonCellContent);
                    buttonCellContent.addEventListener(`click`, addPlayer);
                }
                let name = newRow.insertCell();
                name.classList.add(`name-cell`);
                let filler = newRow.insertCell();
                let team = newRow.insertCell();
                let receivingTargets = newRow.insertCell();
                let receptions = newRow.insertCell();
                let receivingYards = newRow.insertCell();
                let yardsPerReception = newRow.insertCell();
                let rushingAttempts = newRow.insertCell();
                let rushingYards = newRow.insertCell();
                let yardsPerCarry = newRow.insertCell();
                let touchdowns = newRow.insertCell();
                let nameText = document.createTextNode(`${res.data[i].name}`);
                let teamText = document.createTextNode(`${res.data[i].team}`);
                let receivingTargetsText = document.createTextNode(`${res.data[i].receiving_targets}`);
                let receptionsText = document.createTextNode(`${res.data[i].receptions}`);
                let receivingYardsText = document.createTextNode(`${res.data[i].receiving_yards}`);
                let yardsPerReceptionText = document.createTextNode(`${res.data[i].yards_per_reception}`);
                let rushingAttemptsText = document.createTextNode(`${res.data[i].rushing_attempts}`);
                let rushingYardsText = document.createTextNode(`${res.data[i].rushing_yards}`);
                let yardsPerCarryText = document.createTextNode(`${res.data[i].yards_per_carry}`);
                let touchdownsText = document.createTextNode(`${res.data[i].touchdowns}`);
                name.appendChild(nameText);
                team.appendChild(teamText);
                receivingTargets.appendChild(receivingTargetsText);
                receptions.appendChild(receptionsText);
                receivingYards.appendChild(receivingYardsText);
                yardsPerReception.appendChild(yardsPerReceptionText);
                rushingAttempts.appendChild(rushingAttemptsText);
                rushingYards.appendChild(rushingYardsText);
                yardsPerCarry.appendChild(yardsPerCarryText);
                touchdowns.appendChild(touchdownsText);
            }
        })
    }
}

const displayTEs = (stat, sort) => {
    while(teTable.rows.length > 1){
        teTable.deleteRow(-1);
    }
    if (!stat && !sort){
        axios.get(`${baseURL}/tightends`)
        .then(res => {
            if (renderAddButtons){
                if (teHeaders.children[0].id !== `te-button-column`){
                    let buttonColumn = document.createElement(`th`);
                    buttonColumn.id = `te-button-column`;
                    teHeaders.insertBefore(buttonColumn, teHeaders.children[0])
                }
            }
            for (let i = 1; i < res.data.length; i++){
                let newRow = teTable.insertRow();
                if (renderAddButtons){
                    let buttonCell = newRow.insertCell();
                    buttonCell.classList.add(`button-cell`);
                    let buttonCellContent = document.createElement(`button`);
                    buttonCellContent.textContent = `Add Player`;
                    buttonCellContent.classList.add(`te-add-button`);
                    buttonCellContent.id = res.data[i].id;
                    buttonCell.appendChild(buttonCellContent);
                    buttonCellContent.addEventListener(`click`, addPlayer);
                }
                let name = newRow.insertCell();
                name.classList.add(`name-cell`);
                let filler = newRow.insertCell();
                let team = newRow.insertCell();
                let receivingTargets = newRow.insertCell();
                let receptions = newRow.insertCell();
                let receivingYards = newRow.insertCell();
                let yardsPerReception = newRow.insertCell();
                let rushingAttempts = newRow.insertCell();
                let rushingYards = newRow.insertCell();
                let yardsPerCarry = newRow.insertCell();
                let touchdowns = newRow.insertCell();
                let nameText = document.createTextNode(`${res.data[i].name}`);
                let teamText = document.createTextNode(`${res.data[i].team}`);
                let receivingTargetsText = document.createTextNode(`${res.data[i].receiving_targets}`);
                let receptionsText = document.createTextNode(`${res.data[i].receptions}`);
                let receivingYardsText = document.createTextNode(`${res.data[i].receiving_yards}`);
                let yardsPerReceptionText = document.createTextNode(`${res.data[i].yards_per_reception}`);
                let rushingAttemptsText = document.createTextNode(`${res.data[i].rushing_attempts}`);
                let rushingYardsText = document.createTextNode(`${res.data[i].rushing_yards}`);
                let yardsPerCarryText = document.createTextNode(`${res.data[i].yards_per_carry}`);
                let touchdownsText = document.createTextNode(`${res.data[i].touchdowns}`);
                name.appendChild(nameText);
                team.appendChild(teamText);
                receivingTargets.appendChild(receivingTargetsText);
                receptions.appendChild(receptionsText);
                receivingYards.appendChild(receivingYardsText);
                yardsPerReception.appendChild(yardsPerReceptionText);
                rushingAttempts.appendChild(rushingAttemptsText);
                rushingYards.appendChild(rushingYardsText);
                yardsPerCarry.appendChild(yardsPerCarryText);
                touchdowns.appendChild(touchdownsText);
            }
        })
    }
    else{
        axios.get(`${baseURL}/tightends?stat=${stat}&sort=${sort}`)
        .then(res => {
            if (renderAddButtons){
                if (teHeaders.children[0].id !== `te-button-column`){
                    let buttonColumn = document.createElement(`th`);
                    buttonColumn.id = `te-button-column`;
                    teHeaders.insertBefore(buttonColumn, teHeaders.children[0])
                }
            }
            for (let i = 1; i < res.data.length; i++){
                let newRow = teTable.insertRow();
                if (renderAddButtons){
                    let buttonCell = newRow.insertCell();
                    buttonCell.classList.add(`button-cell`);
                    let buttonCellContent = document.createElement(`button`);
                    buttonCellContent.textContent = `Add Player`;
                    buttonCellContent.classList.add(`te-add-button`);
                    buttonCellContent.id = res.data[i].id;
                    buttonCell.appendChild(buttonCellContent);
                    buttonCellContent.addEventListener(`click`, addPlayer);
                }
                let name = newRow.insertCell();
                name.classList.add(`name-cell`);
                let filler = newRow.insertCell();
                let team = newRow.insertCell();
                let receivingTargets = newRow.insertCell();
                let receptions = newRow.insertCell();
                let receivingYards = newRow.insertCell();
                let yardsPerReception = newRow.insertCell();
                let rushingAttempts = newRow.insertCell();
                let rushingYards = newRow.insertCell();
                let yardsPerCarry = newRow.insertCell();
                let touchdowns = newRow.insertCell();
                let nameText = document.createTextNode(`${res.data[i].name}`);
                let teamText = document.createTextNode(`${res.data[i].team}`);
                let receivingTargetsText = document.createTextNode(`${res.data[i].receiving_targets}`);
                let receptionsText = document.createTextNode(`${res.data[i].receptions}`);
                let receivingYardsText = document.createTextNode(`${res.data[i].receiving_yards}`);
                let yardsPerReceptionText = document.createTextNode(`${res.data[i].yards_per_reception}`);
                let rushingAttemptsText = document.createTextNode(`${res.data[i].rushing_attempts}`);
                let rushingYardsText = document.createTextNode(`${res.data[i].rushing_yards}`);
                let yardsPerCarryText = document.createTextNode(`${res.data[i].yards_per_carry}`);
                let touchdownsText = document.createTextNode(`${res.data[i].touchdowns}`);
                name.appendChild(nameText);
                team.appendChild(teamText);
                receivingTargets.appendChild(receivingTargetsText);
                receptions.appendChild(receptionsText);
                receivingYards.appendChild(receivingYardsText);
                yardsPerReception.appendChild(yardsPerReceptionText);
                rushingAttempts.appendChild(rushingAttemptsText);
                rushingYards.appendChild(rushingYardsText);
                yardsPerCarry.appendChild(yardsPerCarryText);
                touchdowns.appendChild(touchdownsText);
            }
        })
    }
}

const displayKs = (stat, sort) => {
    while(kTable.rows.length > 1){
        kTable.deleteRow(-1);
    }
    if (!stat && !sort){
        axios.get(`${baseURL}/kickers`)
        .then(res => {
            if (renderAddButtons){
                if (kHeaders.children[0].id !== `k-button-column`){
                    let buttonColumn = document.createElement(`th`);
                    buttonColumn.id = `k-button-column`;
                    kHeaders.insertBefore(buttonColumn, kHeaders.children[0])
                }
            }
            for (let i = 1; i < res.data.length; i++){
                let newRow = kTable.insertRow();
                if (renderAddButtons){
                    let buttonCell = newRow.insertCell();
                    buttonCell.classList.add(`button-cell`);
                    let buttonCellContent = document.createElement(`button`);
                    buttonCellContent.textContent = `Add Player`;
                    buttonCellContent.classList.add(`k-add-button`);
                    buttonCellContent.id = res.data[i].id;
                    buttonCell.appendChild(buttonCellContent);
                    buttonCellContent.addEventListener(`click`, addPlayer);
                }
                let name = newRow.insertCell();
                name.classList.add(`name-cell`);
                let filler = newRow.insertCell();
                let team = newRow.insertCell();
                let xpAttempts = newRow.insertCell();
                let xpMade = newRow.insertCell();
                let fgAttempts = newRow.insertCell();
                let fgMade = newRow.insertCell();
                let nameText = document.createTextNode(`${res.data[i].name}`);
                let teamText = document.createTextNode(`${res.data[i].team}`);
                let xpAttemptsText = document.createTextNode(`${res.data[i].xp_attempts}`);
                let xpMadeText = document.createTextNode(`${res.data[i].xp_made}`);
                let fgAttemptsText = document.createTextNode(`${res.data[i].fg_attempts}`);
                let fgMadeText = document.createTextNode(`${res.data[i].fg_made}`);
                name.appendChild(nameText);
                team.appendChild(teamText);
                xpAttempts.appendChild(xpAttemptsText);
                xpMade.appendChild(xpMadeText);
                fgAttempts.appendChild(fgAttemptsText);
                fgMade.appendChild(fgMadeText);
            }
        })
    }
    else{
        axios.get(`${baseURL}/kickers?stat=${stat}&sort=${sort}`)
        .then(res => {
            if (renderAddButtons){
                if (kHeaders.children[0].id !== `k-button-column`){
                    let buttonColumn = document.createElement(`th`);
                    buttonColumn.id = `k-button-column`;
                    kHeaders.insertBefore(buttonColumn, kHeaders.children[0])
                }
            }
            for (let i = 1; i < res.data.length; i++){
                let newRow = kTable.insertRow();
                if (renderAddButtons){
                    let buttonCell = newRow.insertCell();
                    buttonCell.classList.add(`button-cell`);
                    let buttonCellContent = document.createElement(`button`);
                    buttonCellContent.textContent = `Add Player`;
                    buttonCellContent.classList.add(`k-add-button`);
                    buttonCellContent.id = res.data[i].id;
                    buttonCell.appendChild(buttonCellContent);
                    buttonCellContent.addEventListener(`click`, addPlayer);
                }
                let name = newRow.insertCell();
                name.classList.add(`name-cell`);
                let filler = newRow.insertCell();
                let team = newRow.insertCell();
                let xpAttempts = newRow.insertCell();
                let xpMade = newRow.insertCell();
                let fgAttempts = newRow.insertCell();
                let fgMade = newRow.insertCell();
                let nameText = document.createTextNode(`${res.data[i].name}`);
                let teamText = document.createTextNode(`${res.data[i].team}`);
                let xpAttemptsText = document.createTextNode(`${res.data[i].xp_attempts}`);
                let xpMadeText = document.createTextNode(`${res.data[i].xp_made}`);
                let fgAttemptsText = document.createTextNode(`${res.data[i].fg_attempts}`);
                let fgMadeText = document.createTextNode(`${res.data[i].fg_made}`);
                name.appendChild(nameText);
                team.appendChild(teamText);
                xpAttempts.appendChild(xpAttemptsText);
                xpMade.appendChild(xpMadeText);
                fgAttempts.appendChild(fgAttemptsText);
                fgMade.appendChild(fgMadeText);
            }
        })
    }
}

const handleSort = event => {
    let stat = event.currentTarget.id;
    if (event.currentTarget.className === `active`){
        if (event.currentTarget.children[0].children[1].textContent === `expand_more`){
            event.currentTarget.children[0].children[1].textContent = `expand_less`;
        }
        else{
            event.currentTarget.children[0].children[1].textContent = `expand_more`;
        }
    }
    for (let i = 0; i < tableHeaders.length; i++){
        tableHeaders[i].classList.replace(`active`, `inactive`);
        if (tableHeaders[i] !== event.currentTarget && tableHeaders[i].children[0] !== undefined){
            tableHeaders[i].classList.replace(`active`, `inactive`);
            tableHeaders[i].children[0].children[1].textContent = `expand_more`;
        }
    }
    event.currentTarget.classList.replace(`inactive`, `active`);
    switch (dropDown.value){
        case `qb`:
            if (event.currentTarget.children[0].children[1].textContent === `expand_more`){
                displayQBs(stat, `DESC`);
            }
            else{
                displayQBs(stat, `ASC`);
            }
            break;
        case `rb`:
            if (event.currentTarget.children[0].children[1].textContent === `expand_more`){
                displayRBs(stat, `DESC`);
            }
            else{
                displayRBs(stat, `ASC`);
            }
            break;
        case `wr`:
            if (event.currentTarget.children[0].children[1].textContent === `expand_more`){
                displayWRs(stat, `DESC`);
            }
            else{
                displayWRs(stat, `ASC`);
            }
            break;
        case `te`:
            if (event.currentTarget.children[0].children[1].textContent === `expand_more`){
                displayTEs(stat, `DESC`);
            }
            else{
                displayTEs(stat, `ASC`);
            }
            break;
        case `k`:
            if (event.currentTarget.children[0].children[1].textContent === `expand_more`){
                displayKs(stat, `DESC`);
            }
            else{
                displayKs(stat, `ASC`);
            }
            break;
    }
}

const addPlayer = event => {
    console.log(event.target.id)
    console.log(event.target.className)
    axios.get(`${baseURL}/auth`)
    .then(res => {
        if (event.target.className === `qb-add-button`){
            axios.put(`${baseURL}/quarterbacks?user=${res.data.userID}&player=${event.target.id}`)
            .then(res => alert(res.data))
        }
        else if (event.target.className === `rb-add-button`){
            axios.put(`${baseURL}/runningbacks?user=${res.data.userID}&player=${event.target.id}`)
            .then(res => alert(res.data))
        }
        else if (event.target.className === `wr-add-button`){
            axios.put(`${baseURL}/widereceivers?user=${res.data.userID}&player=${event.target.id}`)
            .then(res => alert(res.data))
        }
        else if (event.target.className === `te-add-button`){
            axios.put(`${baseURL}/tightends?user=${res.data.userID}&player=${event.target.id}`)
            .then(res => alert(res.data))
        }
        else if (event.target.className === `k-add-button`){
            axios.put(`${baseURL}/kickers?user=${res.data.userID}&player=${event.target.id}`)
            .then(res => alert(res.data))
        }
    })
}

checkAuth();
displayQBs();
displayRBs();
displayWRs();
displayTEs();
displayKs();

dropDown.addEventListener(`change`, renderTable);
for (let i = 0; i < tableHeaders.length; i ++){
    tableHeaders[i].addEventListener(`click`, handleSort);
}
logoutButton.addEventListener(`click`, logout);