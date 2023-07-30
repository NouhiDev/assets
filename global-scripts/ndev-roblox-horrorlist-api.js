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
    databaseData: [],
    gameData: [],
    gameIconData: [],
};

window.onload = function () {
    checkstatus();
    usageDisplay();
    fetchData()
    $('header').hide();
};

async function fetchData() {
    const table = document.getElementById("table-to-populate");
    const elem = document.getElementById("myBar");

    const databaseDataResponse = await fetch(
        "https://nouhi.dev/roblox-horrorlist/database.json"
    );
    data.databaseData = await databaseDataResponse.json();

    gameUIDS = [];

    for (let i = 0; i < data.databaseData.games.length; i++) {
        const element = data.databaseData.games[i];
        if (element.ambience !== "") gameUIDS.push(element.uid);
    }

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

    let gameDataFromAPI = [];
    let gameIconDataFromAPI = [];

    data.gameData.forEach((item, index) => {
        gameDataFromAPI.push(...item.data);
        gameIconDataFromAPI.push(...data.gameIconData[index]?.data || []);
    });

    for (let i = 0; i < gameUIDS.length; i++) {
        var row = ` <tr class="hover-reveal">
          <td data-th="Placement">${i + 1}.</td>
          <td data="Icon"><img class="game-icon" src="${gameIconDataFromAPI[i].imageUrl}"></td>
          <td data-th="Title" class="game-title"><a href="#" class="game-href" onclick="loadGame(
            ${i + 1}, 
            ${gameUIDS[i]})">${gameDataFromAPI[i].name}</a></td>
          <td data-th="Creator" class="align-left">${JSON.parse(
            JSON.stringify(gameDataFromAPI[i].creator)
        ).name}</td>
          <td data-th="Rating" class="align-left">${data.databaseData.games[i].ratings.rating}</td>
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

    document.getElementsByTagName("footer")[0].style.bottom = "auto";
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

function githubButton() {
    window.open("https://github.com/NouhiDev/roblox-horrorlist", "_blank");
}

function youtubeButton() {
    window.open("https://www.youtube.com/@robloxhorrorlist", "_blank");
}

function discordButton() {
    window.open("https://discord.gg/Zbxst3g4ts", "_blank");
}

function twitterButton() {
    window.open("https://twitter.com/RBLXHorrorlist", "_blank");
}

function loadGame(number, UID) {
    localStorage.setItem('number', number);
    localStorage.setItem('UID', UID);
    window.open('./pages/game.html', '_blank');
    // window.location.href = './pages/game.html';
}

var cantReachAPI = false;

function addStatusButton() {
    if (!cantReachAPI) {
        cantReachAPI = true;

        // Create a new button element
        var button = document.createElement("button");
        button.className = "status-button";
        button.onclick = api_status;
    
        // Create the icon element and add it to the button
        var icon = document.createElement("i");
        icon.className = "fas fa-spinner";
        button.appendChild(icon);
    
        // Add text to the button
        var buttonText = document.createTextNode(" Check API Status");
        button.appendChild(buttonText);
    
        // Get the "button-container" div
        var buttonContainer = document.getElementsByClassName("button-container")[0];
    
        // Append the button to the "button-container" div
        buttonContainer.appendChild(button);
    }
}

function checkstatus() {
    const url = "https://ndevapi.com";
    const statusElement = document.querySelector(".status");
    const responseTimeElement = document.querySelector(".response-time");

    // Create an XMLHttpRequest object
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log("Successfully established a connection with the NDev API.");
                }
            } else {
                addStatusButton();
            }
        }

    xhr.open("GET", url, true);
    xhr.send();
}