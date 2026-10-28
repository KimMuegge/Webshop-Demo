/* =====================================================
   WEBSHOP PROTOTYP
   ABHOLSORTIMENT V2

   Funktionen:
   - ausgewählten Abholstandort laden
   - konkreten Abholtermin anzeigen
   - Bestellschluss anzeigen
   - Bestellfrist technisch prüfen
   - abgelaufene Frist erkennen
   - Demo-Produkte darstellen
   - Produkte durchsuchen
   - Kategorien filtern
   - Angebote und Bio filtern
   - Produkte in den Warenkorb legen
   - Versand und Abholung nicht vermischen
   - Warenkorbanzahl aktualisieren

   BESTELLFRIST:
   Abholbestellungen müssen spätestens am Vortag
   des Abholtermins bis 21:15 Uhr abgeschlossen werden.

   WICHTIG:
   Die Produkte sind vorläufige Demodaten.
   Später werden sie durch eine gemeinsame
   Produktdatenbank ersetzt.
===================================================== */


/* =====================================================
   EINSTELLUNGEN
===================================================== */

const pickupLocationStorageKey =
    "webshopPickupLocation";

const orderTypeStorageKey =
    "webshopOrderType";

const cartStorageKey =
    "webshopCart";

const pickupOrderType =
    "pickup";

const shippingOrderType =
    "shipping";


/* =====================================================
   DEMO-PRODUKTE

   availability:
   - "pickup"
   - "shipping"
   - "both"
===================================================== */

const products = [

    {
        id: "pickup-apple-001",
        name: "Äpfel Mix",
        category: "obst",
        categoryLabel: "Obst",
        description:
            "Eine wechselnde Mischung aus genießbaren Äpfeln.",
        unit: "ca. 1 kg",
        price: 2.49,
        image: "",
        isOffer: true,
        isOrganic: false,
        availability: "pickup"
    },

    {
        id: "pickup-orange-001",
        name: "Orangen",
        category: "obst",
        categoryLabel: "Obst",
        description:
            "Saftige Orangen mit kleinen optischen Abweichungen.",
        unit: "ca. 1 kg",
        price: 2.99,
        image: "",
        isOffer: false,
        isOrganic: false,
        availability: "pickup"
    },

    {
        id: "pickup-carrot-001",
        name: "Möhren",
        category: "gemuese",
        categoryLabel: "Gemüse",
        description:
            "Frische Möhren in unterschiedlichen Größen und Formen.",
        unit: "ca. 1 kg",
        price: 1.79,
        image: "",
        isOffer: true,
        isOrganic: true,
        availability: "pickup"
    },

    {
        id: "pickup-potato-001",
        name: "Kartoffeln",
        category: "gemuese",
        categoryLabel: "Gemüse",
        description:
            "Vielseitig verwendbare Kartoffeln für deine Küche.",
        unit: "ca. 2,5 kg",
        price: 3.49,
        image: "",
        isOffer: false,
        isOrganic: false,
        availability: "pickup"
    },

    {
        id: "pickup-mixbox-001",
        name: "Obst- und Gemüse-Mix",
        category: "kisten",
        categoryLabel: "Kisten & Pakete",
        description:
            "Eine wechselnde Auswahl aus gerettetem Obst und Gemüse.",
        unit: "1 Mix-Kiste",
        price: 12.90,
        image: "",
        isOffer: true,
        isOrganic: false,
        availability: "pickup"
    },

    {
        id: "pickup-snackbox-001",
        name: "Snack-Paket",
        category: "kisten",
        categoryLabel: "Kisten & Pakete",
        description:
            "Eine wechselnde Mischung aus süßen und salzigen Snacks.",
        unit: "1 Paket",
        price: 8.90,
        image: "",
        isOffer: false,
        isOrganic: false,
        availability: "pickup"
    },

    {
        id: "pickup-nuts-001",
        name: "Nussmischung",
        category: "trockenartikel",
        categoryLabel: "Trockenartikel",
        description:
            "Eine abwechslungsreiche Mischung aus verschiedenen Nüssen.",
        unit: "250 g",
        price: 3.99,
        image: "",
        isOffer: false,
        isOrganic: true,
        availability: "pickup"
    },

    {
        id: "pickup-soup-001",
        name: "Gemüsesuppe",
        category: "trockenartikel",
        categoryLabel: "Trockenartikel",
        description:
            "Haltbare Gemüsesuppe für eine schnelle Mahlzeit.",
        unit: "400 ml",
        price: 1.99,
        image: "",
        isOffer: true,
        isOrganic: false,
        availability: "pickup"
    },

    {
        id: "pickup-chocolate-001",
        name: "Schokolade",
        category: "snacks",
        categoryLabel: "Snacks & Süßes",
        description:
            "Schokolade mit möglichem Verpackungs- oder Etikettierungsfehler.",
        unit: "100 g",
        price: 1.29,
        image: "",
        isOffer: true,
        isOrganic: false,
        availability: "pickup"
    },

    {
        id: "pickup-juice-001",
        name: "Apfelsaft",
        category: "getraenke",
        categoryLabel: "Getränke",
        description:
            "Fruchtiger Apfelsaft aus sorgfältig ausgewählten Äpfeln.",
        unit: "1 Liter",
        price: 2.49,
        image: "",
        isOffer: false,
        isOrganic: true,
        availability: "pickup"
    },

    {
        id: "pickup-petfood-001",
        name: "Tierfutter-Mix",
        category: "tierbedarf",
        categoryLabel: "Tierbedarf",
        description:
            "Eine wechselnde Zusammenstellung verschiedener Tierfutterartikel.",
        unit: "1 Paket",
        price: 6.90,
        image: "",
        isOffer: false,
        isOrganic: false,
        availability: "pickup"
    },

    {
        id: "pickup-care-001",
        name: "Pflegeprodukt",
        category: "non-food",
        categoryLabel: "Non-Food",
        description:
            "Ein wechselndes Pflegeprodukt aus unserem Non-Food-Sortiment.",
        unit: "1 Stück",
        price: 2.90,
        image: "",
        isOffer: true,
        isOrganic: false,
        availability: "pickup"
    }

];


