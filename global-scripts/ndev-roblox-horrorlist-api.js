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

const CACHE_PREFIX = "gameDataCache_";
const CACHE_EXPIRATION = 2592000000;
const DB_NAME = "gameDataDB";
const DB_VERSION = 1;
let db;

async function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = event => reject(event.target.error);
        request.onsuccess = event => resolve(event.target.result);
        request.onupgradeneeded = event => {
            const db = event.target.result;
            db.createObjectStore("gameDataCache", { keyPath: "cacheKey" });
        };
    });
}

async function saveToCache(cacheKey, data) {
    const transaction = db.transaction(["gameDataCache"], "readwrite");
    const store = transaction.objectStore("gameDataCache");
    const cacheData = { cacheKey, data, timestamp: Date.now() };
    store.put(cacheData);
    await transaction.complete;
}

async function fetchFromCache(cacheKey) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["gameDataCache"], "readonly");
        const store = transaction.objectStore("gameDataCache");
        const request = store.get(cacheKey);
        request.onsuccess = event => resolve(event.target.result);
        request.onerror = event => reject(event.target.error);
    });
}

async function fetchData(endpoint, cacheKey) {
    const cachedData = await fetchFromCache(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRATION) {
        return cachedData.data;
    }

    const response = await fetch(endpoint);
    const freshData = await response.json();
    await saveToCache(cacheKey, freshData);
    return freshData;
}

window.onload = async function () {
    usageDisplay();
    $('header').hide();
    await fetchDataAndUpdateUI();
};

