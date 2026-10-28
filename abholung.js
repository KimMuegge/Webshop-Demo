/* =====================================================
   WEBSHOP PROTOTYP
   ABHOLSTANDORTE UND STANDORTFINDER V2

   Funktionen:
   - Abholstandorte darstellen
   - Standorte durchsuchen und filtern
   - Kartenmarker anzeigen
   - nächsten Standort anhand einer PLZ suchen
   - Abholstandort speichern
   - nächsten möglichen Abholtermin berechnen
   - Bestellschluss am Vortag um 21:15 Uhr berechnen
   - nach überschrittener Frist automatisch den Termin
     der folgenden Woche verwenden

   WICHTIG:
   Feiertage und Sondertermine werden in dieser Version
   noch nicht automatisch berücksichtigt.
===================================================== */


/* =====================================================
   EINSTELLUNGEN
===================================================== */

const pickupLocationStorageKey =
    "webshopPickupLocation";

const orderTypeStorageKey =
    "webshopOrderType";

const adminLocationStorageKey =
    "webshopAdminLocationsV1";

const pickupOrderType =
    "pickup";


/*
   Allgemeine Bestellfrist für Abholbestellungen.

   Bestellung möglich bis:
   Vortag des Abholtermins, 21:15 Uhr.
*/

const defaultOrderDeadline = {

    daysBefore:
        1,

    hour:
        21,

    minute:
        15

};

/* =====================================================
   STANDORTDATEN

   Die Daten werden zentral aus locations.json geladen.
   Im öffentlichen Standortfinder werden ausschließlich
   aktive Standorte verwendet.
===================================================== */

let locations = [];


/* =====================================================
   STANDORTDATEN LADEN
===================================================== */

/* =====================================================
   STANDORTDATEN LADEN

   Reihenfolge:

   1. Verwaltungsstand aus LocalStorage verwenden
   2. Falls nicht vorhanden: locations.json laden
   3. Ausschließlich aktive Standorte übernehmen
===================================================== */

async function loadLocations() {

    let locationData =
        null;


    /* =============================================
       VERWALTUNGSSTAND AUS LOCALSTORAGE
    ============================================= */

    try {

        const storedLocationData =
            localStorage.getItem(
                adminLocationStorageKey
            );


        if (storedLocationData) {

            const parsedLocationData =
                JSON.parse(
                    storedLocationData
                );


            if (
                Array.isArray(
                    parsedLocationData
                )
            ) {

                locationData =
                    parsedLocationData;

            }

        }

    }
    catch (error) {

        console.error(
            "Die Verwaltungsdaten der Standorte "
            + "konnten nicht geladen werden:",
            error
        );

    }


    /* =============================================
       FALLBACK: LOCATIONS.JSON
    ============================================= */

    if (!locationData) {

        const response =
            await fetch(
                "data/locations.json"
            );


        if (!response.ok) {

            throw new Error(
                "Die Standortdaten konnten "
                + "nicht geladen werden."
            );

        }


        locationData =
            await response.json();

    }


    if (!Array.isArray(locationData)) {

        throw new Error(
            "Die Standortdaten besitzen "
            + "kein gültiges Format."
        );

    }


    /* =============================================
       NUR AKTIVE UND VOLLSTÄNDIGE STANDORTE
    ============================================= */

    locations =
        locationData
            .filter(
                location =>
                    location.status ===
                    "active"
            )
            .map(
                location => {

                    const pickupStart =
                        location.pickupStart
                        || "";

                    const pickupEnd =
                        location.pickupEnd
                        || "";


                    return {

                        id:
                            String(
                                location.id
                            ),

                        name:
                            String(
                                location.name
                                || ""
                            ),

                        address:
                            String(
                                location.address
                                || ""
                            ),

                        zip:
                            String(
                                location.postalCode
                                || ""
                            ),

                        city:
                            String(
                                location.city
                                || ""
                            ),

                        day:
                            String(
                                location.pickupDay
                                || ""
                            ),

                        dayOfWeek:
                            Number(
                                location.weekdayNumber
                            ),

                        time:
                            `${pickupStart} bis ${pickupEnd} Uhr`,

                        orderDeadline: {
                            ...defaultOrderDeadline
                        },

                        lat:
                            Number(
                                location.latitude
                            ),

                        lng:
                            Number(
                                location.longitude
                            )

                    };

                }
            )
            .filter(
                location => {

                    return (
                        location.name
                        && location.address
                        && location.zip
                        && location.city
                        && location.day
                        && Number.isInteger(
                            location.dayOfWeek
                        )
                        && Number.isFinite(
                            location.lat
                        )
                        && Number.isFinite(
                            location.lng
                        )
                    );

                }
            );

}