/* =====================================================
   HTML-ELEMENTE
===================================================== */

const pickupLocationSection =
    document.querySelector("#pickupLocationSection");

const pickupLocationName =
    document.querySelector("#pickupLocationName");

const pickupLocationAddress =
    document.querySelector("#pickupLocationAddress");

const pickupLocationDay =
    document.querySelector("#pickupLocationDay");

const pickupLocationTime =
    document.querySelector("#pickupLocationTime");

const missingLocation =
    document.querySelector("#missingLocation");

const pickupShopContent =
    document.querySelector("#pickupShopContent");

const productSearch =
    document.querySelector("#productSearch");

const clearProductSearch =
    document.querySelector("#clearProductSearch");

const productCount =
    document.querySelector("#productCount");

const categoryButtons =
    Array.from(
        document.querySelectorAll(
            ".category-button"
        )
    );

const offerFilter =
    document.querySelector("#offerFilter");

const organicFilter =
    document.querySelector("#organicFilter");

const productGrid =
    document.querySelector("#productGrid");

const emptyProducts =
    document.querySelector("#emptyProducts");

const resetProductFilters =
    document.querySelector("#resetProductFilters");

const cartCount =
    document.querySelector("#cartCount");

const cartCtaCount =
    document.querySelector("#cartCtaCount");


/* =====================================================
   GRUNDPRÜFUNG
===================================================== */

const requiredElementsAvailable =
    pickupLocationSection
    && pickupLocationName
    && pickupLocationAddress
    && pickupLocationDay
    && pickupLocationTime
    && missingLocation
    && pickupShopContent
    && productSearch
    && clearProductSearch
    && productCount
    && offerFilter
    && organicFilter
    && productGrid
    && emptyProducts
    && resetProductFilters
    && cartCount
    && cartCtaCount;


