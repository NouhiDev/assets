// ░█▄─░█ ░█▀▀▄ ░█▀▀▀ ░█──░█ 　 ░█▀▀█ ░█─── ░█▀▀▀█ ░█▀▀█ ─█▀▀█ ░█─── 　 ───░█ ░█▀▀▀█ 
// ░█░█░█ ░█─░█ ░█▀▀▀ ─░█░█─ 　 ░█─▄▄ ░█─── ░█──░█ ░█▀▀▄ ░█▄▄█ ░█─── 　 ─▄─░█ ─▀▀▀▄▄ 
// ░█──▀█ ░█▄▄▀ ░█▄▄▄ ──▀▄▀─ 　 ░█▄▄█ ░█▄▄█ ░█▄▄▄█ ░█▄▄█ ░█─░█ ░█▄▄█ 　 ░█▄▄█ ░█▄▄▄█

// Global JavaScript for all sites on nouhi.dev

// ! Requires jQuery ! (https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js)

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

function setUpNavBar() {
    fetch(NAV_URL)
    .then( r => r.text() )
    .then( t => {
        var whereToInject = document.getElementsByTagName("header")[0];
        whereToInject.innerHTML += t;
    });
}