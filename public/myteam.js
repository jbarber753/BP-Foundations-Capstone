const logoutButton = document.getElementById(`logout-nav`);
const teamButton = document.getElementById(`team-nav`);
const tableHeaders = document.getElementsByTagName(`th`);
const qbTable = document.getElementById(`qb-table`);
const rbTable = document.getElementById(`rb-table`);
const wrTable = document.getElementById(`wr-table`);
const teTable = document.getElementById(`te-table`);
const kTable = document.getElementById(`k-table`);
const noQBs = document.getElementById(`no-qbs`);
const noRBs = document.getElementById(`no-rbs`);
const noWRs = document.getElementById(`no-wrs`);
const noTEs = document.getElementById(`no-tes`);
const noKs = document.getElementById(`no-ks`);

const baseURL = `http://localhost:4000`;

const checkAuth = () => {
    axios.get(`${baseURL}/auth`)
    .then(res => {
        if (!res.data){
            window.location.href = `./login.html`
        }
        else{
            teamButton.textContent = `${res.data.username}'s Team`;
            displayMyQBs();
            displayMyRBs();
            displayMyWRs();
            displayMyTEs();
            displayMyKs();
        }
    })
}

const logout = () => {
    axios.get(`${baseURL}/logout`)
    .then(() => {
        sessionStorage.clear();
        window.location.href = `./login.html`;
    })
}

