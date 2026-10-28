/* =====================================================
   WEBSHOP
   ZENTRALE KOMPONENTEN V2

   Aufgaben:
   - Header laden
   - Footer laden
   - Firmendaten aus config.js einsetzen
   - Logo laden
   - aktive Navigation markieren
   - Dark Mode steuern
   - aktuelles Jahr einsetzen
===================================================== */


/* =====================================================
   KOMPONENTE LADEN
===================================================== */

async function loadComponent(
    selector,
    fileName
) {

    const host =
        document.querySelector(selector);


    if (!host) {
        return;
    }


    try {

        const response =
            await fetch(
                `components/${fileName}`
            );


        if (!response.ok) {

            throw new Error(
                `${fileName} konnte nicht geladen werden.`
            );

        }


        host.innerHTML =
            await response.text();

    }
    catch (error) {

        console.error(error);


        host.innerHTML = `
            <div class="component-error">
                Gemeinsamer Seitenbereich konnte
                nicht geladen werden.
            </div>
        `;

    }

}


/* =====================================================
   KONFIGURATION PRÜFEN
===================================================== */

function getShopConfig() {

    if (
        typeof SHOP_CONFIG === "undefined"
    ) {

        console.warn(
            "SHOP_CONFIG wurde nicht gefunden. " +
            "Prüfe, ob js/config.js vor " +
            "js/components.js eingebunden ist."
        );


        return {
            companyName: "[FIRMENNAME]",
            slogan: "[SLOGAN]",
            logo: "",
            phone: "[TELEFONNUMMER]",
            email: "[E-MAIL-ADRESSE]"
        };

    }


    return SHOP_CONFIG;

}


/* =====================================================
   TEXTWERTE AUS CONFIG.JS EINSETZEN
===================================================== */

function applyTextConfiguration() {

    const config =
        getShopConfig();


    document
        .querySelectorAll("[data-config]")
        .forEach(element => {

            const configKey =
                element.dataset.config;


            const configValue =
                config[configKey];


            if (
                configValue !== undefined &&
                configValue !== null
            ) {

                element.textContent =
                    configValue;

            }

        });

}


/* =====================================================
   LOGO AUS CONFIG.JS EINSETZEN
===================================================== */

function applyLogoConfiguration() {

    const config =
        getShopConfig();


    const logoImages =
        document.querySelectorAll(
            '[data-config-image="logo"]'
        );


    const logoPlaceholders =
        document.querySelectorAll(
            "[data-logo-placeholder]"
        );


    logoImages.forEach(image => {

        const logoPath =
            String(
                config.logo || ""
            ).trim();


        /*
           Solange kein echtes Logo eingetragen ist,
           bleibt der Platzhalter sichtbar.
        */

        if (
            !logoPath ||
            logoPath.includes("[")
        ) {

            image.hidden = true;

            logoPlaceholders.forEach(
                placeholder => {

                    placeholder.hidden = false;

                }
            );


            return;

        }


        /*
           Bildquelle und Alternativtext einsetzen.
        */

        image.src =
            logoPath;


        image.alt =
            config.companyName ||
            "Firmenlogo";


        /*
           Logo erst zeigen, wenn die Bilddatei
           erfolgreich geladen wurde.
        */

        image.addEventListener(
            "load",
            () => {

                image.hidden = false;


                logoPlaceholders.forEach(
                    placeholder => {

                        placeholder.hidden = true;

                    }
                );

            },
            {
                once: true
            }
        );


        /*
           Falls die Bilddatei nicht gefunden wird,
           bleibt der Platzhalter sichtbar.
        */

        image.addEventListener(
            "error",
            () => {

                image.hidden = true;


                logoPlaceholders.forEach(
                    placeholder => {

                        placeholder.hidden = false;

                    }
                );


                console.warn(
                    `Logo konnte nicht geladen werden: ${logoPath}`
                );

            },
            {
                once: true
            }
        );

    });

}


/* =====================================================
   KONTAKTLINKS AUS CONFIG.JS EINSETZEN

   Vorbereitet für spätere Elemente mit:

   data-config-link="phone"
   data-config-link="email"
===================================================== */