/* =====================================================
   STANDORTDATEN

   dayOfWeek entspricht JavaScript:

   0 = Sonntag
   1 = Montag
   2 = Dienstag
   3 = Mittwoch
   4 = Donnerstag
   5 = Freitag
   6 = Samstag
===================================================== */




/* =====================================================
   HTML-ELEMENTE
===================================================== */

const searchInput =
    document.querySelector("#locationSearch");

const dayFilter =
    document.querySelector("#dayFilter");

const locationList =
    document.querySelector("#locationList");

const resultCount =
    document.querySelector("#resultCount");

const emptyState =
    document.querySelector("#emptyState");

const clearSearchButton =
    document.querySelector("#clearSearch");

const resetFiltersButton =
    document.querySelector("#resetFilters");

const findNearestButton =
    document.querySelector("#findNearest");

const mapElement =
    document.querySelector("#map");


/* =====================================================
   GRUNDPRÜFUNG
===================================================== */

const requiredElementsAvailable =
    searchInput
    && dayFilter
    && locationList
    && resultCount
    && emptyState
    && clearSearchButton
    && resetFiltersButton
    && findNearestButton
    && mapElement;


if (!requiredElementsAvailable) {

    console.error(
        "Der Standortfinder konnte nicht gestartet werden. "
        + "Mindestens ein benötigtes HTML-Element fehlt."
    );

}


/* =====================================================
   LEAFLET PRÜFEN
===================================================== */

const leafletAvailable =
    typeof window.L !== "undefined";


if (!leafletAvailable) {

    console.error(
        "Die Kartenbibliothek Leaflet wurde nicht geladen."
    );

}


/* =====================================================
   DATUMSFORMATIERUNG
===================================================== */

const pickupDateFormatter =
    new Intl.DateTimeFormat(
        "de-DE",
        {
            weekday:
                "long",

            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric"
        }
    );


const deadlineDateFormatter =
    new Intl.DateTimeFormat(
        "de-DE",
        {
            weekday:
                "long",

            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit"
        }
    );


/* =====================================================
   DATUM KOPIEREN
===================================================== */

function cloneDate(date) {

    return new Date(
        date.getTime()
    );

}


/* =====================================================
   NÄCHSTES VORKOMMEN EINES WOCHENTAGS

   Das Ergebnis verwendet 12:00 Uhr. Dadurch vermeiden
   wir unnötige Probleme bei Zeitumstellungen.
===================================================== */

function getNextWeekdayDate(
    dayOfWeek,
    referenceDate = new Date()
) {

    const date =
        cloneDate(
            referenceDate
        );


    date.setHours(
        12,
        0,
        0,
        0
    );


    let daysUntilTarget =
        (
            Number(dayOfWeek)
            - date.getDay()
            + 7
        ) % 7;


    /*
       Liegt der Abholtag heute, wird zunächst der
       heutige Termin betrachtet.

       Die Bestellfristprüfung entscheidet anschließend,
       ob wirklich dieser oder der Termin der nächsten
       Woche verwendet wird.
    */

    date.setDate(
        date.getDate()
        + daysUntilTarget
    );


    return date;

}


/* =====================================================
   BESTELLSCHLUSS BERECHNEN
===================================================== */

function calculateOrderDeadline(
    pickupDate,
    deadlineConfiguration
) {

    const configuration =
        deadlineConfiguration
        || defaultOrderDeadline;


    const deadline =
        cloneDate(
            pickupDate
        );


    deadline.setDate(
        deadline.getDate()
        - Number(
            configuration.daysBefore
            ?? defaultOrderDeadline.daysBefore
        )
    );


    deadline.setHours(
        Number(
            configuration.hour
            ?? defaultOrderDeadline.hour
        ),

        Number(
            configuration.minute
            ?? defaultOrderDeadline.minute
        ),

        0,
        0
    );


    return deadline;

}


