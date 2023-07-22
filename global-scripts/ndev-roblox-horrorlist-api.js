// ░█▀▀█ ░█▀▀▀█ ░█▀▀█ ░█─── ░█▀▀▀█ ▀▄░▄▀ 
// ░█▄▄▀ ░█──░█ ░█▀▀▄ ░█─── ░█──░█ ─░█── 
// ░█─░█ ░█▄▄▄█ ░█▄▄█ ░█▄▄█ ░█▄▄▄█ ▄▀░▀▄ 

// ░█─░█ ░█▀▀▀█ ░█▀▀█ ░█▀▀█ ░█▀▀▀█ ░█▀▀█ ░█─── ▀█▀ ░█▀▀▀█ ▀▀█▀▀ 
// ░█▀▀█ ░█──░█ ░█▄▄▀ ░█▄▄▀ ░█──░█ ░█▄▄▀ ░█─── ░█─ ─▀▀▀▄▄ ─░█── 
// ░█─░█ ░█▄▄▄█ ░█─░█ ░█─░█ ░█▄▄▄█ ░█─░█ ░█▄▄█ ▄█▄ ░█▄▄▄█ ─░█── 

// ───░█ ░█▀▀▀█ 
// ─▄─░█ ─▀▀▀▄▄ 
// ░█▄▄█ ░█▄▄▄█

// Created by nouhidev

const maxUIDChunkSize = 100;
const API_BASE_URL = "https://ndevapi.com";

const data = {
  spreadSheetData: [],
  gameData: [],
  gameIconData: [],
};

window.onload = function () {
  usageDisplay();
  fetchSpreadSheetData()
  $('header').hide();
};

async function fetchSpreadSheetData() {
  const table = document.getElementById("table-to-populate");
  const elem = document.getElementById("myBar");

  const spreadSheetDataResponse = await fetch(
    "https://opensheet.elk.sh/16vH1l9tcKMEs8MATdjrp_Op-sMIL9-0jRQnBqFEthGo/3"
  );
  data.spreadSheetData = await spreadSheetDataResponse.json();

  const gameUIDS = data.spreadSheetData
    .filter((entry, index) => entry.Ambience !== "")
    .map((entry) => entry.UID);

  const chunks = [];
  for (let i = 0; i < gameUIDS.length; i += maxUIDChunkSize) {
    chunks.push(gameUIDS.slice(i, i + maxUIDChunkSize));
  }

  const fetchGameDataPromises = chunks.map((chunk) =>
    fetch(`${API_BASE_URL}/game-info/${chunk.join(",")}`).then((response) => response.json())
  );

  const fetchIconDataPromises = chunks.map((chunk) =>
    fetch(`${API_BASE_URL}/game-icon/${chunk.join(",")}`).then((response) => response.json())
  );

  elem.style.width = "50%";
  const gameDataResponses = await Promise.all(fetchGameDataPromises);
  const iconDataResponses = await Promise.all(fetchIconDataPromises);

  data.gameData = gameDataResponses.reduce((acc, response) => acc.concat(response), []);
  data.gameIconData = iconDataResponses.reduce((acc, response) => acc.concat(response), []);

  const gameDataFromAPI = [...data.gameData[0]["data"], ...data.gameData[1]["data"], ...data.gameData[2]["data"]];
  const gameIconDataFromAPI = [...data.gameIconData[0]["data"], ...data.gameIconData[1]["data"], ...data.gameIconData[2]["data"]];

  for (let i = 0; i < gameUIDS.length; i++) {
    var genreArray = data.spreadSheetData[i].Genre.split(", ");
    var genreHTMLText = genreHTML(genreArray);
    var gameURL = "https://www.roblox.com/games/" + gameDataFromAPI[i].rootPlaceId;

    var row = ` <tr class="hover-reveal" data-tooltip="${toolTipContent(
      data.spreadSheetData,
      gameDataFromAPI,
      gameIconDataFromAPI,
      i,
      genreHTMLText
    )}">
          <td data-th="Placement">${i + 1}.</td>
          <td data="Icon"><img class="game-icon" src="${gameIconDataFromAPI[i].imageUrl}"></td>
          <td data-th="Title" class="game-title"><a href="${gameURL}" class="game-href">${gameDataFromAPI[i].name}</a></td>
          <td data-th="Creator" class="align-left">${JSON.parse(
      JSON.stringify(gameDataFromAPI[i].creator)
    ).name}</td>
          <td data-th="Rating" class="align-left">${data.spreadSheetData[i].Rating}</td>
          </tr>`;

    table.innerHTML += row;
  }

  elem.style.width = "100%";

  await delay(500);

  $('header').show();
  document.getElementById("myProgress").style.display = "none";

  // Generate Table after populating it
  $("#game-table").DataTable({
    columnDefs: [{ orderable: false, targets: [1, 4] }],
  });
}