function applyLinkConfiguration() {

    const config =
        getShopConfig();


    document
        .querySelectorAll(
            "[data-config-link]"
        )
        .forEach(link => {

            const configKey =
                link.dataset.configLink;


            const configValue =
                String(
                    config[configKey] || ""
                ).trim();


            if (!configValue) {
                return;
            }


            if (
                configKey === "email"
            ) {

                link.href =
                    `mailto:${configValue}`;

                link.textContent =
                    configValue;

            }


            if (
                configKey === "phone"
            ) {

                const phoneLinkValue =
                    configValue.replace(
                        /[^+\d]/g,
                        ""
                    );


                link.href =
                    `tel:${phoneLinkValue}`;

                link.textContent =
                    configValue;

            }

        });

}


/* =====================================================
   AKTUELLES JAHR IM FOOTER
===================================================== */

function updateFooterYear() {

    const footerYear =
        document.querySelector(
            "#footerYear"
        );


    if (!footerYear) {
        return;
    }


    footerYear.textContent =
        new Date().getFullYear();

}


/* =====================================================
   AKTIVE NAVIGATION
===================================================== */

function markActiveNavigation() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop() ||
        "index.html";


    document
        .querySelectorAll(
            "[data-nav-page]"
        )
        .forEach(link => {

            let isActive =
                link.dataset.navPage ===
                currentPage;


            /* =========================================
               ABHOLBEREICH
            ========================================== */

            if (
                link.dataset.navGroup ===
                    "pickup" &&
                currentPage ===
                    "abholsortiment.html"
            ) {

                isActive = true;

            }


            /* =========================================
               SPÄTERER VERSANDBEREICH

               Weitere Versand-Unterseiten können hier
               später ergänzt werden.
            ========================================== */

            if (
                link.dataset.navGroup ===
                    "shipping" &&
                currentPage ===
                    "versandsortiment.html"
            ) {

                isActive = true;

            }


            link.classList.toggle(
                "active-link",
                isActive
            );


            if (isActive) {

                link.setAttribute(
                    "aria-current",
                    "page"
                );

            }
            else {

                link.removeAttribute(
                    "aria-current"
                );

            }

        });

}


/* =====================================================
   DARK MODE
===================================================== */

function initializeThemeToggle() {

    const button =
        document.querySelector(
            "#themeToggle"
        );


    if (!button) {
        return;
    }


    const savedTheme =
        localStorage.getItem(
            "webshopTheme"
        ) ||
        document.documentElement
            .dataset.theme ||
        "light";


    document.documentElement
        .dataset.theme =
        savedTheme;


    function updateThemeButton() {

        const isDark =
            document.documentElement
                .dataset.theme ===
            "dark";


        button.textContent =
            isDark
                ? "☀️"
                : "🌙";


        button.setAttribute(
            "aria-label",
            isDark
                ? "Hellen Modus aktivieren"
                : "Dunklen Modus aktivieren"
        );


        button.setAttribute(
            "title",
            isDark
                ? "Hellen Modus aktivieren"
                : "Dunklen Modus aktivieren"
        );

    }


    updateThemeButton();


    button.addEventListener(
        "click",
        () => {

            const currentTheme =
                document.documentElement
                    .dataset.theme;


            const nextTheme =
                currentTheme === "dark"
                    ? "light"
                    : "dark";


            document.documentElement
                .dataset.theme =
                nextTheme;


            localStorage.setItem(
                "webshopTheme",
                nextTheme
            );


            updateThemeButton();

        }
    );

}


/* =====================================================
   ALLE SHOPDATEN EINSETZEN
===================================================== */

function applyShopConfiguration() {

    applyTextConfiguration();

    applyLogoConfiguration();

    applyLinkConfiguration();

    updateFooterYear();

}


/* =====================================================
   KOMPONENTEN INITIALISIEREN
===================================================== */

async function initializeSharedComponents() {

    /*
       Header und Footer gleichzeitig laden.
    */

    await Promise.all([

        loadComponent(
            "#siteHeader",
            "header.html"
        ),

        loadComponent(
            "#siteFooter",
            "footer.html"
        )

    ]);


    /*
       Nach dem Laden stehen die Elemente im DOM
       und können eingerichtet werden.
    */

    applyShopConfiguration();

    markActiveNavigation();

    initializeThemeToggle();


    /*
       Andere Seitenskripte können auf dieses Ereignis
       reagieren, wenn sie zum Beispiel den Warenkorb-
       Zähler nach dem Laden aktualisieren müssen.
    */

    document.dispatchEvent(
        new CustomEvent(
            "sharedComponentsLoaded"
        )
    );

}


/* =====================================================
   START
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    initializeSharedComponents
);