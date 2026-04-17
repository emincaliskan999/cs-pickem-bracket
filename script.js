const initialData = {
  quarterFinals: [
    {
      id: "qf1",
      title: "Quarter-final 1",
      time: "18:00 Today",
      format: "BO3",
      teams: [
        { name: "Spirit", odds: "2.262" },
        { name: "MOUZ", odds: "1.67" }
      ]
    },
    {
      id: "qf2",
      title: "Quarter-final 2",
      time: "21:15 Today",
      format: "BO3",
      teams: [
        { name: "Vitality", odds: "1.31" },
        { name: "Natus Vincere", odds: "3.525" }
      ]
    },
    {
      id: "qf3",
      title: "Quarter-final 3",
      time: "18:00 Saturday",
      format: "BO3",
      teams: [
        { name: "Falcons", odds: "1.85" },
        { name: "TBD", odds: null, isTBD: true }
      ]
    },
    {
      id: "qf4",
      title: "Quarter-final 4",
      time: "21:15 Saturday",
      format: "BO3",
      teams: [
        { name: "FURIA", odds: "2.10" },
        { name: "TBD", odds: null, isTBD: true }
      ]
    }
  ]
};

let state = {};

function deepClone(data) {
  return JSON.parse(JSON.stringify(data));
}

function resetState() {
  state = {
    quarterFinals: deepClone(initialData.quarterFinals),
    semiFinals: [
      {
        id: "sf1",
        title: "Semi-final 1",
        time: "18:00 Sunday",
        format: "BO3",
        teams: [
          { name: "TBD", odds: null, isTBD: true },
          { name: "TBD", odds: null, isTBD: true }
        ],
        winner: null
      },
      {
        id: "sf2",
        title: "Semi-final 2",
        time: "21:15 Sunday",
        format: "BO3",
        teams: [
          { name: "TBD", odds: null, isTBD: true },
          { name: "TBD", odds: null, isTBD: true }
        ],
        winner: null
      }
    ],
    grandFinal: [
      {
        id: "gf1",
        title: "Grand final",
        time: "20:00 Sunday",
        format: "BO5",
        teams: [
          { name: "TBD", odds: null, isTBD: true },
          { name: "TBD", odds: null, isTBD: true }
        ],
        winner: null
      }
    ],
    champion: "TBD",
    winners: {}
  };

  renderAll();
}

function getWinner(matchId) {
  return state.winners[matchId] || null;
}

function setWinner(matchId, team) {
  state.winners[matchId] = team;
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
    state.semiFinals[0].teams[0] = { ...selectedTeam, odds: null };
  }
  if (matchId === "qf2") {
    state.semiFinals[0].teams[1] = { ...selectedTeam, odds: null };
  }
  if (matchId === "qf3") {
    state.semiFinals[1].teams[0] = { ...selectedTeam, odds: null };
  }
  if (matchId === "qf4") {
    state.semiFinals[1].teams[1] = { ...selectedTeam, odds: null };
  }

  if (matchId === "qf1" || matchId === "qf2") {
    clearWinner("sf1");
    state.grandFinal[0].teams[0] = { name: "TBD", odds: null, isTBD: true };
    clearWinner("gf1");
    state.champion = "TBD";
  }

  if (matchId === "qf3" || matchId === "qf4") {
    clearWinner("sf2");
    state.grandFinal[0].teams[1] = { name: "TBD", odds: null, isTBD: true };
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
    state.grandFinal[0].teams[0] = { ...selectedTeam, odds: null };
    clearWinner("gf1");
    state.champion = "TBD";
  }

  if (matchId === "sf2") {
    state.grandFinal[0].teams[1] = { ...selectedTeam, odds: null };
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

  const selectedWinner = getWinner(match.id);

  match.teams.forEach((team, index) => {
    const row = document.createElement("div");
    row.className = "team-row";

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

    const teamName = document.createElement("div");
    teamName.className = "team-name";
    if (team.isTBD) {
      teamName.classList.add("tbd");
    }
    teamName.textContent = team.name;

    const odds = document.createElement("div");
    odds.className = "odds";

    if (roundType === "quarter" && team.odds) {
      odds.textContent = team.odds;
    } else {
      odds.classList.add("no-odds");
      odds.textContent = "-";
    }

    row.appendChild(teamName);
    row.appendChild(odds);
    teams.appendChild(row);
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