async function usageDisplay() {
  console.log(`                                                                                         
    #     # ######  ####### #     #                                             
    ##    # #     # #       #     #                                             
    # #   # #     # #       #     #                                             
    #  #  # #     # #####   #     #                                             
    #   # # #     # #        #   #                                              
    #    ## #     # #         # #                                               
    #     # ######  #######    #          

    ######  ####### ######  #       ####### #     #                             
    #     # #     # #     # #       #     #  #   #                              
    #     # #     # #     # #       #     #   # #                               
    ######  #     # ######  #       #     #    #                                
    #   #   #     # #     # #       #     #   # #                               
    #    #  #     # #     # #       #     #  #   #                              
    #     # ####### ######  ####### ####### #     #      

    #     # ####### ######  ######  ####### ######  #       ###  #####  ####### 
    #     # #     # #     # #     # #     # #     # #        #  #     #    #    
    #     # #     # #     # #     # #     # #     # #        #  #          #    
    ####### #     # ######  ######  #     # ######  #        #   #####     #    
    #     # #     # #   #   #   #   #     # #   #   #        #        #    #    
    #     # #     # #    #  #    #  #     # #    #  #        #  #     #    #    
    #     # ####### #     # #     # ####### #     # ####### ###  #####     #    

          #  #####                                                              
          # #     #                                                             
          # #                                                                   
          #  #####                                                              
    #     #       #                                                             
    #     # #     #                                                             
     #####   #####                                                              
                        
    Learn more at
    
    https://nouhi.dev/ndev-assets-docs/.
      `);
}

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}


function toolTipContent(spreadSheetData, apiGameData, apiGameIconData, i, genreHTMLText) {
  const formatter = Intl.NumberFormat('en', { notation: 'compact' });
  var desc = "";
  if (apiGameData[i].description === null) desc = "This game does not have a description.";
  else desc = apiGameData[i].description.replaceAll('"', "")

  return `
      x01${apiGameData[i].name}
      x02${JSON.parse(JSON.stringify(apiGameData[i].creator))["name"]}
      x03${desc}
      x04${genreHTMLText}
      x05${spreadSheetData[i].Date}
      xEND
  
      xR01${spreadSheetData[i].Scariness}
      xR02${spreadSheetData[i].SoundDesign}
      xR03${spreadSheetData[i].Story}
      xR04${spreadSheetData[i].Visuals}
      xR05${spreadSheetData[i].Ambience}
      xR06${spreadSheetData[i].Gameplay}
      xR07${spreadSheetData[i].Creativity}
      xR08${spreadSheetData[i].Enjoyment}
      xR09${spreadSheetData[i].ProductionQuality}
      xR10${spreadSheetData[i].Technical}
      xREND
  
      xSD01${formatter.format(apiGameData[i].playing)}
      xSD02${formatter.format(apiGameData[i].favoritedCount)}
      xSD03${formatter.format(apiGameData[i].visits)}
      xSD04${formatter.format(apiGameData[i].maxPlayers)}
      xSD05${(apiGameData[i].created.substring(0, 10))}
      xSD06${(apiGameData[i].updated.substring(0, 10))}
      xSDEND
      `;
}


