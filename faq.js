/* =====================================================
   WEBSHOP PROTOTYP
   FAQ V2

   Funktionen:
   - FAQ öffnen und schließen
   - immer nur eine Frage gleichzeitig öffnen
   - Kategorien filtern
   - FAQ durchsuchen
   - Suchergebnisse zählen
   - Suche zurücksetzen
   - ESC zum Leeren der Suche
   - Kategorie über URL-Hash öffnen
===================================================== */


/* =====================================================
   HTML-ELEMENTE
===================================================== */

const faqItems =
    Array.from(
        document.querySelectorAll(
            ".faq-item"
        )
    );

const faqCategories =
    Array.from(
        document.querySelectorAll(
            ".faq-category"
        )
    );

const filterButtons =
    Array.from(
        document.querySelectorAll(
            ".filter-button"
        )
    );

const faqSearch =
    document.querySelector(
        "#faqSearch"
    );

const clearFaqSearch =
    document.querySelector(
        "#clearFaqSearch"
    );

const faqSearchResult =
    document.querySelector(
        "#faqSearchResult"
    );

const faqEmptyState =
    document.querySelector(
        "#faqEmptyState"
    );


/* =====================================================
   GRUNDPRÜFUNG
===================================================== */

const requiredElementsAvailable =
    faqItems.length > 0
    && faqCategories.length > 0
    && filterButtons.length > 0
    && faqSearch
    && clearFaqSearch
    && faqSearchResult
    && faqEmptyState;


if (!requiredElementsAvailable) {

    console.error(
        "Die FAQ-Seite konnte nicht vollständig "
        + "gestartet werden. Mindestens ein "
        + "benötigtes HTML-Element fehlt."
    );

}


/* =====================================================
   AKTIVE KATEGORIE
===================================================== */

let activeCategory =
    "all";


/* =====================================================
   TEXT NORMALISIEREN
===================================================== */

function normalizeText(value) {

    return String(value)
        .toLocaleLowerCase("de-DE")
        .trim()
        .replaceAll("ä", "ae")
        .replaceAll("ö", "oe")
        .replaceAll("ü", "ue")
        .replaceAll("ß", "ss");

}


/* =====================================================
   FAQ-ANTWORT ERMITTELN
===================================================== */

function getFaqAnswer(item) {

    return item.querySelector(
        ".faq-answer"
    );

}


/* =====================================================
   FAQ-FRAGE ERMITTELN
===================================================== */

function getFaqQuestion(item) {

    return item.querySelector(
        ".faq-question"
    );

}


/* =====================================================
   FAQ-PLUS/MINUS ERMITTELN
===================================================== */

function getFaqToggle(item) {

    return item.querySelector(
        ".faq-toggle"
    );

}


/* =====================================================
   FRAGE ÖFFNEN
===================================================== */

function openFaqItem(item) {

    if (!item) {
        return;
    }


    const question =
        getFaqQuestion(item);

    const answer =
        getFaqAnswer(item);

    const toggle =
        getFaqToggle(item);


    if (
        !question
        || !answer
    ) {
        return;
    }


    item.classList.add(
        "open"
    );


    answer.hidden =
        false;


    question.setAttribute(
        "aria-expanded",
        "true"
    );


    if (toggle) {

        toggle.textContent =
            "−";

    }

}


/* =====================================================
   FRAGE SCHLIESSEN
===================================================== */

function closeFaqItem(item) {

    if (!item) {
        return;
    }


    const question =
        getFaqQuestion(item);

    const answer =
        getFaqAnswer(item);

    const toggle =
        getFaqToggle(item);


    if (
        !question
        || !answer
    ) {
        return;
    }


    item.classList.remove(
        "open"
    );


    answer.hidden =
        true;


    question.setAttribute(
        "aria-expanded",
        "false"
    );


    if (toggle) {

        toggle.textContent =
            "+";

    }

}


/* =====================================================
   ALLE FRAGEN SCHLIESSEN
===================================================== */

function closeAllFaqItems(
    exceptItem = null
) {

    faqItems.forEach(
        item => {

            if (
                item !== exceptItem
            ) {

                closeFaqItem(item);

            }

        }
    );

}


/* =====================================================
   FRAGE UMSCHALTEN
===================================================== */

function toggleFaqItem(item) {

    const isOpen =
        item.classList.contains(
            "open"
        );


    if (isOpen) {

        closeFaqItem(item);

        return;

    }


    /*
       Für eine übersichtliche Bedienung bleibt
       immer nur eine FAQ gleichzeitig geöffnet.
    */

    closeAllFaqItems(
        item
    );


    openFaqItem(item);

}


/* =====================================================
   FAQ-KLICKS
===================================================== */

faqItems.forEach(
    item => {

        const question =
            getFaqQuestion(item);


        if (!question) {
            return;
        }


        question.addEventListener(
            "click",
            () => {

                toggleFaqItem(
                    item
                );

            }
        );

    }
);


/* =====================================================
   KATEGORIE EINES FAQ-EINTRAGS
===================================================== */

function getItemCategory(item) {

    const categorySection =
        item.closest(
            ".faq-category"
        );


    if (!categorySection) {

        return "";

    }


    return String(
        categorySection.dataset.category
        || ""
    );

}


