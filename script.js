const initialData = {
  quarterFinals: [
    {
      id: "qf1",
      time: "18:00 Today",
      format: "BO3",
      teams: [
        {
          name: "Spirit",
          odds: "2.262",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/fc/Team_Spirit_2024_allmode.png/64px-Team_Spirit_2024_allmode.png"
        },
        {
          name: "MOUZ",
          odds: "1.67",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/MOUZ_2023_allmode.png/64px-MOUZ_2023_allmode.png"
        }
      ]
    },
    {
      id: "qf2",
      time: "21:15 Today",
      format: "BO3",
      teams: [
        {
          name: "Vitality",
          odds: "1.31",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Team_Vitality_2024_allmode.png/64px-Team_Vitality_2024_allmode.png"
        },
        {
          name: "Natus Vincere",
          odds: "3.525",
          logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Natus_Vincere_logo.svg/64px-Natus_Vincere_logo.svg.png"
        }
      ]
    }
  ],
  semiFinals: [
    {
      id: "sf1",
      time: "18:00 Saturday",
      format: "BO3",
      teams: [
        {
          name: "Falcons",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/57/Team_Falcons_2024_allmode.png/64px-Team_Falcons_2024_allmode.png",
          locked: true
        },
        {
          name: "TBD",
          isTBD: true
        }
      ]
    },
    {
      id: "sf2",
      time: "21:15 Saturday",
      format: "BO3",
      teams: [
        {
          name: "FURIA",
          logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f9/FURIA_Esports_logo.png/64px-FURIA_Esports_logo.png",
          locked: true
        },
        {
          name: "TBD",
          isTBD: true
        }
      ]
    }
  ],
  grandFinal: [
    {
      id: "gf1",
      time: "20:00 Sunday",
      format: "BO5",
      teams: [
        { name: "TBD", isTBD: true },
        { name: "TBD", isTBD: true }
      ]
    }
  ]
};

let state = {};

function deepClone(data) {
  return JSON.parse(JSON.stringify(data));
}

function createTBDTeam() {
  return {
    name: "TBD",
    isTBD: true
  };
}

function resetState() {
  state = {
    quarterFinals: deepClone(initialData.quarterFinals),
    semiFinals: deepClone(initialData.semiFinals),
    grandFinal: deepClone(initialData.grandFinal),
    winners: {},
    champion: "TBD"
  };

  renderAll();
}

function getWinner(matchId) {
  return state.winners[matchId] || null;
}

function setWinner(matchId, team) {
  state.winners[matchId] = { ...team };
}

function clearWinner(matchId) {
  delete state.winners[matchId];
}

function isSelectable(team) {
  return team && !team.isTBD && team.name !== "TBD";
}

function handleQuarterFinalPick(matchId, teamIndex) {
  const match = state.quarterFinals.find((m) => m.id === matchId);
  const selectedTeam = match.teams[teamIndex];
  if (!isSelectable(selectedTeam)) return;

  setWinner(matchId, selectedTeam);

  if (matchId === "qf1") {
    state.semiFinals[0].teams[1] = {
      name: selectedTeam.name,
      logo: selectedTeam.logo
    };

    clearWinner("sf1");
    state.grandFinal[0].teams[0] = createTBDTeam();
    clearWinner("gf1");
    state.champion = "TBD";
  }

  if (matchId === "qf2") {
    state.semiFinals[1].teams[1] = {
      name: selectedTeam.name,
      logo: selectedTeam.logo
    };

    clearWinner("sf2");
    state.grandFinal[0].teams[1] = createTBDTeam();
    clearWinner("gf1");
    state.champion = "TBD";
  }

  renderAll();
}

function handleSemiFinalPick(matchId, teamIndex) {
  const match = state.semiFinals.find((m) => m.id === matchId);
  const selectedTeam = match.teams[teamIndex];
  if (!isSelectable(selectedTeam)) return;

  setWinner(matchId, selectedTeam);

  if (matchId === "sf1") {
    state.grandFinal[0].teams[0] = {
      name: selectedTeam.name,
      logo: selectedTeam.logo
    };
    clearWinner("gf1");
    state.champion = "TBD";
  }

  if (matchId === "sf2") {
    state.grandFinal[0].teams[1] = {
      name: selectedTeam.name,
      logo: selectedTeam.logo
    };
    clearWinner("gf1");
    state.champion = "TBD";
  }

  renderAll();
}

function handleGrandFinalPick(teamIndex) {
  const match = state.grandFinal[0];
  const selectedTeam = match.teams[teamIndex];
  if (!isSelectable(selectedTeam)) return;

  setWinner("gf1", selectedTeam);
  state.champion = selectedTeam.name;
  renderAll();
}

function createTeamRow(team, index, match, roundType) {
  const row = document.createElement("div");
  row.className = "team-row";

  const selectedWinner = getWinner(match.id);
  if (selectedWinner && selectedWinner.name === team.name && !team.isTBD) {
    row.classList.add("selected");
  }

  if (!isSelectable(team)) {
    row.classList.add("disabled");
  }

  if (roundType === "quarter") {
    row.addEventListener("click", () => handleQuarterFinalPick(match.id, index));
  } else if (roundType === "semi") {
    row.addEventListener("click", () => handleSemiFinalPick(match.id, index));
  } else if (roundType === "grand") {
    row.addEventListener("click", () => handleGrandFinalPick(index));
  }

  const teamMain = document.createElement("div");
  teamMain.className = "team-main";

  if (team.logo) {
    const logo = document.createElement("img");
    logo.className = "team-logo";
    logo.src = team.logo;
    logo.alt = `${team.name} logo`;
    teamMain.appendChild(logo);
  }

  const teamName = document.createElement("div");
  teamName.className = "team-name";
  if (team.isTBD) {
    teamName.classList.add("tbd");
  }
  teamName.textContent = team.name;

  teamMain.appendChild(teamName);

  const odds = document.createElement("div");
  odds.className = "odds";

  if (roundType === "quarter" && team.odds) {
    odds.textContent = team.odds;
  } else {
    odds.classList.add("no-odds");
    odds.textContent = "-";
  }

  row.appendChild(teamMain);
  row.appendChild(odds);

  return row;
}

function createMatchCard(match, roundType) {
  const card = document.createElement("div");
  card.className = "match-card";

  const header = document.createElement("div");
  header.className = "match-header";
  header.innerHTML = `
    <span>${match.time}</span>
    <span>${match.format}</span>
  `;

  const teams = document.createElement("div");
  teams.className = "match-teams";

  match.teams.forEach((team, index) => {
    teams.appendChild(createTeamRow(team, index, match, roundType));
  });

  card.appendChild(header);
  card.appendChild(teams);

  return card;
}

function renderQuarterFinals() {
  const container = document.getElementById("quarterFinals");
  container.innerHTML = "";
  state.quarterFinals.forEach((match) => {
    container.appendChild(createMatchCard(match, "quarter"));
  });
}

function renderSemiFinals() {
  const container = document.getElementById("semiFinals");
  container.innerHTML = "";
  state.semiFinals.forEach((match) => {
    container.appendChild(createMatchCard(match, "semi"));
  });
}

function renderGrandFinal() {
  const container = document.getElementById("grandFinal");
  container.innerHTML = "";
  state.grandFinal.forEach((match) => {
    container.appendChild(createMatchCard(match, "grand"));
  });
}

function renderChampion() {
  document.getElementById("championName").textContent = state.champion;
}

function renderAll() {
  renderQuarterFinals();
  renderSemiFinals();
  renderGrandFinal();
  renderChampion();
}

document.getElementById("resetBtn").addEventListener("click", resetState);

resetState();
