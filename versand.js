/* =====================================================
   WEBSHOP PROTOTYP
   VERSANDSEITE V3

   Funktionen:
   - Produktsuche
   - Kategoriefilter
   - Ergebnisanzahl
   - Produkte zum Warenkorb hinzufügen
   - Mengen vorhandener Produkte erhöhen
   - Warenkorb im localStorage speichern
   - Bestellart "shipping" speichern
   - Abholung und Versand nicht vermischen
===================================================== */


/* =====================================================
   EINSTELLUNGEN
===================================================== */

const cartStorageKey =
    "webshopCart";

const orderTypeStorageKey =
    "webshopOrderType";

const shippingOrderType =
    "shipping";

const pickupOrderType =
    "pickup";


/* =====================================================
   HTML-ELEMENTE
===================================================== */

const productSearch =
    document.querySelector("#productSearch");

const categoryFilter =
    document.querySelector("#categoryFilter");

const productGrid =
    document.querySelector(".product-grid");

const productCards =
    Array.from(
        document.querySelectorAll(
            ".product-card"
        )
    );

const productCount =
    document.querySelector(".product-count");

const cartCount =
    document.querySelector(".cart-count");

const cartButtons =
    Array.from(
        document.querySelectorAll(
            ".cart-button"
        )
    );

const resetProductFiltersButton =
    document.querySelector(
        "#resetProductFilters"
    );


/* =====================================================
   GRUNDPRÜFUNG
===================================================== */

const requiredElementsAvailable =
    productSearch
    && categoryFilter
    && productGrid
    && productCount
    && cartCount;


if (!requiredElementsAvailable) {

    console.error(
        "Die Versandseite konnte nicht vollständig "
        + "gestartet werden. Mindestens ein benötigtes "
        + "HTML-Element fehlt."
    );

}


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
        .replaceAll("ß", "ss")

        .replaceAll("&", "")

        .replace(
            /\s+/g,
            ""
        );

}


/* =====================================================
   KATEGORIE NORMALISIEREN
===================================================== */

function getCategoryValue(categoryText) {

    const normalizedCategory =
        normalizeText(
            categoryText
        );


    /*
       Trockenartikel
    */

    if (
        normalizedCategory.includes(
            "trockenartikel"
        )
    ) {
        return "trockenartikel";
    }


    /*
       Snacks & Süßes

       Mehrere mögliche Select-Werte werden
       unterstützt.
    */

    if (
        normalizedCategory.includes("snack")
        || normalizedCategory.includes("suess")
    ) {
        return "snacks";
    }


    /*
       Getränke
    */

    if (
        normalizedCategory.includes(
            "getraenk"
        )
    ) {
        return "getraenke";
    }


    /*
       Tierbedarf
    */

    if (
        normalizedCategory.includes(
            "tierbedarf"
        )
    ) {
        return "tierbedarf";
    }


    /*
       Non-Food
    */

    if (
        normalizedCategory.includes("nonfood")
        || normalizedCategory.includes("non-food")
    ) {
        return "non-food";
    }


    return normalizedCategory;

}


/* =====================================================
   PREIS UMWANDELN

   Beispiel:

   "2,99 €"
        ↓
   2.99
===================================================== */

function parseGermanPrice(priceText) {

    const cleanedPrice =
        String(priceText)
            .replace("€", "")
            .replace(
                /\s/g,
                ""
            )
            .replaceAll(".", "")
            .replace(",", ".")
            .trim();


    const price =
        Number(cleanedPrice);


    if (!Number.isFinite(price)) {
        return 0;
    }


    return price;

}


/* =====================================================
   PRODUKTBILD ERMITTELN
===================================================== */

function getProductImage(productCard) {

    const imageElement =
        productCard.querySelector(
            ".product-image img"
        );


    if (!imageElement) {
        return "";
    }


    return String(
        imageElement.getAttribute("src")
        || ""
    );

}


/* =====================================================
   PRODUKTDATEN AUS HTML AUSLESEN
===================================================== */

function getProductInformation(
    productCard,
    fallbackIndex = 0
) {

    const nameElement =
        productCard.querySelector("h3");

    const categoryElement =
        productCard.querySelector(
            ".product-category"
        );

    const unitElement =
        productCard.querySelector(
            ".product-unit"
        );

    const priceElement =
        productCard.querySelector(
            ".price"
        );


    if (
        !nameElement
        || !priceElement
    ) {

        console.error(
            "Eine Produktkarte enthält nicht "
            + "alle erforderlichen Produktdaten.",
            productCard
        );


        return null;

    }


    /*
       Wenn später data-product-id direkt
       im HTML vorhanden ist, wird diese ID
       bevorzugt.

       Ansonsten wird eine stabile Demo-ID
       aus dem Kartenindex erzeugt.
    */

    const productId =
        productCard.dataset.productId
        || `shipping-product-${fallbackIndex + 1}`;


    const categoryLabel =
        categoryElement
            ? categoryElement.textContent.trim()
            : "";


    return {

        id:
            String(productId),

        name:
            nameElement.textContent.trim(),

        category:
            categoryLabel,

        categoryValue:
            getCategoryValue(
                categoryLabel
            ),

        unit:
            unitElement
                ? unitElement.textContent.trim()
                : "",

        price:
            parseGermanPrice(
                priceElement.textContent
            ),

        image:
            getProductImage(
                productCard
            ),

        orderType:
            shippingOrderType,

        pickupLocationId:
            null

    };

}