displayMyQBs = (stat, sort) => {
    while(qbTable.rows.length > 1){
        qbTable.deleteRow(-1);
    }
    axios.get(`${baseURL}/auth`)
    .then(res1 => {
        if (!stat && !sort){
            axios.get(`${baseURL}/claimedqbs?user=${res1.data.userID}`)
            .then(res2 => {
                if (!res2.data.length){
                    qbTable.style.display = `none`;
                    noQBs.style.display = `inline`;
                }
                else{
                    qbTable.style.display = `table`;
                    noQBs.style.display = `none`;
                    for (let i = 0; i < res2.data.length; i++){
                        let newRow = qbTable.insertRow();
                        let buttonCell = newRow.insertCell();
                        buttonCell.classList.add(`button-cell`);
                        let buttonCellContent = document.createElement(`button`);
                        buttonCellContent.textContent = `Drop Player`;
                        buttonCellContent.classList.add(`qb-remove-button`);
                        buttonCellContent.id = res2.data[i].id;
                        buttonCell.appendChild(buttonCellContent);
                        buttonCellContent.addEventListener(`click`, dropPlayer);
                        let name = newRow.insertCell();
                        name.classList.add(`name-cell`);
                        let filler = newRow.insertCell();
                        let team = newRow.insertCell();
                        let passAttempts = newRow.insertCell();
                        let completions = newRow.insertCell();
                        let passingYards = newRow.insertCell();
                        let yardsPerCompletion = newRow.insertCell();
                        let passingTDs = newRow.insertCell();
                        let interceptions = newRow.insertCell();
                        let rushingAttempts = newRow.insertCell();
                        let rushingYards = newRow.insertCell();
                        let yardsPerCarry = newRow.insertCell();
                        let rushingTDs = newRow.insertCell();
                        let fantasyPoints = newRow.insertCell();
                        let nameText = document.createTextNode(`${res2.data[i].name}`);
                        let teamText = document.createTextNode(`${res2.data[i].team}`);
                        let passAttemptsText = document.createTextNode(`${res2.data[i].pass_attempts}`);
                        let completionsText = document.createTextNode(`${res2.data[i].completions}`);
                        let passingYardsText = document.createTextNode(`${res2.data[i].passing_yards}`);
                        let yardsPerCompletionText = document.createTextNode(`${res2.data[i].yards_per_completion}`);
                        let passingTDsText = document.createTextNode(`${res2.data[i].passing_tds}`);
                        let interceptionsText = document.createTextNode(`${res2.data[i].interceptions}`);
                        let rushingAttemptsText = document.createTextNode(`${res2.data[i].rushing_attempts}`);
                        let rushingYardsText = document.createTextNode(`${res2.data[i].rushing_yards}`);
                        let yardsPerCarryText = document.createTextNode(`${res2.data[i].yards_per_carry}`);
                        let rushingTDsText = document.createTextNode(`${res2.data[i].rushing_tds}`);
                        let fantasyPointsText = document.createTextNode(`${res2.data[i].fantasy_points}`);
                        name.appendChild(nameText);
                        team.appendChild(teamText);
                        passAttempts.appendChild(passAttemptsText);
                        completions.appendChild(completionsText);
                        passingYards.appendChild(passingYardsText);
                        yardsPerCompletion.appendChild(yardsPerCompletionText);
                        passingTDs.appendChild(passingTDsText);
                        interceptions.appendChild(interceptionsText);
                        rushingAttempts.appendChild(rushingAttemptsText);
                        rushingYards.appendChild(rushingYardsText);
                        yardsPerCarry.appendChild(yardsPerCarryText);
                        rushingTDs.appendChild(rushingTDsText);
                        fantasyPoints.appendChild(fantasyPointsText);
                    }
                }
            })
        }
        else{
            axios.get(`${baseURL}/claimedqbs?user=${res1.data.userID}&stat=${stat}&sort=${sort}`)
            .then(res2 => {
                if (!res2.data.length){
                    qbTable.style.display = `none`;
                    noQBs.style.display = `inline`;
                }
                else{
                    qbTable.style.display = `table`;
                    noQBs.style.display = `none`;
                    for (let i = 0; i < res2.data.length; i++){
                        let newRow = qbTable.insertRow();
                        let buttonCell = newRow.insertCell();
                        buttonCell.classList.add(`button-cell`);
                        let buttonCellContent = document.createElement(`button`);
                        buttonCellContent.textContent = `Drop Player`;
                        buttonCellContent.classList.add(`qb-remove-button`);
                        buttonCellContent.id = res2.data[i].id;
                        buttonCell.appendChild(buttonCellContent);
                        buttonCellContent.addEventListener(`click`, dropPlayer);
                        let name = newRow.insertCell();
                        name.classList.add(`name-cell`);
                        let filler = newRow.insertCell();
                        let team = newRow.insertCell();
                        let passAttempts = newRow.insertCell();
                        let completions = newRow.insertCell();
                        let passingYards = newRow.insertCell();
                        let yardsPerCompletion = newRow.insertCell();
                        let passingTDs = newRow.insertCell();
                        let interceptions = newRow.insertCell();
                        let rushingAttempts = newRow.insertCell();
                        let rushingYards = newRow.insertCell();
                        let yardsPerCarry = newRow.insertCell();
                        let rushingTDs = newRow.insertCell();
                        let fantasyPoints = newRow.insertCell();
                        let nameText = document.createTextNode(`${res2.data[i].name}`);
                        let teamText = document.createTextNode(`${res2.data[i].team}`);
                        let passAttemptsText = document.createTextNode(`${res2.data[i].pass_attempts}`);
                        let completionsText = document.createTextNode(`${res2.data[i].completions}`);
                        let passingYardsText = document.createTextNode(`${res2.data[i].passing_yards}`);
                        let yardsPerCompletionText = document.createTextNode(`${res2.data[i].yards_per_completion}`);
                        let passingTDsText = document.createTextNode(`${res2.data[i].passing_tds}`);
                        let interceptionsText = document.createTextNode(`${res2.data[i].interceptions}`);
                        let rushingAttemptsText = document.createTextNode(`${res2.data[i].rushing_attempts}`);
                        let rushingYardsText = document.createTextNode(`${res2.data[i].rushing_yards}`);
                        let yardsPerCarryText = document.createTextNode(`${res2.data[i].yards_per_carry}`);
                        let rushingTDsText = document.createTextNode(`${res2.data[i].rushing_tds}`);
                        let fantasyPointsText = document.createTextNode(`${res2.data[i].fantasy_points}`);
                        name.appendChild(nameText);
                        team.appendChild(teamText);
                        passAttempts.appendChild(passAttemptsText);
                        completions.appendChild(completionsText);
                        passingYards.appendChild(passingYardsText);
                        yardsPerCompletion.appendChild(yardsPerCompletionText);
                        passingTDs.appendChild(passingTDsText);
                        interceptions.appendChild(interceptionsText);
                        rushingAttempts.appendChild(rushingAttemptsText);
                        rushingYards.appendChild(rushingYardsText);
                        yardsPerCarry.appendChild(yardsPerCarryText);
                        rushingTDs.appendChild(rushingTDsText);
                        fantasyPoints.appendChild(fantasyPointsText);
                    }
                }
            })
        }
    })
}

