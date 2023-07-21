// ░█▄─░█ ░█▀▀▄ ░█▀▀▀ ░█──░█ 　 ░█▀▀█ ░█─── ░█▀▀▀█ ░█▀▀█ ─█▀▀█ ░█─── 　 ───░█ ░█▀▀▀█ 
// ░█░█░█ ░█─░█ ░█▀▀▀ ─░█░█─ 　 ░█─▄▄ ░█─── ░█──░█ ░█▀▀▄ ░█▄▄█ ░█─── 　 ─▄─░█ ─▀▀▀▄▄ 
// ░█──▀█ ░█▄▄▀ ░█▄▄▄ ──▀▄▀─ 　 ░█▄▄█ ░█▄▄█ ░█▄▄▄█ ░█▄▄█ ░█─░█ ░█▄▄█ 　 ░█▄▄█ ░█▄▄▄█

// Global JavaScript for all sites on nouhi.dev

const NAV_URL = "https://nouhi.dev/assets/html-templates/navbar.txt";

function addGlobalCSS() {
    var css = document.createElement("link");
    css.rel = "stylesheet";
    css.type = "text/css";
    css.href = "https://nouhi.dev/assets/global-styles/ndev-global.css";
    document.head.appendChild(css);
}

addGlobalCSS();

if (typeof jQuery === "undefined") {
    var script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js";

    script.onload = function () {
        $(document).ready(function () {
            init()
        });
    };

    document.head.appendChild(script);
} else {
    $(document).ready(function () {
        init();
    });
}

function init() {
    usageDisplay();

    setUpLoader();

    $(".loader").fadeOut(1000);
    delay(1000).then(() => {
        $(".content").fadeIn(1000)
        setUpNavBar();
    });
}

function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

async function setUpNavBar() {
    if (!document.getElementsByTagName("header")[0]) {
        console.log("No header present in the document's body. Creating one now...")
        var header = document.createElement("header");
        document.body.appendChild(header);
    }

    try {
        const response = await fetch(NAV_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch the navbar from NDev Assets.");
        }
        const t = await response.text();
        var whereToInject = document.getElementsByTagName("header")[0];
        whereToInject.innerHTML += t;
    } catch (error) {
        console.error("Could not set up the navbar!", error);
    }
}

async function setUpLoader() {
    const loaderHTML = `
        <div class="loader">
        <div class="cube">
            ${Array.from({ length: 6 }, () => '<div class="side"></div>').join('')}
        </div>
        </div>
    `;

    $('body').append(loaderHTML);
}

async function usageDisplay() {
    console.log(`                                                                                         
    #    # #####  ###### #    #     ####  #       ####  #####    ##   #              #  ####  
    ##   # #    # #      #    #    #    # #      #    # #    #  #  #  #              # #      
    # #  # #    # #####  #    #    #      #      #    # #####  #    # #              #  ####  
    #  # # #    # #      #    #    #  ### #      #    # #    # ###### #              #      # 
    #   ## #    # #       #  #     #    # #      #    # #    # #    # #         #    # #    # 
    #    # #####  ######   ##       ####  ######  ####  #####  #    # ######     ####   ####  

    Learn more at

    https://nouhi.dev/ndev-assets-docs/.
    `);
}