if (!requiredElementsAvailable) {

    console.error(
        "Das Abholsortiment konnte nicht vollständig "
        + "gestartet werden. Mindestens ein benötigtes "
        + "HTML-Element fehlt."
    );

}


/* =====================================================
   STATUS
===================================================== */

let activeCategory =
    "all";

let selectedPickupLocation =
    null;

let cart =
    [];


/* =====================================================
   PREISFORMATIERUNG
===================================================== */

const currencyFormatter =
    new Intl.NumberFormat(
        "de-DE",
        {
            style: "currency",
            currency: "EUR"
        }
    );


function formatPrice(value) {

    const number =
        Number(value);


    if (!Number.isFinite(number)) {

        return "0,00 €";

    }


    return currencyFormatter.format(
        number
    );

}


/* =====================================================
   TEXT SICHER AUSGEBEN
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
   TEXT NORMALISIEREN
===================================================== */

function normalizeText(value) {

    return String(value)
        .toLocaleLowerCase("de-DE")
        .trim();

}


/* =====================================================
   DATUM PRÜFEN
===================================================== */

function parseStoredDate(value) {

    if (!value) {

        return null;

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return null;

    }


    return date;

}


/* =====================================================
   ABHOLSTANDORT PRÜFEN
===================================================== */

function isValidPickupLocation(location) {

    if (
        !location
        || typeof location !== "object"
    ) {

        return false;

    }


    return (
        Number.isFinite(
            Number(location.id)
        )
        && String(location.name || "").trim() !== ""
        && String(location.address || "").trim() !== ""
        && String(location.zip || "").trim() !== ""
        && String(location.city || "").trim() !== ""
        && String(location.day || "").trim() !== ""
        && String(location.time || "").trim() !== ""
        && parseStoredDate(
            location.pickupDate
        ) !== null
        && parseStoredDate(
            location.orderDeadline
        ) !== null
    );

}


/* =====================================================
   ABHOLSTANDORT LADEN

   Alle in abholung.js gespeicherten Termin- und
   Fristdaten werden übernommen.
===================================================== */

function loadPickupLocation() {

    const storedLocation =
        localStorage.getItem(
            pickupLocationStorageKey
        );


    if (!storedLocation) {

        return null;

    }


    try {

        const parsedLocation =
            JSON.parse(
                storedLocation
            );


        if (
            !isValidPickupLocation(
                parsedLocation
            )
        ) {

            console.error(
                "Der gespeicherte Abholstandort enthält "
                + "keinen gültigen Abholtermin oder "
                + "Bestellschluss."
            );


            return null;

        }


        return {

            id:
                Number(parsedLocation.id),

            name:
                String(parsedLocation.name),

            address:
                String(parsedLocation.address),

            zip:
                String(parsedLocation.zip),

            city:
                String(parsedLocation.city),

            day:
                String(parsedLocation.day),

            dayOfWeek:
                Number(parsedLocation.dayOfWeek),

            time:
                String(parsedLocation.time),

            lat:
                Number(parsedLocation.lat),

            lng:
                Number(parsedLocation.lng),

            pickupDate:
                String(parsedLocation.pickupDate),

            pickupDateLabel:
                String(
                    parsedLocation.pickupDateLabel
                    || parsedLocation.day
                ),

            orderDeadline:
                String(parsedLocation.orderDeadline),

            orderDeadlineLabel:
                String(
                    parsedLocation.orderDeadlineLabel
                    || "Vortag, 21:15 Uhr"
                ),

            deadlineDaysBefore:
                Number(
                    parsedLocation.deadlineDaysBefore
                    ?? 1
                ),

            deadlineHour:
                Number(
                    parsedLocation.deadlineHour
                    ?? 21
                ),

            deadlineMinute:
                Number(
                    parsedLocation.deadlineMinute
                    ?? 15
                ),

            deadlineNotice:
                String(
                    parsedLocation.deadlineNotice
                    || ""
                )

        };

    } catch (error) {

        console.error(
            "Der gespeicherte Abholstandort konnte "
            + "nicht gelesen werden:",
            error
        );


        return null;

    }

}