const displayMyRBs = (stat, sort) => {
    while(rbTable.rows.length > 1){
        rbTable.deleteRow(-1);
    }
    axios.get(`${baseURL}/auth`)
    .then(res1 => {
        if (!stat && !sort){
            axios.get(`${baseURL}/claimedrbs?user=${res1.data.userID}`)
            .then(res2 => {
                if (!res2.data.length){
                    rbTable.style.display = `none`;
                    noRBs.style.display = `inline`;
                }
                else{
                    rbTable.style.display = `table`;
                    noRBs.style.display = `none`;
                    for (let i = 0; i < res2.data.length; i++){
                        let newRow = rbTable.insertRow();
                        let buttonCell = newRow.insertCell();
                        buttonCell.classList.add(`button-cell`);
                        let buttonCellContent = document.createElement(`button`);
                        buttonCellContent.textContent = `Drop Player`;
                        buttonCellContent.classList.add(`rb-remove-button`);
                        buttonCellContent.id = res2.data[i].id;
                        buttonCell.appendChild(buttonCellContent);
                        buttonCellContent.addEventListener(`click`, dropPlayer);
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
                        let fantasyPoints = newRow.insertCell();
                        let nameText = document.createTextNode(`${res2.data[i].name}`);
                        let teamText = document.createTextNode(`${res2.data[i].team}`);
                        let rushingAttemptsText = document.createTextNode(`${res2.data[i].rushing_attempts}`);
                        let rushingYardsText = document.createTextNode(`${res2.data[i].rushing_yards}`);
                        let yardsPerCarryText = document.createTextNode(`${res2.data[i].yards_per_carry}`);
                        let receivingTargetsText = document.createTextNode(`${res2.data[i].receiving_targets}`);
                        let receptionsText = document.createTextNode(`${res2.data[i].receptions}`);
                        let receivingYardsText = document.createTextNode(`${res2.data[i].receiving_yards}`);
                        let yardsPerReceptionText = document.createTextNode(`${res2.data[i].yards_per_reception}`);
                        let touchdownsText = document.createTextNode(`${res2.data[i].touchdowns}`);
                        let fantasyPointsText = document.createTextNode(`${res2.data[i].fantasy_points}`);
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
                        fantasyPoints.appendChild(fantasyPointsText);
                    }
                }
            })
        }
        else{
            axios.get(`${baseURL}/claimedrbs?user=${res1.data.userID}&stat=${stat}&sort=${sort}`)
            .then(res2 => {
                for (let i = 0; i < res2.data.length; i++){
                    let newRow = rbTable.insertRow();
                    let buttonCell = newRow.insertCell();
                    buttonCell.classList.add(`button-cell`);
                    let buttonCellContent = document.createElement(`button`);
                    buttonCellContent.textContent = `Drop Player`;
                    buttonCellContent.classList.add(`rb-remove-button`);
                    buttonCellContent.id = res2.data[i].id;
                    buttonCell.appendChild(buttonCellContent);
                    buttonCellContent.addEventListener(`click`, dropPlayer);
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
                    let fantasyPoints = newRow.insertCell();
                    let nameText = document.createTextNode(`${res2.data[i].name}`);
                    let teamText = document.createTextNode(`${res2.data[i].team}`);
                    let rushingAttemptsText = document.createTextNode(`${res2.data[i].rushing_attempts}`);
                    let rushingYardsText = document.createTextNode(`${res2.data[i].rushing_yards}`);
                    let yardsPerCarryText = document.createTextNode(`${res2.data[i].yards_per_carry}`);
                    let receivingTargetsText = document.createTextNode(`${res2.data[i].receiving_targets}`);
                    let receptionsText = document.createTextNode(`${res2.data[i].receptions}`);
                    let receivingYardsText = document.createTextNode(`${res2.data[i].receiving_yards}`);
                    let yardsPerReceptionText = document.createTextNode(`${res2.data[i].yards_per_reception}`);
                    let touchdownsText = document.createTextNode(`${res2.data[i].touchdowns}`);
                    let fantasyPointsText = document.createTextNode(`${res2.data[i].fantasy_points}`);
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
                    fantasyPoints.appendChild(fantasyPointsText);
                }
            })
        }
    })
}