/* =====================================================
   PRODUKTDATEN VORBEREITEN
===================================================== */

productCards.forEach(
    (productCard, index) => {

        const product =
            getProductInformation(
                productCard,
                index
            );


        if (!product) {
            return;
        }


        /*
           ID für spätere Verarbeitung
           direkt an der Produktkarte ablegen.
        */

        productCard.dataset.productId =
            product.id;


        productCard.dataset.categoryValue =
            product.categoryValue;

    }
);


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
   BESTELLART NORMALISIEREN
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
       Ältere Produkte ohne orderType stammen
       aus der bisherigen Versandversion.

       Deshalb werden sie als Versand behandelt.
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


                    const rawPickupLocationId =
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
                                rawPickupLocationId
                            )
                                ? rawPickupLocationId
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


        /*
           Wenn Versandprodukte im Warenkorb liegen,
           wird zusätzlich die aktuelle Bestellart
           gespeichert.
        */

        if (
            cart.length > 0
            && cart.every(
                item =>
                    item.orderType
                    === shippingOrderType
            )
        ) {

            localStorage.setItem(
                orderTypeStorageKey,
                shippingOrderType
            );

        }


        return true;

    } catch (error) {

        console.error(
            "Der Warenkorb konnte nicht gespeichert werden:",
            error
        );


        showCartMessage(
            "Der Warenkorb konnte nicht gespeichert werden.",
            "error"
        );


        return false;

    }

}


/* =====================================================
   GESAMTMENGE BERECHNEN
===================================================== */

function getTotalCartQuantity() {

    return cart.reduce(
        (total, item) => {

            return (
                total
                + Math.max(
                    0,
                    Number(item.quantity)
                    || 0
                )
            );

        },
        0
    );

}


/* =====================================================
   WARENKORBANZEIGE AKTUALISIEREN
===================================================== */

function updateCartDisplay() {

    if (!cartCount) {
        return;
    }


    const totalQuantity =
        getTotalCartQuantity();


    cartCount.textContent =
        String(totalQuantity);


    cartCount.setAttribute(
        "aria-label",
        `${totalQuantity} Artikel im Warenkorb`
    );

}


/* =====================================================
   LEERZUSTAND ERSTELLEN
===================================================== */

const emptyState =
    document.createElement("div");


emptyState.className =
    "product-empty-state";


emptyState.hidden =
    true;


emptyState.innerHTML =
    `
        <div aria-hidden="true">
            🔍
        </div>

        <h3>
            Keine passenden Produkte gefunden
        </h3>

        <p>
            Ändere deine Suche oder wähle
            eine andere Kategorie.
        </p>

        <button
            id="resetProductFilters"
            type="button"
        >
            Filter zurücksetzen
        </button>
    `;


if (productGrid) {

    productGrid.insertAdjacentElement(
        "afterend",
        emptyState
    );

}


/* =====================================================
   PRODUKTANZAHL
===================================================== */

function updateProductCount(count) {

    if (!productCount) {
        return;
    }


    productCount.textContent =
        count === 1
            ? "1 Produkt"
            : `${count} Produkte`;

}


/* =====================================================
   PRODUKTE FILTERN
===================================================== */

function filterProducts() {

    if (
        !productSearch
        || !categoryFilter
    ) {
        return;
    }


    const searchQuery =
        normalizeText(
            productSearch.value
        );


    const selectedCategory =
        getCategoryValue(
            categoryFilter.value
        );


    let visibleProducts =
        0;


    productCards.forEach(
        (productCard, index) => {

            const product =
                getProductInformation(
                    productCard,
                    index
                );


            if (!product) {

                productCard.hidden =
                    true;

                return;

            }


            const searchableText =
                normalizeText(
                    `
                        ${product.name}
                        ${product.category}
                        ${product.unit}
                    `
                );


            const matchesSearch =
                searchQuery === ""
                || searchableText.includes(
                    searchQuery
                );


            const matchesCategory =
                selectedCategory === ""
                || selectedCategory === "all"
                || product.categoryValue
                    === selectedCategory;


            const visible =
                matchesSearch
                && matchesCategory;


            productCard.hidden =
                !visible;


            if (visible) {

                visibleProducts += 1;

            }

        }
    );


    updateProductCount(
        visibleProducts
    );


    if (emptyState) {

        emptyState.hidden =
            visibleProducts !== 0;

    }

}


/* =====================================================
   FILTER ZURÜCKSETZEN
===================================================== */

function resetProductFilters() {

    if (productSearch) {

        productSearch.value =
            "";

    }


    if (categoryFilter) {

        categoryFilter.value =
            "";

    }


    filterProducts();


    if (productSearch) {

        productSearch.focus();

    }

}


