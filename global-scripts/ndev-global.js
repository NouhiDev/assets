// ░█▄─░█ ░█▀▀▄ ░█▀▀▀ ░█──░█ 　 ░█▀▀█ ░█─── ░█▀▀▀█ ░█▀▀█ ─█▀▀█ ░█─── 　 ───░█ ░█▀▀▀█ 
// ░█░█░█ ░█─░█ ░█▀▀▀ ─░█░█─ 　 ░█─▄▄ ░█─── ░█──░█ ░█▀▀▄ ░█▄▄█ ░█─── 　 ─▄─░█ ─▀▀▀▄▄ 
// ░█──▀█ ░█▄▄▀ ░█▄▄▄ ──▀▄▀─ 　 ░█▄▄█ ░█▄▄█ ░█▄▄▄█ ░█▄▄█ ░█─░█ ░█▄▄█ 　 ░█▄▄█ ░█▄▄▄█

// Global JavaScript for all sites on nouhi.dev

// ! Requires jQuery ! (https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js)

const NAV_URL = "https://nouhi.dev/assets/html-templates/navbar.txt";

$(window).on("load", async function () {
    $(".loader").fadeOut(1000);
    delay(1000).then(() => {
        $(".content").fadeIn(1000)
        setUpNavBar();
    });
});

function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

async function setUpNavBar() {
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