/* =====================================================
   NÄCHSTEN BESTELLBAREN ABHOLTERMIN BERECHNEN

   Beispiel:

   Abholung:
   Dienstag

   Bestellschluss:
   Montag, 21:15 Uhr

   Ist die Frist überschritten, wird der Dienstag
   der folgenden Woche gewählt.
===================================================== */

function calculateNextPickupSchedule(
    location,
    referenceDate = new Date()
) {

    if (
        !location
        || !Number.isInteger(
            Number(location.dayOfWeek)
        )
    ) {

        return null;

    }


    let pickupDate =
        getNextWeekdayDate(
            Number(location.dayOfWeek),
            referenceDate
        );


    let orderDeadline =
        calculateOrderDeadline(
            pickupDate,
            location.orderDeadline
        );


    /*
       "Bis 21:15 Uhr" wird hier einschließlich
       21:15 Uhr behandelt.

       Erst nach diesem Zeitpunkt wird auf den
       Termin der folgenden Woche gewechselt.
    */

    if (
        referenceDate.getTime()
        > orderDeadline.getTime()
    ) {

        pickupDate.setDate(
            pickupDate.getDate()
            + 7
        );


        orderDeadline =
            calculateOrderDeadline(
                pickupDate,
                location.orderDeadline
            );

    }


    return {

        pickupDate:
            pickupDate,

        orderDeadline:
            orderDeadline,

        pickupDateIso:
            pickupDate.toISOString(),

        orderDeadlineIso:
            orderDeadline.toISOString(),

        pickupDateLabel:
            pickupDateFormatter.format(
                pickupDate
            ),

        orderDeadlineLabel:
            deadlineDateFormatter.format(
                orderDeadline
            ),

        orderingAllowed:
            referenceDate.getTime()
            <= orderDeadline.getTime()

    };

}


/* =====================================================
   BESTELLFRIST-TEXT ERZEUGEN
===================================================== */

function createDeadlineText(schedule) {

    if (!schedule) {

        return (
            "Bestellungen müssen spätestens "
            + "am Vortag bis 21:15 Uhr "
            + "abgeschlossen werden."
        );

    }


    return (
        `Bestellschluss für diesen Termin: `
        + `${schedule.orderDeadlineLabel} Uhr`
    );

}


/* =====================================================
   ALLGEMEINER HINWEISTEXT
===================================================== */

function createGeneralDeadlineNotice() {

    return (
        "Bestellungen für die Abholung müssen spätestens "
        + "am Vortag bis 21:15 Uhr abgeschlossen werden. "
        + "Nach Ablauf dieser Frist wird die Ware für den "
        + "jeweiligen Abholstandort zusammengestellt. "
        + "Später eingehende Bestellungen werden automatisch "
        + "dem nächsten verfügbaren Abholtermin zugeordnet."
    );

}


/* =====================================================
   HTML SICHER AUSGEBEN
===================================================== */

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =====================================================
   KARTE INITIALISIEREN
===================================================== */

let map =
    null;


if (
    requiredElementsAvailable
    && leafletAvailable
) {

    map =
        L.map(
            "map",
            {
                scrollWheelZoom:
                    false
            }
        )
        .setView(
            [
                51.9079609,
                8.7488264
            ],
            9
        );


    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom:
                19,

            attribution:
                "&copy; OpenStreetMap-Mitwirkende"
        }
    )
    .addTo(map);

}


/* =====================================================
   MARKER-SPEICHER
===================================================== */

const markers =
    new Map();


/* =====================================================
   PLZ-KOORDINATEN ZWISCHENSPEICHERN
===================================================== */

const postalCodeCache =
    new Map();


/* =====================================================
   MARKER ERSTELLEN
===================================================== */