/* =====================================================
   BESTELLFRIST ERMITTELN
===================================================== */

function getPickupDeadline(location) {

    if (!location) {

        return null;

    }


    return parseStoredDate(
        location.orderDeadline
    );

}


/* =====================================================
   BESTELLFRIST PRÜFEN

   Die Bestellung ist bis einschließlich des
   gespeicherten Bestellschlusses möglich.
===================================================== */

function isPickupDeadlineValid(location) {

    const deadline =
        getPickupDeadline(
            location
        );


    if (!deadline) {

        return false;

    }


    return (
        Date.now()
        <= deadline.getTime()
    );

}


/* =====================================================
   ABGELAUFENE AUSWAHL ENTFERNEN

   Die Standortdaten werden nicht automatisch gelöscht.
   Der Kunde kann dadurch noch sehen, welcher Standort
   ausgewählt war.

   Für eine neue Bestellung muss der Standort jedoch
   erneut auf abholung.html gewählt werden.
===================================================== */

function handleExpiredDeadline() {

    pickupShopContent.hidden =
        true;


    showMessage(
        "Die Bestellfrist für diesen Abholtermin ist "
        + "abgelaufen. Bitte wähle den Abholstandort "
        + "erneut aus, damit der nächste verfügbare "
        + "Abholtermin berechnet wird.",
        "error"
    );

}


/* =====================================================
   FRISTINFORMATION DARSTELLEN
===================================================== */

function renderDeadlineInformation(location) {

    const existingInformation =
        document.querySelector(
            "#pickupDeadlineInformation"
        );


    if (existingInformation) {

        existingInformation.remove();

    }


    if (
        !pickupLocationSection
        || !location
    ) {

        return;

    }


    const deadlineValid =
        isPickupDeadlineValid(
            location
        );


    const information =
        document.createElement(
            "section"
        );


    information.id =
        "pickupDeadlineInformation";


    information.className =
        "pickup-information";


    information.setAttribute(
        "aria-live",
        "polite"
    );


    information.innerHTML = `
        <div
            class="pickup-information-icon"
            aria-hidden="true"
        >
            ⏳
        </div>

        <div>

            <strong>
                Bestellfrist für die Abholung
            </strong>

            <p>
                Nächster Abholtermin:
                <strong>
                    ${escapeHtml(
                        location.pickupDateLabel
                    )}
                </strong>,
                ${escapeHtml(location.time)}.
            </p>

            <p>
                Bestellschluss:
                <strong>
                    ${escapeHtml(
                        location.orderDeadlineLabel
                    )} Uhr
                </strong>.
            </p>

            <p>
                Bestellungen müssen spätestens am
                Vortag bis 21:15 Uhr abgeschlossen werden.
            </p>

            ${
                deadlineValid
                    ? `
                        <p>
                            Die Bestellung für diesen
                            Abholtermin ist aktuell möglich.
                        </p>
                    `
                    : `
                        <p>
                            <strong>
                                Die Bestellfrist für diesen
                                Abholtermin ist abgelaufen.
                                Bitte wähle den Standort
                                erneut aus.
                            </strong>
                        </p>

                        <a
                            class="primary-button"
                            href="abholung.html"
                        >
                            Neuen Abholtermin wählen
                        </a>
                    `
            }

        </div>
    `;


    pickupLocationSection.insertAdjacentElement(
        "afterend",
        information
    );

}


/* =====================================================
   STANDORT DARSTELLEN
===================================================== */