const displayMyWRs = (stat, sort) => {
    while(wrTable.rows.length > 1){
        wrTable.deleteRow(-1);
    }
    axios.get(`${baseURL}/auth`)
    .then(res1 => {
        if (!stat && !sort){
            axios.get(`${baseURL}/claimedwrs?user=${res1.data.userID}`)
            .then(res2 => {
                if (!res2.data.length){
                    wrTable.style.display = `none`;
                    noWRs.style.display = `inline`;
                }
                else{
                    wrTable.style.display = `table`;
                    noWRs.style.display = `none`;
                    for (let i = 0; i < res2.data.length; i++){
                        let newRow = wrTable.insertRow();
                        let buttonCell = newRow.insertCell();
                        buttonCell.classList.add(`button-cell`);
                        let buttonCellContent = document.createElement(`button`);
                        buttonCellContent.textContent = `Drop Player`;
                        buttonCellContent.classList.add(`wr-remove-button`);
                        buttonCellContent.id = res2.data[i].id;
                        buttonCell.appendChild(buttonCellContent);
                        buttonCellContent.addEventListener(`click`, dropPlayer);
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
                        let fantasyPoints = newRow.insertCell();
                        let nameText = document.createTextNode(`${res2.data[i].name}`);
                        let teamText = document.createTextNode(`${res2.data[i].team}`);
                        let receivingTargetsText = document.createTextNode(`${res2.data[i].receiving_targets}`);
                        let receptionsText = document.createTextNode(`${res2.data[i].receptions}`);
                        let receivingYardsText = document.createTextNode(`${res2.data[i].receiving_yards}`);
                        let yardsPerReceptionText = document.createTextNode(`${res2.data[i].yards_per_reception}`);
                        let rushingAttemptsText = document.createTextNode(`${res2.data[i].rushing_attempts}`);
                        let rushingYardsText = document.createTextNode(`${res2.data[i].rushing_yards}`);
                        let yardsPerCarryText = document.createTextNode(`${res2.data[i].yards_per_carry}`);
                        let touchdownsText = document.createTextNode(`${res2.data[i].touchdowns}`);
                        let fantasyPointsText = document.createTextNode(`${res2.data[i].fantasy_points}`);
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
                        fantasyPoints.appendChild(fantasyPointsText);
                    }
                }
            })
        }
        else{
            axios.get(`${baseURL}/claimedwrs?user=${res1.data.userID}&stat=${stat}&sort=${sort}`)
            .then(res2 => {
                for (let i = 0; i < res2.data.length; i++){
                    let newRow = wrTable.insertRow();
                    let buttonCell = newRow.insertCell();
                    buttonCell.classList.add(`button-cell`);
                    let buttonCellContent = document.createElement(`button`);
                    buttonCellContent.textContent = `Drop Player`;
                    buttonCellContent.classList.add(`wr-remove-button`);
                    buttonCellContent.id = res2.data[i].id;
                    buttonCell.appendChild(buttonCellContent);
                    buttonCellContent.addEventListener(`click`, dropPlayer);
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
                    let fantasyPoints = newRow.insertCell();
                    let nameText = document.createTextNode(`${res2.data[i].name}`);
                    let teamText = document.createTextNode(`${res2.data[i].team}`);
                    let receivingTargetsText = document.createTextNode(`${res2.data[i].receiving_targets}`);
                    let receptionsText = document.createTextNode(`${res2.data[i].receptions}`);
                    let receivingYardsText = document.createTextNode(`${res2.data[i].receiving_yards}`);
                    let yardsPerReceptionText = document.createTextNode(`${res2.data[i].yards_per_reception}`);
                    let rushingAttemptsText = document.createTextNode(`${res2.data[i].rushing_attempts}`);
                    let rushingYardsText = document.createTextNode(`${res2.data[i].rushing_yards}`);
                    let yardsPerCarryText = document.createTextNode(`${res2.data[i].yards_per_carry}`);
                    let touchdownsText = document.createTextNode(`${res2.data[i].touchdowns}`);
                    let fantasyPointsText = document.createTextNode(`${res2.data[i].fantasy_points}`);
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
                    fantasyPoints.appendChild(fantasyPointsText);
                }
            })
        }
    })
}