function createLocationMarkers() {

    if (!map) {
        return;
    }


    locations.forEach(
        location => {

            const schedule =
                calculateNextPickupSchedule(
                    location
                );


            const marker =
                L.marker(
                    [
                        location.lat,
                        location.lng
                    ]
                );


            marker.addTo(map);


            marker.bindPopup(
                `
                    <strong>
                        ${escapeHtml(location.name)}
                    </strong>

                    <br>

                    ${escapeHtml(location.address)}

                    <br>

                    ${escapeHtml(location.zip)}
                    ${escapeHtml(location.city)}

                    <br><br>

                    📅 Nächste Abholung:
                    ${escapeHtml(
                        schedule?.pickupDateLabel
                        || location.day
                    )}

                    <br>

                    🕒 ${escapeHtml(location.time)}

                    <br><br>

                    ⏳ ${escapeHtml(
                        createDeadlineText(schedule)
                    )}
                `
            );


            markers.set(
                location.id,
                marker
            );

        }
    );

}


/* =====================================================
   TEXT NORMALISIEREN
===================================================== */

function normalizeText(value) {

    return String(value)
        .toLocaleLowerCase("de-DE")
        .trim();

}


/* =====================================================
   GEFILTERTE STANDORTE
===================================================== */

function getFilteredLocations() {

    const searchQuery =
        normalizeText(
            searchInput.value
        );


    const selectedDay =
        dayFilter.value;


    return locations.filter(
        location => {

            const searchableText =
                normalizeText(
                    `
                        ${location.name}
                        ${location.address}
                        ${location.zip}
                        ${location.city}
                        ${location.day}
                    `
                );


            const matchesSearch =
                searchQuery === ""
                || searchableText.includes(
                    searchQuery
                );


            const matchesDay =
                selectedDay === ""
                || location.day
                    === selectedDay;


            return (
                matchesSearch
                && matchesDay
            );

        }
    );

}


/* =====================================================
   STANDORT SICHTBAR AUSWÄHLEN
===================================================== */

function selectLocation(id) {

    const location =
        locations.find(
            item =>
                item.id === String(id)
        );


    if (!location) {

        console.error(
            `Der Standort mit der ID ${id} wurde nicht gefunden.`
        );


        return;

    }


    document
        .querySelectorAll(
            ".location-item"
        )
        .forEach(
            element => {

                const elementId =
                    String(
                        element.dataset.id
                    );


                element.classList.toggle(
                    "active",
                    elementId === String(id)
                );
 
            }
        );


    if (!map) {
        return;
    }


    map.setView(
        [
            location.lat,
            location.lng
        ],
        14
    );


    const marker =
        markers.get(
            String(id)
        );


    if (marker) {

        marker.openPopup();

    }

}


window.selectLocation =
    selectLocation;


/* =====================================================
   ABHOLSTANDORT SPEICHERN

   Zusätzlich zu den Standortdaten werden gespeichert:

   - dayOfWeek
   - pickupDate
   - pickupDateLabel
   - orderDeadline
   - orderDeadlineLabel
   - deadlineHour
   - deadlineMinute
===================================================== */

function savePickupLocation(
    location,
    schedule
) {

    if (
        !location
        || typeof location !== "object"
        || !schedule
    ) {

        console.error(
            "Der ausgewählte Abholstandort "
            + "oder Abholtermin ist ungültig."
        );


        return false;

    }


    const pickupLocation = {

        id:
            String(location.id),

        name:
            String(location.name),

        address:
            String(location.address),

        zip:
            String(location.zip),

        city:
            String(location.city),

        day:
            String(location.day),

        dayOfWeek:
            Number(location.dayOfWeek),

        time:
            String(location.time),

        lat:
            Number(location.lat),

        lng:
            Number(location.lng),


        /*
           Konkreter nächster Abholtermin.
        */

        pickupDate:
            String(
                schedule.pickupDateIso
            ),

        pickupDateLabel:
            String(
                schedule.pickupDateLabel
            ),


        /*
           Konkreter Bestellschluss.
        */

        orderDeadline:
            String(
                schedule.orderDeadlineIso
            ),

        orderDeadlineLabel:
            String(
                schedule.orderDeadlineLabel
            ),


        /*
           Allgemeine Fristenregel.
        */

        deadlineDaysBefore:
            Number(
                location.orderDeadline.daysBefore
            ),

        deadlineHour:
            Number(
                location.orderDeadline.hour
            ),

        deadlineMinute:
            Number(
                location.orderDeadline.minute
            ),

        deadlineNotice:
            createGeneralDeadlineNotice()

    };


    try {

        localStorage.setItem(
            pickupLocationStorageKey,
            JSON.stringify(
                pickupLocation
            )
        );


        localStorage.setItem(
            orderTypeStorageKey,
            pickupOrderType
        );


        return true;

    } catch (error) {

        console.error(
            "Der Abholstandort konnte nicht gespeichert werden:",
            error
        );


        window.alert(
            "Der ausgewählte Abholstandort konnte "
            + "nicht gespeichert werden."
        );


        return false;

    }

}