function renderPickupLocation(location) {

    if (!requiredElementsAvailable) {

        return;

    }


    if (
        !isValidPickupLocation(
            location
        )
    ) {

        pickupLocationSection.hidden =
            true;

        pickupShopContent.hidden =
            true;

        missingLocation.hidden =
            false;


        return;

    }


    pickupLocationName.textContent =
        location.name;


    pickupLocationAddress.textContent =
        `${location.address}, `
        + `${location.zip} `
        + `${location.city}`;


    /*
       Statt nur "Dienstag" wird jetzt das
       konkrete Abholdatum angezeigt.
    */

    pickupLocationDay.textContent =
        location.pickupDateLabel;


    pickupLocationTime.textContent =
        location.time;


    pickupLocationSection.hidden =
        false;

    missingLocation.hidden =
        true;


    renderDeadlineInformation(
        location
    );


    if (
        !isPickupDeadlineValid(
            location
        )
    ) {

        handleExpiredDeadline();

        return;

    }


    pickupShopContent.hidden =
        false;


    localStorage.setItem(
        orderTypeStorageKey,
        pickupOrderType
    );

}


/* =====================================================
   WARENKORBPOSITION PRÜFEN
===================================================== */

function isValidCartItem(item) {

    if (
        !item
        || typeof item !== "object"
    ) {

        return false;

    }


    const price =
        Number(item.price);

    const quantity =
        Number(item.quantity);


    return (
        item.id !== undefined
        && String(item.name || "").trim() !== ""
        && Number.isFinite(price)
        && price >= 0
        && Number.isFinite(quantity)
        && quantity >= 1
    );

}


/* =====================================================
   BESTELLWEG NORMALISIEREN
===================================================== */

function normalizeOrderType(value) {

    const orderType =
        String(value || "")
            .trim()
            .toLowerCase();


    if (orderType === pickupOrderType) {

        return pickupOrderType;

    }


    /*
       Ältere Produkte ohne Bestellart stammen
       aus der bisherigen Versandversion.
    */

    return shippingOrderType;

}


/* =====================================================
   WARENKORB LADEN
===================================================== */

function loadCart() {

    const storedCart =
        localStorage.getItem(
            cartStorageKey
        );


    if (!storedCart) {

        return [];

    }


    try {

        const parsedCart =
            JSON.parse(
                storedCart
            );


        if (!Array.isArray(parsedCart)) {

            return [];

        }


        return parsedCart
            .filter(isValidCartItem)
            .map(
                item => {

                    const orderType =
                        normalizeOrderType(
                            item.orderType
                        );


                    const pickupLocationId =
                        Number(
                            item.pickupLocationId
                        );


                    return {

                        id:
                            String(item.id),

                        name:
                            String(item.name),

                        category:
                            String(
                                item.category || ""
                            ),

                        unit:
                            String(
                                item.unit || ""
                            ),

                        price:
                            Number(item.price),

                        quantity:
                            Math.max(
                                1,
                                Math.floor(
                                    Number(item.quantity)
                                )
                            ),

                        image:
                            String(
                                item.image || ""
                            ),

                        orderType:
                            orderType,

                        pickupLocationId:
                            orderType === pickupOrderType
                            && Number.isFinite(
                                pickupLocationId
                            )
                                ? pickupLocationId
                                : null

                    };

                }
            );

    } catch (error) {

        console.error(
            "Der Warenkorb konnte nicht gelesen werden:",
            error
        );


        return [];

    }

}


/* =====================================================
   WARENKORB SPEICHERN
===================================================== */

function saveCart() {

    try {

        localStorage.setItem(
            cartStorageKey,
            JSON.stringify(cart)
        );


        localStorage.setItem(
            orderTypeStorageKey,
            pickupOrderType
        );


        return true;

    } catch (error) {

        console.error(
            "Der Warenkorb konnte nicht gespeichert werden:",
            error
        );


        showMessage(
            "Der Warenkorb konnte nicht gespeichert werden.",
            "error"
        );


        return false;

    }

}


/* =====================================================
   WARENKORB-ANZAHL AKTUALISIEREN
===================================================== */

function updateCartCount() {

    const totalQuantity =
        cart.reduce(
            (sum, item) => {

                return (
                    sum
                    + Math.max(
                        0,
                        Number(item.quantity) || 0
                    )
                );

            },
            0
        );


    cartCount.textContent =
        String(totalQuantity);


    cartCtaCount.textContent =
        String(totalQuantity);


    cartCount.setAttribute(
        "aria-label",
        `${totalQuantity} Artikel im Warenkorb`
    );

}