/* Tooltip */
let setUpTooltip = function () {
  let tooltip = "",
    toolTipDiv = document.querySelector(".tooltip-class"),
    toolTipElements = Array.from(document.querySelectorAll(".hover-reveal"));

  // Game General Info Display  
  let gameTitle = document.getElementById("game_tooltip_title");
  let gameCreator = document.getElementById("game_tooltip_creator");
  let gameDescription = document.getElementById("game_tooltip_description");
  let lastUpdate = document.getElementById("game_tooltip_lastUpdate");

  // Game Ranking Display
  let note = document.getElementById("note");
  let scary = document.getElementById("game_rating_scariness");
  let soundDesign = document.getElementById("game_rating_soundDesign");
  let story = document.getElementById("game_rating_story");
  let visuals = document.getElementById("game_rating_visuals");
  let ambience = document.getElementById("game_rating_ambience");
  let gameplay = document.getElementById("game_rating_gameplay");
  let creativity = document.getElementById("game_rating_creativity");
  let enjoyment = document.getElementById("game_rating_enjoyment");
  let productionQuality = document.getElementById("game_rating_productionQuality");
  let technical = document.getElementById("game_rating_technical");
  let players = document.getElementById("players");
  let genre = document.getElementById("genre");

  // Game Stats Display
  let active = document.getElementById("game_stats_container_active");
  let favorites = document.getElementById("game_stats_container_favorites");
  let visits = document.getElementById("game_stats_container_visits");
  let max_players = document.getElementById("game_stats_container_maxPlayers");
  let created = document.getElementById("game_stats_container_created");
  let updated = document.getElementById("game_stats_container_updated");

  let displayTooltip = function (e, obj) {
    tooltip = obj.dataset.tooltip;
    toolTipDiv.style.top = e.pageY + ($(window).scrollTop() * -1) + "px";
    toolTipDiv.style.left = e.pageX + "px";
    toolTipDiv.style.opacity = .95;

    // Game General Information  
    gameTitle.innerHTML = obj.dataset.tooltip.substring(obj.dataset.tooltip.indexOf("x01") + 3, obj.dataset.tooltip.indexOf("x02"));
    gameCreator.innerHTML = obj.dataset.tooltip.substring(obj.dataset.tooltip.indexOf("x02") + 3, obj.dataset.tooltip.indexOf("x03"));
    gameDescription.innerHTML = obj.dataset.tooltip.substring(obj.dataset.tooltip.indexOf("x03") + 3, obj.dataset.tooltip.indexOf("x04"));
    genre.innerHTML = obj.dataset.tooltip.substring(obj.dataset.tooltip.indexOf("x04") + 3, obj.dataset.tooltip.indexOf("x05"));
    lastUpdate.innerHTML = obj.dataset.tooltip.substring(obj.dataset.tooltip.indexOf("x05") + 3, obj.dataset.tooltip.indexOf("xEND"));

    // Game Rating Details
    scary.innerHTML = obj.dataset.tooltip.substring(obj.dataset.tooltip.indexOf("xR01") + 4, obj.dataset.tooltip.indexOf("xR02"));
    soundDesign.innerHTML = obj.dataset.tooltip.substring(obj.dataset.tooltip.indexOf("xR02") + 4, obj.dataset.tooltip.indexOf("xR03"));
    story.innerHTML = obj.dataset.tooltip.substring(obj.dataset.tooltip.indexOf("xR03") + 4, obj.dataset.tooltip.indexOf("xR04"));
    visuals.innerHTML = obj.dataset.tooltip.substring(obj.dataset.tooltip.indexOf("xR04") + 4, obj.dataset.tooltip.indexOf("xR05"));
    ambience.innerHTML = obj.dataset.tooltip.substring(obj.dataset.tooltip.indexOf("xR05") + 4, obj.dataset.tooltip.indexOf("xR06"));
    gameplay.innerHTML = obj.dataset.tooltip.substring(obj.dataset.tooltip.indexOf("xR06") + 4, obj.dataset.tooltip.indexOf("xR07"));
    creativity.innerHTML = obj.dataset.tooltip.substring(obj.dataset.tooltip.indexOf("xR07") + 4, obj.dataset.tooltip.indexOf("xR08"));
    enjoyment.innerHTML = obj.dataset.tooltip.substring(obj.dataset.tooltip.indexOf("xR08") + 4, obj.dataset.tooltip.indexOf("xR09"));
    productionQuality.innerHTML = obj.dataset.tooltip.substring(obj.dataset.tooltip.indexOf("xR09") + 4, obj.dataset.tooltip.indexOf("xR10"));
    technical.innerHTML = obj.dataset.tooltip.substring(obj.dataset.tooltip.indexOf("xR10") + 4, obj.dataset.tooltip.indexOf("xREND"));

    // Game Stats Display Text Update
    active.innerHTML = obj.dataset.tooltip.substring(obj.dataset.tooltip.indexOf("xSD01") + 5, obj.dataset.tooltip.indexOf("xSD02"));
    favorites.innerHTML = obj.dataset.tooltip.substring(obj.dataset.tooltip.indexOf("xSD02") + 5, obj.dataset.tooltip.indexOf("xSD03"));
    visits.innerHTML = obj.dataset.tooltip.substring(obj.dataset.tooltip.indexOf("xSD03") + 5, obj.dataset.tooltip.indexOf("xSD04"));
    max_players.innerHTML = obj.dataset.tooltip.substring(obj.dataset.tooltip.indexOf("xSD04") + 5, obj.dataset.tooltip.indexOf("xSD05"));
    created.innerHTML = obj.dataset.tooltip.substring(obj.dataset.tooltip.indexOf("xSD05") + 5, obj.dataset.tooltip.indexOf("xSD06"));
    updated.innerHTML = obj.dataset.tooltip.substring(obj.dataset.tooltip.indexOf("xSD06") + 5, obj.dataset.tooltip.indexOf("xSDEND"));
  };

  toolTipElements.forEach(function (elem) {
    elem.addEventListener("mouseenter", function (e) {
      displayTooltip(e, this);
    });
    elem.addEventListener("mouseleave", function (e) {
      toolTipDiv.style.top = "9999px";
      toolTipDiv.style.left = "9999px";
      toolTipDiv.style.opacity = 0;
    });
  });
};

