const liczby = document.querySelector(".liczby");
const start = document.querySelector(".start");
const dzik = document.querySelector(".dzik");
const worek = document.querySelector(".money-bag");
const pasekCzasu = document.querySelector(".timer-fill");
const etykietaProcentowa = document.querySelector(".timer-percent-label");
const serca = [...document.querySelectorAll(".life")];
const wynikElement = document.querySelector(".score-value");

let interwal = null;
let wyswietlanaLiczba = 1;
let czasNaKlikniecie = 2000;
let poczatekCzasu = 0;
let pozostaleZycia = serca.length;
let wynik = 0;

function czyTrzebaKliknac(liczba) {
    return liczba % 7 === 0 || String(liczba).includes("7");
}

function koniecGry() {
    clearInterval(interwal);
    interwal = null;
    liczby.textContent = "Game Over!";
    start.classList.remove("disabled");
}

function aktualizujWynik() {
    wynik++;
    wynikElement.textContent = wynik;
}

function stracZycie() {
    const indeksSerca = pozostaleZycia - 1;
    const serce = serca[indeksSerca];

    pozostaleZycia--;
    serce.classList.add("breaking");
    window.setTimeout(function () {
        serce.textContent = "🖤";
        serce.classList.remove("breaking");
    }, 380);

    if (pozostaleZycia === 0) {
        koniecGry();
        return false;
    }

    return true;
}

function nastepnaLiczba() {
    if (wyswietlanaLiczba % 10 === 0) {
        czasNaKlikniecie *= 0.9;
    }

    wyswietlanaLiczba++;
    liczby.textContent = wyswietlanaLiczba;
    poczatekCzasu = Date.now();
    pasekCzasu.style.transform = "scaleY(0)";
    etykietaProcentowa.textContent = "0%";
}

function animujWrzutke() {
    const prostokatDzik = dzik.getBoundingClientRect();
    const prostokatWorek = worek.getBoundingClientRect();
    const worekWejscieX = prostokatWorek.left + prostokatWorek.width / 2;
    const worekWejscieY = prostokatWorek.top + prostokatWorek.height * 0.22;

    for (let i = 0; i < 4; i++) {
        const startX = prostokatDzik.left + prostokatDzik.width / 2 - 19 + (Math.random() - 0.5) * 50;
        const startY = prostokatDzik.top + prostokatDzik.height / 2 - 19 + (Math.random() - 0.5) * 30;
        const celX = worekWejscieX - 19 + (Math.random() - 0.5) * 36;
        const celY = worekWejscieY - 19 + (Math.random() - 0.5) * 14;
        const moneta = document.createElement("img");

        moneta.className = "money-coin";
        moneta.src = "foto/coin.png";
        moneta.alt = "";
        moneta.style.left = `${startX}px`;
        moneta.style.top = `${startY}px`;
        const obrot = 720 + Math.random() * 720;
        moneta.style.setProperty("--mid-x", `${(celX - startX) * 0.52}px`);
        moneta.style.setProperty("--arc-height", `${-130 - Math.random() * 100}px`);
        moneta.style.setProperty("--near-x", `${(celX - startX) * 0.82}px`);
        moneta.style.setProperty("--near-y", `${celY - startY - 25}px`);
        moneta.style.setProperty("--end-x", `${celX - startX}px`);
        moneta.style.setProperty("--end-y", `${celY - startY}px`);
        moneta.style.setProperty("--mid-spin", `${obrot * 0.55}deg`);
        moneta.style.setProperty("--spin", `${obrot}deg`);
        moneta.style.setProperty("--final-spin", `${obrot + 360}deg`);
        moneta.style.animationDelay = `${i * 110}ms`;
        document.body.append(moneta);
        moneta.addEventListener("animationend", function () {
            moneta.remove();
            worek.classList.remove("shake");
            void worek.offsetWidth;
            worek.classList.add("shake");
            worek.addEventListener("animationend", function () {
                worek.classList.remove("shake");
            }, { once: true });
        }, { once: true });
    }
}

dzik.addEventListener("click", function () {
    if (interwal === null) return;

    if (czyTrzebaKliknac(wyswietlanaLiczba)) {
        animujWrzutke();
        aktualizujWynik();
        nastepnaLiczba();
    } else {
        if (stracZycie()) nastepnaLiczba();
    }
});

start.addEventListener("click", function () {
    if (interwal !== null) return;

    wyswietlanaLiczba = 1;
    czasNaKlikniecie = 2000;
    pozostaleZycia = serca.length;
    wynik = 0;
    wynikElement.textContent = wynik;
    serca.forEach(function (serce) {
        serce.textContent = "❤️";
        serce.classList.remove("breaking");
    });
    liczby.textContent = wyswietlanaLiczba;
    start.classList.add("disabled");
    poczatekCzasu = Date.now();
    pasekCzasu.style.transform = "scaleY(0)";
    etykietaProcentowa.textContent = "0%";

    interwal = setInterval(function () {
        const uplynelo = Date.now() - poczatekCzasu;
        const pozostalo = Math.max(0, czasNaKlikniecie - uplynelo);
        const udzialWykorzystanegoCzasu = 1 - pozostalo / czasNaKlikniecie;
        pasekCzasu.style.transform = `scaleY(${udzialWykorzystanegoCzasu})`;
        etykietaProcentowa.textContent = `${Math.floor(udzialWykorzystanegoCzasu * 100)}%`;

        if (pozostalo > 0) return;

        if (czyTrzebaKliknac(wyswietlanaLiczba)) {
            stracZycie();
            if (interwal !== null) nastepnaLiczba();
        } else {
            animujWrzutke();
            aktualizujWynik();
            nastepnaLiczba();
        }
    }, 30);
});