/* =====================================================
   VERSANDWARE PRÜFEN
===================================================== */

function cartContainsShippingProducts() {

    return cart.some(
        item =>
            normalizeOrderType(
                item.orderType
            ) === shippingOrderType
    );

}

/* =====================================================
   ANDEREN ABHOLSTANDORT IM WARENKORB PRÜFEN

   Verhindert, dass Abholprodukte verschiedener
   Standorte gemeinsam im Warenkorb landen.
===================================================== */

function cartContainsDifferentPickupLocation() {

    if (!selectedPickupLocation) {

        return false;

    }


    return cart.some(
        item => {

            return (
                normalizeOrderType(
                    item.orderType
                ) === pickupOrderType
                && Number(
                    item.pickupLocationId
                ) !== selectedPickupLocation.id
            );

        }
    );

}

/* =====================================================
   PRODUKT ZUM WARENKORB HINZUFÜGEN
===================================================== */

function addProductToCart(productId) {

    if (!selectedPickupLocation) {

        showMessage(
            "Bitte wähle zuerst einen Abholstandort aus.",
            "error"
        );


        return;

    }

/*
   Abholprodukte eines anderen Standorts dürfen
   nicht mit dem aktuell ausgewählten Standort
   vermischt werden.
*/

if (
    cartContainsDifferentPickupLocation()
) {

    showMessage(
        "In deinem Warenkorb befinden sich bereits "
        + "Produkte für einen anderen Abholstandort. "
        + "Bitte entferne diese Produkte zuerst oder "
        + "wähle den bisherigen Abholstandort erneut aus.",
        "error"
    );

    return;

}
    /*
       WICHTIG:
       Die Bestellfrist wird bei jedem Hinzufügen
       erneut geprüft.
    */

    if (
        !isPickupDeadlineValid(
            selectedPickupLocation
        )
    ) {

        handleExpiredDeadline();


        return;

    }


    if (
        cartContainsShippingProducts()
    ) {

        showMessage(
            "In deinem Warenkorb befinden sich bereits "
            + "Versandprodukte. Abhol- und Versandprodukte "
            + "können momentan nicht gemeinsam bestellt werden.",
            "error"
        );


        return;

    }


    const product =
        products.find(
            item =>
                String(item.id)
                === String(productId)
        );


    if (!product) {

        showMessage(
            "Das Produkt wurde nicht gefunden.",
            "error"
        );


        return;

    }


    const existingItem =
        cart.find(
            item =>
                String(item.id)
                === String(product.id)
                && item.orderType
                    === pickupOrderType
                && Number(
                    item.pickupLocationId
                ) === selectedPickupLocation.id
        );


    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({

            id:
                String(product.id),

            name:
                String(product.name),

            category:
                String(product.categoryLabel),

            unit:
                String(product.unit),

            price:
                Number(product.price),

            quantity:
                1,

            image:
                String(product.image || ""),

            orderType:
                pickupOrderType,

            pickupLocationId:
                Number(
                    selectedPickupLocation.id
                )

        });

    }


    if (!saveCart()) {

        return;

    }


    updateCartCount();


    showMessage(
        `${product.name} wurde zum Warenkorb hinzugefügt.`,
        "success"
    );

}


/* =====================================================
   PRODUKTBADGES
===================================================== */

function createProductBadges(product) {

    const badges =
        [];


    if (product.isOffer) {

        badges.push(
            `
                <span class="product-badge offer">
                    Angebot
                </span>
            `
        );

    }


    if (product.isOrganic) {

        badges.push(
            `
                <span class="product-badge organic">
                    Bio
                </span>
            `
        );

    }


    if (badges.length === 0) {

        return "";

    }


    return `
        <div class="product-badges">
            ${badges.join("")}
        </div>
    `;

}


/* =====================================================
   PRODUKTBILD
===================================================== */