/* =====================================================
   KATEGORIE AUSWÄHLEN
===================================================== */

function setCategory(category) {

    const availableCategories =
        new Set(
            faqCategories.map(
                section =>
                    section.dataset.category
            )
        );


    activeCategory =
        (
            category === "all"
            || availableCategories.has(
                category
            )
        )
            ? category
            : "all";


    filterButtons.forEach(
        button => {

            const isActive =
                button.dataset.category
                === activeCategory;


            button.classList.toggle(
                "active",
                isActive
            );


            button.setAttribute(
                "aria-pressed",
                String(isActive)
            );

        }
    );


    closeAllFaqItems();

    applyFilters();

}


/* =====================================================
   FILTERBUTTONS
===================================================== */

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const category =
                    button.dataset.category
                    || "all";


                setCategory(
                    category
                );

            }
        );

    }
);


/* =====================================================
   SUCHTEXT EINES FAQ-EINTRAGS
===================================================== */

function getFaqSearchText(item) {

    return normalizeText(
        item.textContent
        || ""
    );

}


/* =====================================================
   FAQ FILTERN
===================================================== */

function applyFilters() {

    if (
        !requiredElementsAvailable
    ) {
        return;
    }


    const searchTerm =
        normalizeText(
            faqSearch.value
        );


    let visibleItemCount =
        0;


    faqCategories.forEach(
        categorySection => {

            const category =
                categorySection
                    .dataset
                    .category;


            const categoryAllowed =
                activeCategory === "all"
                || category
                    === activeCategory;


            let visibleItemsInCategory =
                0;


            const items =
                Array.from(
                    categorySection.querySelectorAll(
                        ".faq-item"
                    )
                );


            items.forEach(
                item => {

                    const matchesSearch =
                        searchTerm === ""
                        || getFaqSearchText(
                            item
                        ).includes(
                            searchTerm
                        );


                    const visible =
                        categoryAllowed
                        && matchesSearch;


                    item.hidden =
                        !visible;


                    if (!visible) {

                        closeFaqItem(item);

                    } else {

                        visibleItemsInCategory +=
                            1;

                        visibleItemCount +=
                            1;

                    }

                }
            );


            categorySection.hidden =
                !categoryAllowed
                || visibleItemsInCategory === 0;

        }
    );


    faqEmptyState.hidden =
        visibleItemCount !== 0;


    updateSearchResult(
        visibleItemCount,
        searchTerm
    );

}


/* =====================================================
   SUCHERGEBNIS ANZEIGEN
===================================================== */

function updateSearchResult(
    resultCount,
    searchTerm
) {

    if (!faqSearchResult) {
        return;
    }


    if (searchTerm === "") {

        faqSearchResult.textContent =
            "";

        return;

    }


    if (resultCount === 0) {

        faqSearchResult.textContent =
            "Keine passenden Antworten gefunden.";

        return;

    }


    if (resultCount === 1) {

        faqSearchResult.textContent =
            "1 passende Antwort gefunden.";

        return;

    }


    faqSearchResult.textContent =
        `${resultCount} passende Antworten gefunden.`;

}


/* =====================================================
   SUCHFELD
===================================================== */

if (faqSearch) {

    faqSearch.addEventListener(
        "input",
        () => {

            clearFaqSearch.hidden =
                faqSearch.value.trim()
                === "";


            applyFilters();

        }
    );

}


/* =====================================================
   SUCHE LEEREN
===================================================== */

function clearSearch() {

    if (!faqSearch) {
        return;
    }


    faqSearch.value =
        "";


    clearFaqSearch.hidden =
        true;


    applyFilters();


    faqSearch.focus();

}


/* =====================================================
   SUCHE-LEEREN-BUTTON
===================================================== */

if (
    clearFaqSearch
    && faqSearch
) {

    clearFaqSearch.addEventListener(
        "click",
        clearSearch
    );

}


/* =====================================================
   ESC LEERT SUCHE
===================================================== */

if (faqSearch) {

    faqSearch.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Escape"
            ) {
                return;
            }


            if (
                faqSearch.value
                    .trim()
                === ""
            ) {
                return;
            }


            event.preventDefault();

            clearSearch();

        }
    );

}


/* =====================================================
   URL-HASH UNTERSTÜTZEN

   Beispiele:

   faq.html#abholung
   faq.html#versand
   faq.html#mhd
===================================================== */

function applyCategoryFromHash() {

    const hash =
        window.location.hash
            .replace("#", "")
            .trim()
            .toLowerCase();


    if (!hash) {

        return;

    }


    const matchingCategory =
        faqCategories.find(
            category =>
                category.dataset.category
                === hash
        );


    if (!matchingCategory) {

        return;

    }


    activeCategory =
        hash;

}


/* =====================================================
   HASH-ÄNDERUNG
===================================================== */

window.addEventListener(
    "hashchange",
    () => {

        applyCategoryFromHash();

        setCategory(
            activeCategory
        );

    }
);


/* =====================================================
   START
===================================================== */

if (requiredElementsAvailable) {

    closeAllFaqItems();


    applyCategoryFromHash();


    setCategory(
        activeCategory
    );


    clearFaqSearch.hidden =
        faqSearch.value.trim()
        === "";

}