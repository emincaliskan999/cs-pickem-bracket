const initialData = {
  quarterFinals: [
    {
      id: "qf1",
      time: "18:00 Today",
      format: "BO3",
      teams: [
        { name: "Spirit", odds: "2.26", logo: "logos/spirit.png" },
        { name: "MOUZ", odds: "1.67", logo: "logos/mouz.png" }
      ]
    },
    {
      id: "qf2",
      time: "21:15 Today",
      format: "BO3",
      teams: [
        { name: "Vitality", odds: "1.31", logo: "logos/vitality.png" },
        { name: "Natus Vincere", odds: "3.52", logo: "logos/navi.png" }
      ]
    }
  ],
  semiFinals: [
    {
      id: "sf1",
      time: "18:00 Saturday",
      format: "BO3",
      teams: [
        { name: "Falcons", logo: "logos/falcons.png" },
        { name: "TBD", isTBD: true }
      ]
    },
    {
      id: "sf2",
      time: "21:15 Saturday",
      format: "BO3",
      teams: [
        { name: "FURIA", logo: "logos/furia.png" },
        { name: "TBD", isTBD: true }
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

function resetState() {
  state = JSON.parse(JSON.stringify(initialData));
  state.winners = {};
  state.champion = "TBD";
  renderAll();
}

function pick(matchId, teamIndex, round) {
  const match = state[round].find(m => m.id === matchId);
  const team = match.teams[teamIndex];
  if (!team || team.isTBD) return;

  state.winners[matchId] = team;

  if (matchId === "qf1") {
    state.semiFinals[0].teams[1] = team;
  }
  if (matchId === "qf2") {
    state.semiFinals[1].teams[1] = team;
  }
  if (matchId === "sf1") {
    state.grandFinal[0].teams[0] = team;
  }
  if (matchId === "sf2") {
    state.grandFinal[0].teams[1] = team;
  }
  if (matchId === "gf1") {
    state.champion = team.name;
  }

  renderAll();
}

function createMatch(match, round) {
  const card = document.createElement("div");
  card.className = "match-card";

  const header = document.createElement("div");
  header.className = "match-header";
  header.innerHTML = `<span>${match.time}</span><span>${match.format}</span>`;

  const teams = document.createElement("div");

  match.teams.forEach((team, i) => {
    const row = document.createElement("div");
    row.className = "team-row";

    if (state.winners[match.id]?.name === team.name) {
      row.classList.add("selected");
    }

    row.onclick = () => pick(match.id, i, round);

    row.innerHTML = `
      <div class="team-main">
        ${team.logo ? `<img src="${team.logo}" class="team-logo">` : ""}
        <span class="team-name">${team.name}</span>
      </div>
      <div class="odds ${!team.odds ? "no-odds" : ""}">
        ${team.odds || ""}
      </div>
    `;

    teams.appendChild(row);
  });

  card.appendChild(header);
  card.appendChild(teams);

  return card;
}

function renderAll() {
  document.getElementById("quarterFinals").innerHTML = "";
  state.quarterFinals.forEach(m =>
    document.getElementById("quarterFinals").appendChild(createMatch(m, "quarterFinals"))
  );

  document.getElementById("semiFinals").innerHTML = "";
  state.semiFinals.forEach(m =>
    document.getElementById("semiFinals").appendChild(createMatch(m, "semiFinals"))
  );

  document.getElementById("grandFinal").innerHTML = "";
  state.grandFinal.forEach(m =>
    document.getElementById("grandFinal").appendChild(createMatch(m, "grandFinal"))
  );

  document.getElementById("championName").textContent = state.champion;
}

document.getElementById("resetBtn").onclick = resetState;

resetState();