function createProductImage(product) {

    if (product.image) {

        return `
            <div class="product-image">

                <img
                    src="${escapeHtml(product.image)}"
                    alt="${escapeHtml(product.name)}"
                >

                ${createProductBadges(product)}

            </div>
        `;

    }


    return `
        <div
            class="product-image"
            aria-label="Platzhalter für ${escapeHtml(product.name)}"
        >
            PRODUKTBILD

            ${createProductBadges(product)}
        </div>
    `;

}


/* =====================================================
   PRODUKTKARTE
===================================================== */

function createProductCard(product) {

    return `
        <article
            class="product-card"
            data-product-id="${escapeHtml(product.id)}"
        >

            ${createProductImage(product)}

            <div class="product-content">

                <p class="product-category">
                    ${escapeHtml(product.categoryLabel)}
                </p>

                <h3>
                    ${escapeHtml(product.name)}
                </h3>

                <p class="product-description">
                    ${escapeHtml(product.description)}
                </p>

                <p class="product-unit">
                    ${escapeHtml(product.unit)}
                </p>

                <div class="product-price-row">

                    <strong class="product-price">
                        ${formatPrice(product.price)}
                    </strong>

                    <button
                        class="add-to-cart-button"
                        type="button"
                        data-action="add-to-cart"
                    >
                        In den Warenkorb
                    </button>

                </div>

            </div>

        </article>
    `;

}


/* =====================================================
   PRODUKTE FILTERN
===================================================== */

function getFilteredProducts() {

    const searchTerm =
        normalizeText(
            productSearch.value
        );


    const onlyOffers =
        offerFilter.checked;


    const onlyOrganic =
        organicFilter.checked;


    return products.filter(
        product => {

            const productAvailable =
                product.availability === "pickup"
                || product.availability === "both";


            const searchableText =
                normalizeText(
                    `
                        ${product.name}
                        ${product.category}
                        ${product.categoryLabel}
                        ${product.description}
                        ${product.unit}
                    `
                );


            const matchesSearch =
                searchTerm === ""
                || searchableText.includes(
                    searchTerm
                );


            const matchesCategory =
                activeCategory === "all"
                || product.category
                    === activeCategory;


            const matchesOffer =
                !onlyOffers
                || product.isOffer;


            const matchesOrganic =
                !onlyOrganic
                || product.isOrganic;


            return (
                productAvailable
                && matchesSearch
                && matchesCategory
                && matchesOffer
                && matchesOrganic
            );

        }
    );

}


/* =====================================================
   PRODUKTE DARSTELLEN
===================================================== */

function renderProducts() {

    if (
        !requiredElementsAvailable
        || !selectedPickupLocation
    ) {

        return;

    }


    /*
       Auch beim erneuten Rendern der Produkte
       wird die Frist geprüft.
    */

    if (
        !isPickupDeadlineValid(
            selectedPickupLocation
        )
    ) {

        handleExpiredDeadline();


        return;

    }


    const filteredProducts =
        getFilteredProducts();


    productGrid.innerHTML =
        filteredProducts
            .map(createProductCard)
            .join("");


    productCount.textContent =
        filteredProducts.length === 1
            ? "1 Produkt"
            : `${filteredProducts.length} Produkte`;


    const productsAreEmpty =
        filteredProducts.length === 0;


    productGrid.hidden =
        productsAreEmpty;


    emptyProducts.hidden =
        !productsAreEmpty;

}


/* =====================================================
   KATEGORIE AUSWÄHLEN
===================================================== */

function setActiveCategory(category) {

    activeCategory =
        category;


    categoryButtons.forEach(
        button => {

            button.classList.toggle(
                "active",
                button.dataset.category
                    === category
            );

        }
    );


    renderProducts();

}


/* =====================================================
   FILTER ZURÜCKSETZEN
===================================================== */

function resetFilters() {

    activeCategory =
        "all";


    productSearch.value =
        "";


    clearProductSearch.hidden =
        true;


    offerFilter.checked =
        false;


    organicFilter.checked =
        false;


    categoryButtons.forEach(
        button => {

            button.classList.toggle(
                "active",
                button.dataset.category
                    === "all"
            );

        }
    );


    renderProducts();

}


