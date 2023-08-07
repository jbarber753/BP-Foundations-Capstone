const button = document.getElementById(`button`);
const qbTable = document.getElementById(`qb-table`);
const rbTable = document.getElementById(`rb-table`);
const wrTable = document.getElementById(`wr-table`);
const teTable = document.getElementById(`te-table`);
const kTable = document.getElementById(`k-table`);

const baseURL = `http://localhost:4000`

const displayQBs = () => {
    axios.get(`${baseURL}/quarterbacks`)
    .then(res => {
        for (let i = 0; i < res.data.length; i++){
            let newRow = qbTable.insertRow();
            let name = newRow.insertCell();
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

const displayRBs = () => {
    axios.get(`${baseURL}/runningbacks`)
    .then(res => {
        for (let i = 0; i < res.data.length; i++){
            let newRow = rbTable.insertRow();
            let name = newRow.insertCell();
            let rushingAttempts = newRow.insertCell();
            let rushingYards = newRow.insertCell();
            let yardsPerCarry = newRow.insertCell();
            let receivingTargets = newRow.insertCell();
            let receptions = newRow.insertCell();
            let receivingYards = newRow.insertCell();
            let yardsPerReception = newRow.insertCell();
            let touchdowns = newRow.insertCell();
            let nameText = document.createTextNode(`${res.data[i].name}`);
            let rushingAttemptsText = document.createTextNode(`${res.data[i].rushing_attempts}`);
            let rushingYardsText = document.createTextNode(`${res.data[i].rushing_yards}`);
            let yardsPerCarryText = document.createTextNode(`${res.data[i].yards_per_carry}`);
            let receivingTargetsText = document.createTextNode(`${res.data[i].receiving_targets}`);
            let receptionsText = document.createTextNode(`${res.data[i].receptions}`);
            let receivingYardsText = document.createTextNode(`${res.data[i].receiving_yards}`);
            let yardsPerReceptionText = document.createTextNode(`${res.data[i].yards_per_reception}`);
            let touchdownsText = document.createTextNode(`${res.data[i].touchdowns}`);
            name.appendChild(nameText);
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

const displayWRs = () => {
    axios.get(`${baseURL}/widereceivers`)
    .then(res => {
        for (let i = 0; i < res.data.length; i++){
            let newRow = wrTable.insertRow();
            let name = newRow.insertCell();
            let receivingTargets = newRow.insertCell();
            let receptions = newRow.insertCell();
            let receivingYards = newRow.insertCell();
            let yardsPerReception = newRow.insertCell();
            let rushingAttempts = newRow.insertCell();
            let rushingYards = newRow.insertCell();
            let yardsPerCarry = newRow.insertCell();
            let touchdowns = newRow.insertCell();
            let nameText = document.createTextNode(`${res.data[i].name}`);
            let receivingTargetsText = document.createTextNode(`${res.data[i].receiving_targets}`);
            let receptionsText = document.createTextNode(`${res.data[i].receptions}`);
            let receivingYardsText = document.createTextNode(`${res.data[i].receiving_yards}`);
            let yardsPerReceptionText = document.createTextNode(`${res.data[i].yards_per_reception}`);
            let rushingAttemptsText = document.createTextNode(`${res.data[i].rushing_attempts}`);
            let rushingYardsText = document.createTextNode(`${res.data[i].rushing_yards}`);
            let yardsPerCarryText = document.createTextNode(`${res.data[i].yards_per_carry}`);
            let touchdownsText = document.createTextNode(`${res.data[i].touchdowns}`);
            name.appendChild(nameText);
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

const displayTEs = () => {
    axios.get(`${baseURL}/tightends`)
    .then(res => {
        for (let i = 0; i < res.data.length; i++){
            let newRow = teTable.insertRow();
            let name = newRow.insertCell();
            let receivingTargets = newRow.insertCell();
            let receptions = newRow.insertCell();
            let receivingYards = newRow.insertCell();
            let yardsPerReception = newRow.insertCell();
            let rushingAttempts = newRow.insertCell();
            let rushingYards = newRow.insertCell();
            let yardsPerCarry = newRow.insertCell();
            let touchdowns = newRow.insertCell();
            let nameText = document.createTextNode(`${res.data[i].name}`);
            let receivingTargetsText = document.createTextNode(`${res.data[i].receiving_targets}`);
            let receptionsText = document.createTextNode(`${res.data[i].receptions}`);
            let receivingYardsText = document.createTextNode(`${res.data[i].receiving_yards}`);
            let yardsPerReceptionText = document.createTextNode(`${res.data[i].yards_per_reception}`);
            let rushingAttemptsText = document.createTextNode(`${res.data[i].rushing_attempts}`);
            let rushingYardsText = document.createTextNode(`${res.data[i].rushing_yards}`);
            let yardsPerCarryText = document.createTextNode(`${res.data[i].yards_per_carry}`);
            let touchdownsText = document.createTextNode(`${res.data[i].touchdowns}`);
            name.appendChild(nameText);
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

const displayKs = () => {
    axios.get(`${baseURL}/kickers`)
    .then(res => {
        for (let i = 0; i < res.data.length; i++){
            let newRow = kTable.insertRow();
            let name = newRow.insertCell();
            let xpAttempts = newRow.insertCell();
            let xpMade = newRow.insertCell();
            let fgAttempts = newRow.insertCell();
            let fgMade = newRow.insertCell();
            let nameText = document.createTextNode(`${res.data[i].name}`);
            let xpAttemptsText = document.createTextNode(`${res.data[i].xp_attempts}`);
            let xpMadeText = document.createTextNode(`${res.data[i].xp_made}`);
            let fgAttemptsText = document.createTextNode(`${res.data[i].fg_attempts}`);
            let fgMadeText = document.createTextNode(`${res.data[i].fg_made}`);
            name.appendChild(nameText);
            xpAttempts.appendChild(xpAttemptsText);
            xpMade.appendChild(xpMadeText);
            fgAttempts.appendChild(fgAttemptsText);
            fgMade.appendChild(fgMadeText);
        }
    })
}

displayQBs();
displayRBs();
displayWRs();
displayTEs();
displayKs();