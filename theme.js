/* =====================================================
   GLOBALER LIGHT- UND DARK-MODE
===================================================== */

const themeStorageKey = "webshopTheme";

const themeToggle =
    document.querySelector("#themeToggle");


/* =========================
   GESPEICHERTES THEME LADEN
========================= */

function getInitialTheme() {
    const savedTheme =
        localStorage.getItem(
            themeStorageKey
        );

    if (
        savedTheme === "light"
        || savedTheme === "dark"
    ) {
        return savedTheme;
    }

    return "light";
}


/* =========================
   THEME ANWENDEN
========================= */

function applyTheme(theme) {
    document.documentElement.setAttribute(
        "data-theme",
        theme
    );

    localStorage.setItem(
        themeStorageKey,
        theme
    );

    updateThemeButton(theme);
}


/* =========================
   BUTTON AKTUALISIEREN
========================= */

function updateThemeButton(theme) {
    if (!themeToggle) {
        return;
    }

    const darkModeActive =
        theme === "dark";

    themeToggle.textContent =
        darkModeActive
            ? "☀️"
            : "🌙";

    themeToggle.setAttribute(
        "aria-label",
        darkModeActive
            ? "Hellen Modus aktivieren"
            : "Dunklen Modus aktivieren"
    );

    themeToggle.setAttribute(
        "title",
        darkModeActive
            ? "Zum hellen Modus wechseln"
            : "Zum dunklen Modus wechseln"
    );

    themeToggle.setAttribute(
        "aria-pressed",
        String(darkModeActive)
    );
}


/* =========================
   THEME UMSCHALTEN
========================= */

function toggleTheme() {
    const currentTheme =
        document.documentElement
            .getAttribute("data-theme")
        || "light";

    const newTheme =
        currentTheme === "dark"
            ? "light"
            : "dark";

    applyTheme(newTheme);
}


/* =========================
   START
========================= */

const initialTheme =
    getInitialTheme();

applyTheme(initialTheme);


if (themeToggle) {
    themeToggle.addEventListener(
        "click",
        toggleTheme
    );
}