/* =====================================================
   STANDORT VERBINDLICH AUSWÄHLEN
===================================================== */

function choosePickupLocation(id) {

    const location =
        locations.find(
            item =>
                item.id === String(id)
        );


    if (!location) {

        console.error(
            `Der Abholstandort mit der ID ${id} wurde nicht gefunden.`
        );


        window.alert(
            "Der ausgewählte Abholstandort "
            + "wurde nicht gefunden."
        );


        return;

    }


    const schedule =
        calculateNextPickupSchedule(
            location
        );


    if (!schedule) {

        window.alert(
            "Für diesen Standort konnte momentan "
            + "kein Abholtermin ermittelt werden."
        );


        return;

    }


    selectLocation(
        location.id
    );


    const locationSaved =
        savePickupLocation(
            location,
            schedule
        );


    if (!locationSaved) {
        return;
    }


    window.location.href =
        "abholsortiment.html";

}


window.choosePickupLocation =
    choosePickupLocation;


/* =====================================================
   STANDORTLISTE RENDERN
===================================================== */

function renderLocations() {

    if (!requiredElementsAvailable) {
        return;
    }


    const filteredLocations =
        getFilteredLocations();


    resultCount.textContent =
        filteredLocations.length === 1
            ? "1 Standort"
            : `${filteredLocations.length} Standorte`;


    locationList.innerHTML =
        filteredLocations
            .map(
                location => {

                    const schedule =
                        calculateNextPickupSchedule(
                            location
                        );


                    return `
                        <article
                            class="location-item"
                            data-id="${location.id}"
                        >

                            <div
                                class="pin"
                                aria-hidden="true"
                            >
                                📍
                            </div>


                            <div class="location-copy">

                                <h2>
                                    ${escapeHtml(location.name)}
                                </h2>


                                <p>
                                    ${escapeHtml(location.address)},
                                    ${escapeHtml(location.zip)}
                                    ${escapeHtml(location.city)}
                                </p>


                                <div class="meta">

                                    <span>
                                        📅
                                        ${
                                            escapeHtml(
                                                schedule?.pickupDateLabel
                                                || location.day
                                            )
                                        }
                                    </span>


                                    <span>
                                        🕒
                                        ${escapeHtml(location.time)}
                                    </span>

                                </div>


                                <div class="pickup-deadline-information">

                                    <strong>
                                        ⏳ Bestellfrist
                                    </strong>

                                    <p>
                                        ${
                                            escapeHtml(
                                                createDeadlineText(
                                                    schedule
                                                )
                                            )
                                        }.
                                    </p>


                                </div>

                            </div>


                            <button
                                class="choose-button"
                                type="button"
                                onclick="choosePickupLocation('${location.id}')"
                            >
                                Auswählen
                            </button>

                        </article>
                    `;

                }
            )
            .join("");


    const noLocationsFound =
        filteredLocations.length === 0;


    emptyState.hidden =
        !noLocationsFound;


    locationList.hidden =
        noLocationsFound;


    updateVisibleMarkers(
        filteredLocations
    );

}


/* =====================================================
   SICHTBARE MARKER AKTUALISIEREN
===================================================== */

function updateVisibleMarkers(
    filteredLocations
) {

    if (!map) {
        return;
    }


    const visibleLocationIds =
        new Set(
            filteredLocations.map(
                location =>
                    location.id
            )
        );


    markers.forEach(
        (marker, id) => {

            if (
                visibleLocationIds.has(id)
            ) {

                if (!map.hasLayer(marker)) {

                    marker.addTo(map);

                }

            } else if (
                map.hasLayer(marker)
            ) {

                map.removeLayer(marker);

            }

        }
    );


    if (
        filteredLocations.length === 0
    ) {
        return;
    }


    const visibleMarkers =
        filteredLocations
            .map(
                location =>
                    markers.get(
                        location.id
                    )
            )
            .filter(Boolean);


    if (
        visibleMarkers.length === 0
    ) {
        return;
    }


    const markerGroup =
        L.featureGroup(
            visibleMarkers
        );


    map.fitBounds(
        markerGroup
            .getBounds()
            .pad(0.25),
        {
            maxZoom:
                12
        }
    );

}