/* =====================================================
   PRODUKT IM WARENKORB SUCHEN
===================================================== */

function findCartItem(productId) {

    return cart.find(
        item =>
            String(item.id)
            === String(productId)
            && item.orderType
                === shippingOrderType
    );

}


/* =====================================================
   ANDEREN BESTELLWEG PRÜFEN
===================================================== */

function cartContainsPickupProducts() {

    return cart.some(
        item =>
            item.orderType
            === pickupOrderType
    );

}


/* =====================================================
   PRODUKT HINZUFÜGEN
===================================================== */

function addProductToCart(
    productCard,
    button
) {

    /*
       Abholung und Versand sollen in V1 nicht
       in einer Bestellung gemischt werden.
    */

    if (cartContainsPickupProducts()) {

        showCartMessage(
            "In deinem Warenkorb befinden sich bereits "
            + "Produkte zur Abholung. Abhol- und "
            + "Versandprodukte können momentan nicht "
            + "gemeinsam bestellt werden.",
            "error"
        );


        return;

    }


    const cardIndex =
        productCards.indexOf(
            productCard
        );


    const product =
        getProductInformation(
            productCard,
            cardIndex
        );


    if (!product) {

        showCartMessage(
            "Das Produkt konnte nicht zum Warenkorb hinzugefügt werden.",
            "error"
        );


        return;

    }


    const existingItem =
        findCartItem(
            product.id
        );


    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({

            id:
                product.id,

            name:
                product.name,

            category:
                product.category,

            unit:
                product.unit,

            price:
                product.price,

            quantity:
                1,

            image:
                product.image,

            /*
               WICHTIG:

               Versandprodukte werden ab jetzt
               ausdrücklich als Versand gekennzeichnet.
            */

            orderType:
                shippingOrderType,

            pickupLocationId:
                null

        });

    }


    localStorage.setItem(
        orderTypeStorageKey,
        shippingOrderType
    );


    if (!saveCart()) {
        return;
    }


    updateCartDisplay();


    showButtonConfirmation(
        button
    );


    showCartMessage(
        `${product.name} wurde zum Warenkorb hinzugefügt.`,
        "success"
    );

}


/* =====================================================
   BUTTON-RÜCKMELDUNG
===================================================== */

function showButtonConfirmation(button) {

    if (!button) {
        return;
    }


    const originalContent =
        button.innerHTML;


    button.classList.add(
        "added"
    );


    button.innerHTML =
        "✓";


    window.setTimeout(
        () => {

            button.classList.remove(
                "added"
            );


            button.innerHTML =
                originalContent;

        },
        900
    );

}


/* =====================================================
   WARENKORB-MELDUNG
===================================================== */

const cartMessage =
    document.createElement("div");


cartMessage.className =
    "cart-message";


cartMessage.setAttribute(
    "role",
    "status"
);


cartMessage.setAttribute(
    "aria-live",
    "polite"
);


document.body.appendChild(
    cartMessage
);


let messageTimer =
    null;


/* =====================================================
   MELDUNG ANZEIGEN
===================================================== */

function showCartMessage(
    message,
    type = "success"
) {

    cartMessage.textContent =
        message;


    cartMessage.classList.remove(
        "visible",
        "error"
    );


    if (type === "error") {

        cartMessage.classList.add(
            "error"
        );

    }


    cartMessage.classList.add(
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

                cartMessage.classList.remove(
                    "visible"
                );

            },
            3000
        );

}


/* =====================================================
   EVENT-LISTENER
===================================================== */

if (productSearch) {

    productSearch.addEventListener(
        "input",
        filterProducts
    );

}


if (categoryFilter) {

    categoryFilter.addEventListener(
        "change",
        filterProducts
    );

}


/* =====================================================
   WARENKORBBUTTONS
===================================================== */

cartButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const productCard =
                    button.closest(
                        ".product-card"
                    );


                if (!productCard) {

                    console.error(
                        "Zum Warenkorb-Button wurde "
                        + "keine Produktkarte gefunden."
                    );


                    return;

                }


                addProductToCart(
                    productCard,
                    button
                );

            }
        );

    }
);


/* =====================================================
   FILTER-ZURÜCKSETZEN-BUTTON

   Der Button wird dynamisch im Leerzustand erzeugt.
   Deshalb Event Delegation.
===================================================== */

if (emptyState) {

    emptyState.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "#resetProductFilters"
                );


            if (!button) {
                return;
            }


            resetProductFilters();

        }
    );

}


/* =====================================================
   START
===================================================== */

let cart =
    loadCart();


/*
   Ältere Warenkorbpositionen aus Versand V2
   werden beim Laden automatisch auf
   orderType = "shipping" normalisiert.

   Anschließend speichern wir den bereinigten
   Stand erneut.
*/

if (
    cart.length > 0
    && !cartContainsPickupProducts()
) {

    saveCart();

}


updateCartDisplay();

filterProducts();