async function fetchDataAndUpdateUI() {
    try {
        const table = document.getElementById("table-to-populate");
        const mobileTable = document.getElementById("mobile-table-to-populate");
        const elem = document.getElementById("myBar");

        db = await openDB();

        const databaseDataResponse = await fetch("https://robloxhorrorlist.com/weights-database.json");
        const databaseData = await databaseDataResponse.json();

        const gameUIDS = databaseData.games
            .filter(element => element.ambience !== "")
            .map(element => element.uid);

        const chunks = [];
        for (let i = 0; i < gameUIDS.length; i += maxUIDChunkSize) {
            chunks.push(gameUIDS.slice(i, i + maxUIDChunkSize));
        }

        const fetchGameDataPromises = chunks.map(chunk =>
            fetchData(`${API_BASE_URL}/game-info/${chunk.join(",")}`, `gameData_${chunk.join(",")}`)
        );

        const fetchIconDataPromises = chunks.map(chunk =>
            fetchData(`${API_BASE_URL}/game-icon/${chunk.join(",")}`, `gameIconData_${chunk.join(",")}`)
        );

        const [gameDataResponses, iconDataResponses] = await Promise.all([
            Promise.all(fetchGameDataPromises),
            Promise.all(fetchIconDataPromises),
        ]);

        const gameDataFromAPI = gameDataResponses.flat()
            .map(item => item.data)
            .flat();

        const gameIconDataFromAPI = iconDataResponses.flat()
            .map(item => item.data)
            .flat();


        let totalRatings = 0;
        const numGames = databaseData.games.length;

        for (const game of databaseData.games) {
            const rating = parseFloat(game.ratings.rating);
            totalRatings += rating;
        }

        const averageRating = totalRatings / numGames;

        const fragment = document.createDocumentFragment();

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            document.getElementsByClassName("mobile-table-container")[0].style.display = "block";
            document.getElementsByClassName("table-container")[0].style.display = "none";
            for (let i = 0; i < gameUIDS.length; i++) {
                try {
                    let differenceToAverageRating = Math.abs((parseFloat(databaseData.games[i].ratings.rating) - averageRating)).toFixed(1);
                    let spanHTML = "";
                    if (differenceToAverageRating < 0) spanHTML = `<span style="color: red; font-size: 10px;">-${differenceToAverageRating}↓</span> `;
                    else spanHTML = `<span style="color: green; font-size: 10px;">${differenceToAverageRating}↑</span> `;
                    if (differenceToAverageRating == 0) spanHTML = `<span style="color: gray; font-size: 10px;">${differenceToAverageRating}-</span> `;

                    var row = ` <tr class="hover-reveal">
                      <td data-th="Placement">${i + 1}.</td>
                      <td data="Icon"><img class="game-icon" src="${gameIconDataFromAPI[i].imageUrl}"></td>
                      <td data-th="Title" class="game-title"><a href="#" class="game-href" onclick="loadGame(
                        ${i + 1}, 
                        ${gameUIDS[i]})">${gameDataFromAPI[i].name}</a></td>
                      <td data-th="Rating" class="align-left">${databaseData.games[i].ratings.rating}  ${spanHTML}</td>
                      </tr>`;

                    const rowElement = document.createElement('tr');
                    rowElement.innerHTML = row;
                    fragment.appendChild(rowElement);
                } catch (e) {
                    console.error(e);
                }
            }
            mobileTable.appendChild(fragment);

            elem.style.width = "100%";

            await delay(500);

            $('header').show();
            document.getElementById("myProgress").style.display = "none";

            // Generate Table after populating it
            $("#game-table").DataTable({
                columnDefs: [{ orderable: false, targets: [1, 3] }],
                responsive: true
            });
        }
        else {

            for (let i = 0; i < gameUIDS.length; i++) {
                try {
                    let differenceToAverageRating = Math.abs((parseFloat(databaseData.games[i].ratings.rating) - averageRating)).toFixed(1);
                    let spanHTML = "";
                    if (differenceToAverageRating < 0) spanHTML = `<span style="color: red; font-size: 10px;">-${differenceToAverageRating}↓</span> `;
                    else spanHTML = `<span style="color: green; font-size: 10px;">${differenceToAverageRating}↑</span> `;
                    if (differenceToAverageRating == 0) spanHTML = `<span style="color: gray; font-size: 10px;">${differenceToAverageRating}-</span> `;

                    var row = ` <tr class="hover-reveal">
                    <td data-th="Placement">${i + 1}.</td>
                    <td data="Icon"><img class="game-icon" src="${gameIconDataFromAPI[i].imageUrl}"></td>
                    <td data-th="Title" class="game-title"><a href="#" class="game-href" onclick="loadGame(
                        ${i + 1}, 
                        ${gameUIDS[i]})">${gameDataFromAPI[i].name}</a></td>
                    <td data-th="Creator" class="align-left">${JSON.parse(
                        JSON.stringify(gameDataFromAPI[i].creator)
                    ).name}</td>
                    <td data-th="Rating" class="align-left">${databaseData.games[i].ratings.rating}  ${spanHTML}</td>
                    </tr>`;

                    const rowElement = document.createElement('tr');
                    rowElement.innerHTML = row;
                    fragment.appendChild(rowElement);
                } catch (e) {
                    console.error(e);
                }
            }
            table.appendChild(fragment);

            elem.style.width = "100%";

            await delay(500);

            $('header').show();
            document.getElementById("myProgress").style.display = "none";

            // Generate Table after populating it
            $("#game-table").DataTable({
                columnDefs: [{ orderable: false, targets: [1, 4] }],
                responsive: true
            });

            // var htmlToAdd = `
            //     <button class="filter-button" onclick="filtered()">
            //         <i class="fas fa-filter"></i> Filter
            //     </button>
            //     `;

            // var gameTableFilter = document.getElementById("game-table_filter");
            // if (gameTableFilter) {
            //     gameTableFilter.innerHTML += htmlToAdd;
            // } else {
            //     console.error("Element with id 'game-table_filter' not found.");
            // }
        }

        document.getElementsByTagName("footer")[0].style.bottom = "auto";

        const elementToRemove = document.getElementById("myProgressText");
        if (elementToRemove) {
            elementToRemove.parentNode.removeChild(elementToRemove);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }

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
}