const displayMyTEs = (stat, sort) => {
    while(teTable.rows.length > 1){
        teTable.deleteRow(-1);
    }
    axios.get(`${baseURL}/auth`)
    .then(res1 => {
        if (!stat && !sort){
            axios.get(`${baseURL}/claimedtes?user=${res1.data.userID}`)
            .then(res2 => {
                if (!res2.data.length){
                    teTable.style.display = `none`;
                    noTEs.style.display = `inline`;
                }
                else{
                    teTable.style.display = `table`;
                    noTEs.style.display = `none`;
                    for (let i = 0; i < res2.data.length; i++){
                        let newRow = teTable.insertRow();
                        let buttonCell = newRow.insertCell();
                        buttonCell.classList.add(`button-cell`);
                        let buttonCellContent = document.createElement(`button`);
                        buttonCellContent.textContent = `Drop Player`;
                        buttonCellContent.classList.add(`te-remove-button`);
                        buttonCellContent.id = res2.data[i].id;
                        buttonCell.appendChild(buttonCellContent);
                        buttonCellContent.addEventListener(`click`, dropPlayer);
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
                        let fantasyPoints = newRow.insertCell();
                        let nameText = document.createTextNode(`${res2.data[i].name}`);
                        let teamText = document.createTextNode(`${res2.data[i].team}`);
                        let receivingTargetsText = document.createTextNode(`${res2.data[i].receiving_targets}`);
                        let receptionsText = document.createTextNode(`${res2.data[i].receptions}`);
                        let receivingYardsText = document.createTextNode(`${res2.data[i].receiving_yards}`);
                        let yardsPerReceptionText = document.createTextNode(`${res2.data[i].yards_per_reception}`);
                        let rushingAttemptsText = document.createTextNode(`${res2.data[i].rushing_attempts}`);
                        let rushingYardsText = document.createTextNode(`${res2.data[i].rushing_yards}`);
                        let yardsPerCarryText = document.createTextNode(`${res2.data[i].yards_per_carry}`);
                        let touchdownsText = document.createTextNode(`${res2.data[i].touchdowns}`);
                        let fantasyPointsText = document.createTextNode(`${res2.data[i].fantasy_points}`);
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
                        fantasyPoints.appendChild(fantasyPointsText);
                    }
                }
            })
        }
        else{
            axios.get(`${baseURL}/claimedtes?user=${res1.data.userID}&stat=${stat}&sort=${sort}`)
            .then(res2 => {
                for (let i = 0; i < res2.data.length; i++){
                    let newRow = teTable.insertRow();
                    let buttonCell = newRow.insertCell();
                    buttonCell.classList.add(`button-cell`);
                    let buttonCellContent = document.createElement(`button`);
                    buttonCellContent.textContent = `Drop Player`;
                    buttonCellContent.classList.add(`te-remove-button`);
                    buttonCellContent.id = res2.data[i].id;
                    buttonCell.appendChild(buttonCellContent);
                    buttonCellContent.addEventListener(`click`, dropPlayer);
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
                    let fantasyPoints = newRow.insertCell();
                    let nameText = document.createTextNode(`${res2.data[i].name}`);
                    let teamText = document.createTextNode(`${res2.data[i].team}`);
                    let receivingTargetsText = document.createTextNode(`${res2.data[i].receiving_targets}`);
                    let receptionsText = document.createTextNode(`${res2.data[i].receptions}`);
                    let receivingYardsText = document.createTextNode(`${res2.data[i].receiving_yards}`);
                    let yardsPerReceptionText = document.createTextNode(`${res2.data[i].yards_per_reception}`);
                    let rushingAttemptsText = document.createTextNode(`${res2.data[i].rushing_attempts}`);
                    let rushingYardsText = document.createTextNode(`${res2.data[i].rushing_yards}`);
                    let yardsPerCarryText = document.createTextNode(`${res2.data[i].yards_per_carry}`);
                    let touchdownsText = document.createTextNode(`${res2.data[i].touchdowns}`);
                    let fantasyPointsText = document.createTextNode(`${res2.data[i].fantasy_points}`);
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
                    fantasyPoints.appendChild(fantasyPointsText);
                }
            })
        }
    })
}