/* =====================================================
   GRAD IN BOGENMASS
===================================================== */

function toRadians(value) {

    return (
        value
        * Math.PI
        / 180
    );

}


/* =====================================================
   LUFTLINIENENTFERNUNG BERECHNEN
===================================================== */

function calculateDistance(
    latitude1,
    longitude1,
    latitude2,
    longitude2
) {

    const earthRadius =
        6371;


    const latitudeDifference =
        toRadians(
            latitude2
            - latitude1
        );


    const longitudeDifference =
        toRadians(
            longitude2
            - longitude1
        );


    const calculation =

        Math.sin(
            latitudeDifference / 2
        )
        * Math.sin(
            latitudeDifference / 2
        )

        +

        Math.cos(
            toRadians(latitude1)
        )
        * Math.cos(
            toRadians(latitude2)
        )
        * Math.sin(
            longitudeDifference / 2
        )
        * Math.sin(
            longitudeDifference / 2
        );


    const angle =
        2
        * Math.atan2(
            Math.sqrt(calculation),
            Math.sqrt(
                1 - calculation
            )
        );


    return (
        earthRadius
        * angle
    );

}


/* =====================================================
   NÄCHSTGELEGENEN STANDORT ERMITTELN
===================================================== */

function getNearestLocation(
    latitude,
    longitude
) {

    let nearestLocation =
        null;

    let shortestDistance =
        Infinity;


    locations.forEach(
        location => {

            const distance =
                calculateDistance(
                    latitude,
                    longitude,
                    location.lat,
                    location.lng
                );


            if (
                distance
                < shortestDistance
            ) {

                shortestDistance =
                    distance;

                nearestLocation =
                    location;

            }

        }
    );


    return {

        location:
            nearestLocation,

        distance:
            shortestDistance

    };

}


/* =====================================================
   POSTLEITZAHL GEOCODIEREN
===================================================== */

async function geocodePostalCode(
    postalCode
) {

    if (
        postalCodeCache.has(
            postalCode
        )
    ) {

        return postalCodeCache.get(
            postalCode
        );

    }


    const requestUrl =
        new URL(
            "https://nominatim.openstreetmap.org/search"
        );


    requestUrl.searchParams.set(
        "postalcode",
        postalCode
    );


    requestUrl.searchParams.set(
        "country",
        "Deutschland"
    );


    requestUrl.searchParams.set(
        "countrycodes",
        "de"
    );


    requestUrl.searchParams.set(
        "format",
        "jsonv2"
    );


    requestUrl.searchParams.set(
        "limit",
        "1"
    );


    const response =
        await fetch(
            requestUrl.toString(),
            {
                headers: {
                    "Accept":
                        "application/json"
                }
            }
        );


    if (!response.ok) {

        throw new Error(
            "Die Postleitzahl konnte "
            + "nicht gesucht werden."
        );

    }


    const results =
        await response.json();


    if (
        !Array.isArray(results)
        || results.length === 0
    ) {

        return null;

    }


    const coordinates = {

        latitude:
            Number(results[0].lat),

        longitude:
            Number(results[0].lon)

    };


    if (
        !Number.isFinite(
            coordinates.latitude
        )
        || !Number.isFinite(
            coordinates.longitude
        )
    ) {

        return null;

    }


    postalCodeCache.set(
        postalCode,
        coordinates
    );


    return coordinates;

}


/* =====================================================
   NÄCHSTEN STANDORT ÜBER PLZ FINDEN
===================================================== */