/* =====================================================
   MELDUNGSBOX
===================================================== */

const pickupMessage =
    document.createElement("div");


pickupMessage.className =
    "pickup-message";


pickupMessage.setAttribute(
    "role",
    "status"
);


pickupMessage.setAttribute(
    "aria-live",
    "polite"
);


document.body.appendChild(
    pickupMessage
);


let messageTimer =
    null;


/* =====================================================
   MELDUNG ANZEIGEN
===================================================== */

function showMessage(
    message,
    type = "success"
) {

    pickupMessage.textContent =
        message;


    pickupMessage.classList.remove(
        "visible",
        "error"
    );


    if (type === "error") {

        pickupMessage.classList.add(
            "error"
        );

    }


    pickupMessage.classList.add(
        "visible"
    );


    if (messageTimer) {

        window.clearTimeout(
            messageTimer
        );

    }


    messageTimer =
        window.setTimeout(
            () => {

                pickupMessage.classList.remove(
                    "visible"
                );

            },
            4000
        );

}


/* =====================================================
   PRODUKTKLICKS
===================================================== */

if (productGrid) {

    productGrid.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "button[data-action='add-to-cart']"
                );


            if (!button) {

                return;

            }


            const productCard =
                button.closest(
                    ".product-card"
                );


            if (!productCard) {

                return;

            }


            addProductToCart(
                productCard.dataset.productId
            );

        }
    );

}


/* =====================================================
   PRODUKTSUCHE
===================================================== */

if (productSearch) {

    productSearch.addEventListener(
        "input",
        () => {

            clearProductSearch.hidden =
                productSearch.value.trim()
                === "";


            renderProducts();

        }
    );

}


/* =====================================================
   SUCHE LEEREN
===================================================== */

if (
    clearProductSearch
    && productSearch
) {

    clearProductSearch.addEventListener(
        "click",
        () => {

            productSearch.value =
                "";


            clearProductSearch.hidden =
                true;


            renderProducts();


            productSearch.focus();

        }
    );

}


/* =====================================================
   KATEGORIEBUTTONS
===================================================== */

categoryButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const category =
                    button.dataset.category;


                if (!category) {

                    return;

                }


                setActiveCategory(
                    category
                );

            }
        );

    }
);


/* =====================================================
   ANGEBOTSFILTER
===================================================== */

if (offerFilter) {

    offerFilter.addEventListener(
        "change",
        renderProducts
    );

}


/* =====================================================
   BIOFILTER
===================================================== */

if (organicFilter) {

    organicFilter.addEventListener(
        "change",
        renderProducts
    );

}


/* =====================================================
   FILTER ZURÜCKSETZEN
===================================================== */

if (resetProductFilters) {

    resetProductFilters.addEventListener(
        "click",
        resetFilters
    );

}


/* =====================================================
   SEITE BEIM ZURÜCKKEHREN ERNEUT PRÜFEN

   pageshow wird auch ausgelöst, wenn die Seite über
   die Zurück-Schaltfläche aus dem Browser-Cache
   wiederhergestellt wird.
===================================================== */

window.addEventListener(
    "pageshow",
    () => {

        selectedPickupLocation =
            loadPickupLocation();

        cart =
            loadCart();

        renderPickupLocation(
            selectedPickupLocation
        );

        updateCartCount();

        if (
            selectedPickupLocation
            && isPickupDeadlineValid(
                selectedPickupLocation
            )
        ) {

            renderProducts();

        }

    }
);


/* =====================================================
   START
===================================================== */

selectedPickupLocation =
    loadPickupLocation();


cart =
    loadCart();


if (requiredElementsAvailable) {

    renderPickupLocation(
        selectedPickupLocation
    );


    updateCartCount();


    if (
        selectedPickupLocation
        && isPickupDeadlineValid(
            selectedPickupLocation
        )
    ) {

        renderProducts();

    }

}