const displayMyKs = (stat, sort) => {
    while(kTable.rows.length > 1){
        kTable.deleteRow(-1);
    }
    axios.get(`${baseURL}/auth`)
    .then(res1 => {
        if (!stat && !sort){
            axios.get(`${baseURL}/claimedks?user=${res1.data.userID}`)
            .then(res2 => {
                if (!res2.data.length){
                    kTable.style.display = `none`;
                    noKs.style.display = `inline`;
                }
                else{
                    kTable.style.display = `table`;
                    noKs.style.display = `none`;
                }
                for (let i = 0; i < res2.data.length; i++){
                    let newRow = kTable.insertRow();
                    let buttonCell = newRow.insertCell();
                    buttonCell.classList.add(`button-cell`);
                    let buttonCellContent = document.createElement(`button`);
                    buttonCellContent.textContent = `Drop Player`;
                    buttonCellContent.classList.add(`k-remove-button`);
                    buttonCellContent.id = res2.data[i].id;
                    buttonCell.appendChild(buttonCellContent);
                    buttonCellContent.addEventListener(`click`, dropPlayer);
                    let name = newRow.insertCell();
                    name.classList.add(`name-cell`);
                    let filler = newRow.insertCell();
                    let team = newRow.insertCell();
                    let xpAttempts = newRow.insertCell();
                    let xpMade = newRow.insertCell();
                    let fgAttempts = newRow.insertCell();
                    let fgMade = newRow.insertCell();
                    let fantasyPoints = newRow.insertCell();
                    let nameText = document.createTextNode(`${res2.data[i].name}`);
                    let teamText = document.createTextNode(`${res2.data[i].team}`);
                    let xpAttemptsText = document.createTextNode(`${res2.data[i].xp_attempts}`);
                    let xpMadeText = document.createTextNode(`${res2.data[i].xp_made}`);
                    let fgAttemptsText = document.createTextNode(`${res2.data[i].fg_attempts}`);
                    let fgMadeText = document.createTextNode(`${res2.data[i].fg_made}`);
                    let fantasyPointsText = document.createTextNode(`${res2.data[i].fantasy_points}`);
                    name.appendChild(nameText);
                    team.appendChild(teamText);
                    xpAttempts.appendChild(xpAttemptsText);
                    xpMade.appendChild(xpMadeText);
                    fgAttempts.appendChild(fgAttemptsText);
                    fgMade.appendChild(fgMadeText);
                    fantasyPoints.appendChild(fantasyPointsText);
                }
            })
        }
        else{
            axios.get(`${baseURL}/claimedks?user=${res1.data.userID}&stat=${stat}&sort=${sort}`)
            .then(res2 => {
                for (let i = 0; i < res2.data.length; i++){
                    let newRow = kTable.insertRow();
                    let buttonCell = newRow.insertCell();
                    buttonCell.classList.add(`button-cell`);
                    let buttonCellContent = document.createElement(`button`);
                    buttonCellContent.textContent = `Drop Player`;
                    buttonCellContent.classList.add(`k-remove-button`);
                    buttonCellContent.id = res2.data[i].id;
                    buttonCell.appendChild(buttonCellContent);
                    buttonCellContent.addEventListener(`click`, dropPlayer);
                    let name = newRow.insertCell();
                    name.classList.add(`name-cell`);
                    let filler = newRow.insertCell();
                    let team = newRow.insertCell();
                    let xpAttempts = newRow.insertCell();
                    let xpMade = newRow.insertCell();
                    let fgAttempts = newRow.insertCell();
                    let fgMade = newRow.insertCell();
                    let fantasyPoints = newRow.insertCell();
                    let nameText = document.createTextNode(`${res2.data[i].name}`);
                    let teamText = document.createTextNode(`${res2.data[i].team}`);
                    let xpAttemptsText = document.createTextNode(`${res2.data[i].xp_attempts}`);
                    let xpMadeText = document.createTextNode(`${res2.data[i].xp_made}`);
                    let fgAttemptsText = document.createTextNode(`${res2.data[i].fg_attempts}`);
                    let fgMadeText = document.createTextNode(`${res2.data[i].fg_made}`);
                    let fantasyPointsText = document.createTextNode(`${res2.data[i].fantasy_points}`);
                    name.appendChild(nameText);
                    team.appendChild(teamText);
                    xpAttempts.appendChild(xpAttemptsText);
                    xpMade.appendChild(xpMadeText);
                    fgAttempts.appendChild(fgAttemptsText);
                    fgMade.appendChild(fgMadeText);
                    fantasyPoints.appendChild(fantasyPointsText);
                }
            })
        }
    })
}