window.addEventListener("click", () => {
  setUpTooltip();
});

function genreHTML(genreArray) {
  var genreHTMLString = "";

  genreArray = genreArray.sort();

  for (let i = 0; i < genreArray.length; i++) {
    switch (genreArray[i]) {
      case "Story":
        genreHTMLString += "<span class='tag green-bg'>Story</span>"
        break;
      case "Chapters":
        genreHTMLString += "<span class='tag purple-bg'>Chapters</span>"
        break;
      case "Minigame":
        genreHTMLString += "<span class='tag yellow-bg'>Minigame</span>"
        break;
      case "Misc":
        genreHTMLString += "<span class='tag dark-blue-bg'>Misc</span>"
        break;
      case "Myth":
        genreHTMLString += "<span class='tag pink-bg'>Myth</span>"
        break;
      case "Exploration":
        genreHTMLString += "<span class='tag dark-green-bg'>Exploration</span>"
        break;
      case "Port":
        genreHTMLString += "<span class='tag orange-bg'>Port</span>"
        break;
      case "Abstract":
        genreHTMLString += "<span class='tag abstract'>Abstract</span>"
        break;
      case "Survival Horror":
        genreHTMLString += "<span class='tag survival-horror'>Survival Horror</span>"
        break;
      case "Classic Horror":
        genreHTMLString += "<span class='tag classic-horror'>Classic Horror</span>"
        break;
      case "Remake":
        genreHTMLString += "<span class='tag' style='background-color: #5a7041;'>Remake</span>"
        break;
    }

    if (genreArray.length > 1 && i != genreArray.length - 1) genreHTMLString += " ";
  }

  return genreHTMLString;
}