async function findNearestLocation() {

    const postalCode =
        searchInput.value.trim();


    if (
        !/^\d{5}$/.test(
            postalCode
        )
    ) {

        window.alert(
            "Bitte gib eine gültige "
            + "fünfstellige Postleitzahl ein."
        );


        searchInput.focus();


        return;

    }


    findNearestButton.disabled =
        true;


    findNearestButton.textContent =
        "Standort wird gesucht …";


    try {

        const coordinates =
            await geocodePostalCode(
                postalCode
            );


        if (!coordinates) {

            window.alert(
                "Zu dieser Postleitzahl wurde "
                + "keine Position gefunden."
            );


            return;

        }


        const nearestResult =
            getNearestLocation(
                coordinates.latitude,
                coordinates.longitude
            );


        if (!nearestResult.location) {

            window.alert(
                "Es wurde kein Abholstandort gefunden."
            );


            return;

        }


        searchInput.value =
            "";

        dayFilter.value =
            "";


        renderLocations();


        selectLocation(
            nearestResult.location.id
        );


        const locationElement =
            document.querySelector(
                `[data-id="${nearestResult.location.id}"]`
            );


        if (locationElement) {

            locationElement.scrollIntoView(
                {
                    behavior:
                        "smooth",

                    block:
                        "center"
                }
            );

        }


        const schedule =
            calculateNextPickupSchedule(
                nearestResult.location
            );


        window.alert(
            `Der nächstgelegene Abholstandort ist `
            + `${nearestResult.location.name}. `
            + `Die ungefähre Luftlinienentfernung beträgt `
            + `${nearestResult.distance.toFixed(1)} km. `
            + `Der nächste bestellbare Abholtermin ist `
            + `${schedule.pickupDateLabel}.`
        );

    } catch (error) {

        console.error(
            "Fehler bei der Standortsuche:",
            error
        );


        window.alert(
            "Der nächstgelegene Standort konnte "
            + "momentan nicht ermittelt werden."
        );

    } finally {

        findNearestButton.disabled =
            false;


        findNearestButton.textContent =
            "Nächsten Standort finden";

    }

}


/* =====================================================
   EVENT-LISTENER
===================================================== */

if (requiredElementsAvailable) {

    searchInput.addEventListener(
        "input",
        renderLocations
    );


    dayFilter.addEventListener(
        "change",
        renderLocations
    );


    clearSearchButton.addEventListener(
        "click",
        () => {

            searchInput.value =
                "";


            searchInput.focus();


            renderLocations();

        }
    );


    resetFiltersButton.addEventListener(
        "click",
        () => {

            searchInput.value =
                "";

            dayFilter.value =
                "";


            renderLocations();

        }
    );


    findNearestButton.addEventListener(
        "click",
        findNearestLocation
    );


    searchInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
                && /^\d{5}$/.test(
                    searchInput.value.trim()
                )
            ) {

                event.preventDefault();


                findNearestLocation();

            }

        }
    );

}

/* =====================================================
   ÄNDERUNGEN AUS DER STANDORTVERWALTUNG ERKENNEN

   Wird ausgelöst, wenn der LocalStorage in einem
   anderen Browser-Tab geändert wurde.
===================================================== */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
            adminLocationStorageKey
        ) {

            window.location.reload();

        }

    }
);

/* =====================================================
   ÄNDERUNGEN DER STANDORTVERWALTUNG ERKENNEN
===================================================== */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
            adminLocationStorageKey
        ) {

            window.location.reload();

        }

    }
);

/* =====================================================
   START
===================================================== */

async function initializeLocationFinder() {

    if (
        !requiredElementsAvailable
        || !leafletAvailable
    ) {
        return;
    }


    try {

        await loadLocations();


        if (locations.length === 0) {

            throw new Error(
                "Es wurden keine aktiven Standorte gefunden."
            );

        }


        createLocationMarkers();

        renderLocations();


        window.setTimeout(
            () => {

                if (map) {

                    map.invalidateSize();

                }

            },
            150
        );

    }
    catch (error) {

        console.error(
            "Der Standortfinder konnte nicht gestartet werden:",
            error
        );


        resultCount.textContent =
            "0 Standorte";


        locationList.innerHTML = "";


        emptyState.hidden =
            false;


        locationList.hidden =
            true;


        const emptyHeading =
            emptyState.querySelector("h2");

        const emptyText =
            emptyState.querySelector("p");


        if (emptyHeading) {

            emptyHeading.textContent =
                "Standorte konnten nicht geladen werden";

        }


        if (emptyText) {

            emptyText.textContent =
                "Bitte versuche es später erneut.";

        }

    }

}


initializeLocationFinder();