const yourTeamHandleSort = event => {
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
    switch (event.currentTarget.parentElement.id){
        case `qb-headers`:
            if (event.currentTarget.children[0].children[1].textContent === `expand_more`){
                displayMyQBs(stat, `DESC`);
            }
            else{
                displayMyQBs(stat, `ASC`);
            }
            break;
        case `rb-headers`:
            if (event.currentTarget.children[0].children[1].textContent === `expand_more`){
                displayMyRBs(stat, `DESC`);
            }
            else{
                displayMyRBs(stat, `ASC`);
            }
            break;
        case `wr-headers`:
            if (event.currentTarget.children[0].children[1].textContent === `expand_more`){
                displayMyWRs(stat, `DESC`);
            }
            else{
                displayMyWRs(stat, `ASC`);
            }
            break;
        case `te-headers`:
            if (event.currentTarget.children[0].children[1].textContent === `expand_more`){
                displayMyTEs(stat, `DESC`);
            }
            else{
                displayMyTEs(stat, `ASC`);
            }
            break;
        case `k-headers`:
            if (event.currentTarget.children[0].children[1].textContent === `expand_more`){
                displayMyKs(stat, `DESC`);
            }
            else{
                displayMyKs(stat, `ASC`);
            }
            break;
    }
}

const dropPlayer = event => {
    axios.get(`${baseURL}/auth`)
    .then(res => {
        if (event.target.className === `qb-remove-button`){
            axios.delete(`${baseURL}/quarterbacks?player=${event.target.id}`)
            .then(res => alert(res.data))
        }
        else if (event.target.className === `rb-remove-button`){
            axios.delete(`${baseURL}/runningbacks?player=${event.target.id}`)
            .then(res => alert(res.data))
        }
        else if (event.target.className === `wr-remove-button`){
            axios.delete(`${baseURL}/widereceivers?player=${event.target.id}`)
            .then(res => alert(res.data))
        }
        else if (event.target.className === `te-remove-button`){
            axios.delete(`${baseURL}/tightends?player=${event.target.id}`)
            .then(res => alert(res.data))
        }
        else if (event.target.className === `k-remove-button`){
            axios.delete(`${baseURL}/kickers?player=${event.target.id}`)
            .then(res => alert(res.data))
        }
        location.reload();
    })
}

checkAuth();

for (let i = 0; i < tableHeaders.length; i ++){
    tableHeaders[i].addEventListener(`click`, yourTeamHandleSort);
}
logoutButton.addEventListener(`click`, logout);