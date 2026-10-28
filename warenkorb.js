/* =====================================================
   WEBSHOP PROTOTYP
   WARENKORB V4

   Funktionen:
   - Warenkorb aus localStorage laden
   - Versand und Abholung unterscheiden
   - orderType und pickupLocationId erhalten
   - Abholtermin und Bestellschluss laden
   - 21:15-Uhr-Bestellfrist prüfen
   - Checkout nach Fristablauf sperren
   - Mengen ändern
   - Produkte entfernen
   - Warenwert berechnen
   - passendes Sortiment verlinken
===================================================== */


/* =====================================================
   EINSTELLUNGEN
===================================================== */

const cartStorageKey =
    "webshopCart";

const orderTypeStorageKey =
    "webshopOrderType";

const pickupLocationStorageKey =
    "webshopPickupLocation";

const pickupOrderType =
    "pickup";

const shippingOrderType =
    "shipping";


/* =====================================================
   HTML-ELEMENTE
===================================================== */

const cartItemsContainer =
    document.querySelector("#cartItems");

const emptyCart =
    document.querySelector("#emptyCart");

const cartItemCount =
    document.querySelector("#cartItemCount");

const subtotalElement =
    document.querySelector("#subtotal");

const totalElement =
    document.querySelector("#total");

const checkoutButton =
    document.querySelector("#checkoutButton");

const continueShoppingLink =
    document.querySelector("#continueShoppingLink");

const fulfillmentLabel =
    document.querySelector("#fulfillmentLabel");

const fulfillmentValue =
    document.querySelector("#fulfillmentValue");

const cartInformationTitle =
    document.querySelector("#cartInformationTitle");

const cartInformationText =
    document.querySelector("#cartInformationText");


/* =====================================================
   GRUNDPRÜFUNG
===================================================== */

const requiredElementsAvailable =
    cartItemsContainer
    && emptyCart
    && cartItemCount
    && subtotalElement
    && totalElement
    && checkoutButton
    && continueShoppingLink
    && fulfillmentLabel
    && fulfillmentValue
    && cartInformationTitle
    && cartInformationText;


if (!requiredElementsAvailable) {

    console.error(
        "Der Warenkorb konnte nicht vollständig gestartet werden. "
        + "Mindestens ein benötigtes HTML-Element fehlt."
    );

}


/* =====================================================
   PREIS FORMATIEREN
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

    const price =
        Number(value);


    if (!Number.isFinite(price)) {

        return "0,00 €";

    }


    return currencyFormatter.format(
        price
    );

}


/* =====================================================
   HTML ABSICHERN
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
   DATUM AUS LOCALSTORAGE LESEN
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
   BESTELLWEG NORMALISIEREN

   Ältere Warenkorbpositionen ohne orderType werden
   als Versandprodukte behandelt.
===================================================== */

function normalizeOrderType(value) {

    const orderType =
        String(value || "")
            .trim()
            .toLowerCase();


    if (
        orderType
        === pickupOrderType
    ) {

        return pickupOrderType;

    }


    return shippingOrderType;

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

   Neben den Standortdaten werden auch der konkrete
   Abholtermin und der Bestellschluss übernommen.
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
            "Der Abholstandort konnte nicht gelesen werden:",
            error
        );


        return null;

    }

}


/* =====================================================
   BESTELLFRIST ERMITTELN
===================================================== */

function getPickupDeadline() {

    if (!selectedPickupLocation) {

        return null;

    }


    return parseStoredDate(
        selectedPickupLocation.orderDeadline
    );

}


/* =====================================================
   BESTELLFRIST PRÜFEN

   Die Bestellung bleibt bis zum gespeicherten
   Bestellschluss möglich.
===================================================== */

function isPickupDeadlineValid() {

    const deadline =
        getPickupDeadline();


    if (!deadline) {

        return false;

    }


    return (
        Date.now()
        <= deadline.getTime()
    );

}


/* =====================================================
   BESTELLWEG DES WARENKORBS ERMITTELN
===================================================== */

function getCartOrderType() {

    if (cart.length === 0) {

        return "";

    }


    const pickupProduct =
        cart.find(
            item =>
                item.orderType
                === pickupOrderType
        );


    if (pickupProduct) {

        return pickupOrderType;

    }


    return shippingOrderType;

}


/* =====================================================
   GEMISCHTE BESTELLWEGE PRÜFEN
===================================================== */

function cartHasMixedOrderTypes() {

    if (cart.length < 2) {

        return false;

    }


    const orderTypes =
        new Set(
            cart.map(
                item =>
                    normalizeOrderType(
                        item.orderType
                    )
            )
        );


    return (
        orderTypes.size > 1
    );

}


/* =====================================================
   ABHOLPOSITIONEN PRÜFEN
===================================================== */

function cartHasInvalidPickupItems() {

    if (
        getCartOrderType()
        !== pickupOrderType
    ) {

        return false;

    }


    if (!selectedPickupLocation) {

        return true;

    }


    return cart.some(
        item =>
            item.orderType === pickupOrderType
            && Number(
                item.pickupLocationId
            ) !== selectedPickupLocation.id
    );

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


        const orderType =
            getCartOrderType();


        if (orderType) {

            localStorage.setItem(
                orderTypeStorageKey,
                orderType
            );

        } else {

            localStorage.removeItem(
                orderTypeStorageKey
            );

        }


        return true;

    } catch (error) {

        console.error(
            "Der Warenkorb konnte nicht gespeichert werden:",
            error
        );


        window.alert(
            "Der Warenkorb konnte nicht gespeichert werden."
        );


        return false;

    }

}


/* =====================================================
   GESAMTMENGE BERECHNEN
===================================================== */

function calculateTotalQuantity() {

    return cart.reduce(
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

}


/* =====================================================
   WARENWERT BERECHNEN
===================================================== */

function calculateSubtotal() {

    return cart.reduce(
        (sum, item) => {

            return (
                sum
                + Number(item.price)
                * Number(item.quantity)
            );

        },
        0
    );

}


/* =====================================================
   BESTELLWEG-BEZEICHNUNG
===================================================== */

function getOrderTypeLabel(item) {

    if (
        item.orderType
        === pickupOrderType
    ) {

        return "📍 Abholung";

    }


    return "📦 Versand";

}


/* =====================================================
   ABHOLSTANDORT FÜR POSITION ANZEIGEN
===================================================== */

function getPickupLocationLabel(item) {

    if (
        item.orderType
        !== pickupOrderType
    ) {

        return "";

    }


    if (
        !selectedPickupLocation
        || Number(
            item.pickupLocationId
        ) !== selectedPickupLocation.id
    ) {

        return `
            <p class="cart-item-pickup-location warning">
                Abholstandort oder Abholtermin nicht verfügbar
            </p>
        `;

    }


    return `
        <p class="cart-item-pickup-location">

            ${escapeHtml(
                selectedPickupLocation.name
            )}

            <span>
                ${escapeHtml(
                    selectedPickupLocation.pickupDateLabel
                )},
                ${escapeHtml(
                    selectedPickupLocation.time
                )}
            </span>

        </p>
    `;

}


/* =====================================================
   PRODUKTBILD ERZEUGEN
===================================================== */

function createCartItemImage(item) {

    if (item.image) {

        return `
            <div class="cart-item-image">

                <img
                    src="${escapeHtml(item.image)}"
                    alt="${escapeHtml(item.name)}"
                >

            </div>
        `;

    }


    return `
        <div
            class="cart-item-image cart-item-placeholder"
            aria-label="Kein Produktbild für ${escapeHtml(item.name)}"
        >
            PRODUKTBILD
        </div>
    `;

}


/* =====================================================
   WARENKORBPOSITION ERZEUGEN
===================================================== */

function createCartItem(item) {

    const itemTotal =
        Number(item.price)
        * Number(item.quantity);


    return `
        <article
            class="cart-item"
            data-cart-item-id="${escapeHtml(item.id)}"
            data-order-type="${escapeHtml(item.orderType)}"
        >

            ${createCartItemImage(item)}

            <div class="cart-item-content">

                <div class="cart-item-heading">

                    <p class="cart-item-category">
                        ${escapeHtml(item.category)}
                    </p>

                    <h2>
                        ${escapeHtml(item.name)}
                    </h2>

                    <button
                        class="remove-item-button"
                        type="button"
                        data-action="remove"
                        aria-label="${escapeHtml(item.name)} entfernen"
                        title="Produkt entfernen"
                    >
                        ×
                    </button>

                </div>

                <p class="cart-item-unit">
                    ${escapeHtml(item.unit)}
                </p>

                <p class="cart-item-order-type">
                    ${getOrderTypeLabel(item)}
                </p>

                ${getPickupLocationLabel(item)}

                <div class="cart-item-bottom">

                    <div
                        class="quantity-control"
                        aria-label="Menge für ${escapeHtml(item.name)}"
                    >

                        <button
                            type="button"
                            data-action="decrease"
                            aria-label="Menge verringern"
                        >
                            −
                        </button>

                        <span
                            class="quantity-value"
                            aria-live="polite"
                        >
                            ${item.quantity}
                        </span>

                        <button
                            type="button"
                            data-action="increase"
                            aria-label="Menge erhöhen"
                        >
                            +
                        </button>

                    </div>

                    <div class="cart-item-prices">

                        <span>
                            ${formatPrice(item.price)}
                            pro Stück
                        </span>

                        <strong>
                            ${formatPrice(itemTotal)}
                        </strong>

                    </div>

                </div>

            </div>

        </article>
    `;

}


/* =====================================================
   ABHOLINFORMATION DARSTELLEN
===================================================== */

function renderPickupInformation() {

    continueShoppingLink.href =
        "abholsortiment.html";


    fulfillmentLabel.textContent =
        "Abholung";


    fulfillmentValue.textContent =
        "0,00 €";


    cartInformationTitle.textContent =
        "Abholung";


    if (!selectedPickupLocation) {

        cartInformationText.textContent =
            "Der Abholstandort oder Abholtermin ist nicht "
            + "mehr verfügbar. Bitte wähle den Standort "
            + "erneut aus.";


        return;

    }


    if (
        cartHasInvalidPickupItems()
    ) {

        cartInformationText.textContent =
            "Mindestens ein Produkt gehört zu einem "
            + "anderen Abholstandort. Bitte prüfe "
            + "deinen Warenkorb.";


        return;

    }


    if (
        !isPickupDeadlineValid()
    ) {

        cartInformationText.textContent =
            "Die Bestellfrist für diesen Abholtermin ist "
            + "abgelaufen. Bitte wähle einen neuen "
            + "Abholtermin aus.";


        return;

    }


    cartInformationText.textContent =
        `Abholung bei ${selectedPickupLocation.name}. `
        + `Termin: ${selectedPickupLocation.pickupDateLabel}, `
        + `${selectedPickupLocation.time}. `
        + `Bestellschluss: `
        + `${selectedPickupLocation.orderDeadlineLabel} Uhr.`;

}


/* =====================================================
   VERSANDINFORMATION DARSTELLEN
===================================================== */

function renderShippingInformation() {

    continueShoppingLink.href =
        "versand.html";


    fulfillmentLabel.textContent =
        "Versand";


    fulfillmentValue.textContent =
        "wird später berechnet";


    cartInformationTitle.textContent =
        "Versand";


    cartInformationText.textContent =
        "Lieferadresse und Versandkosten "
        + "werden im Checkout ergänzt.";

}


/* =====================================================
   LEEREN WARENKORB DARSTELLEN
===================================================== */

function renderEmptyCartInformation() {

    continueShoppingLink.href =
        "index.html";


    fulfillmentLabel.textContent =
        "Bestellart";


    fulfillmentValue.textContent =
        "–";


    cartInformationTitle.textContent =
        "Abholung oder Versand";


    cartInformationText.textContent =
        "Wähle zuerst einen Bestellweg und "
        + "füge Produkte zum Warenkorb hinzu.";

}


/* =====================================================
   BESTELLWEG DARSTELLEN
===================================================== */

function renderOrderTypeInformation() {

    const orderType =
        getCartOrderType();


    if (
        orderType
        === pickupOrderType
    ) {

        renderPickupInformation();

        return;

    }


    if (
        orderType
        === shippingOrderType
    ) {

        renderShippingInformation();

        return;

    }


    renderEmptyCartInformation();

}


/* =====================================================
   CHECKOUT-STATUS AKTUALISIEREN
===================================================== */

function updateCheckoutAvailability() {

    const orderType =
        getCartOrderType();


    checkoutButton.disabled =
        false;


    checkoutButton.title =
        "";


    if (cart.length === 0) {

        checkoutButton.disabled =
            true;


        checkoutButton.title =
            "Der Warenkorb ist leer.";


        return;

    }


    if (
        cartHasMixedOrderTypes()
    ) {

        checkoutButton.disabled =
            true;


        checkoutButton.title =
            "Abhol- und Versandprodukte können "
            + "nicht gemeinsam bestellt werden.";


        return;

    }


    if (
        orderType !== pickupOrderType
    ) {

        return;

    }


    if (!selectedPickupLocation) {

        checkoutButton.disabled =
            true;


        checkoutButton.title =
            "Bitte wähle erneut einen Abholstandort aus.";


        return;

    }


    if (
        cartHasInvalidPickupItems()
    ) {

        checkoutButton.disabled =
            true;


        checkoutButton.title =
            "Mindestens ein Produkt gehört zu einem "
            + "anderen Abholstandort.";


        return;

    }


    if (
        !isPickupDeadlineValid()
    ) {

        checkoutButton.disabled =
            true;


        checkoutButton.title =
            "Die Bestellfrist für diesen "
            + "Abholtermin ist abgelaufen.";

    }

}


/* =====================================================
   WARENKORB DARSTELLEN
===================================================== */

function renderCart() {

    if (!requiredElementsAvailable) {

        return;

    }


    const cartIsEmpty =
        cart.length === 0;


    emptyCart.hidden =
        !cartIsEmpty;


    cartItemsContainer.hidden =
        cartIsEmpty;


    cartItemsContainer.innerHTML =
        cartIsEmpty
            ? ""
            : cart
                .map(createCartItem)
                .join("");


    const quantity =
        calculateTotalQuantity();


    cartItemCount.textContent =
        quantity === 1
            ? "1 Artikel"
            : `${quantity} Artikel`;


    const subtotal =
        calculateSubtotal();


    subtotalElement.textContent =
        formatPrice(subtotal);


    totalElement.textContent =
        formatPrice(subtotal);


    renderOrderTypeInformation();


    updateCheckoutAvailability();

}


/* =====================================================
   POSITION SUCHEN
===================================================== */

function findCartItem(itemId) {

    return cart.find(
        item =>
            String(item.id)
            === String(itemId)
    );

}


/* =====================================================
   MENGE ERHÖHEN
===================================================== */

function increaseQuantity(itemId) {

    const item =
        findCartItem(itemId);


    if (!item) {

        return;

    }


    /*
       Bei einer Abholbestellung wird die Frist auch
       beim Erhöhen der Menge erneut geprüft.
    */

    if (
        item.orderType === pickupOrderType
        && !isPickupDeadlineValid()
    ) {

        window.alert(
            "Die Bestellfrist für diesen Abholtermin "
            + "ist abgelaufen. Die Menge kann nicht "
            + "mehr erhöht werden."
        );


        renderCart();


        return;

    }


    item.quantity += 1;


    if (saveCart()) {

        renderCart();

    }

}


/* =====================================================
   MENGE VERRINGERN
===================================================== */

function decreaseQuantity(itemId) {

    const item =
        findCartItem(itemId);


    if (!item) {

        return;

    }


    if (item.quantity <= 1) {

        removeCartItem(
            itemId
        );


        return;

    }


    /*
       Das Verringern bleibt auch nach Fristablauf
       möglich. Der Kunde muss Produkte weiterhin
       entfernen können.
    */

    item.quantity -= 1;


    if (saveCart()) {

        renderCart();

    }

}


/* =====================================================
   PRODUKT ENTFERNEN
===================================================== */

function removeCartItem(itemId) {

    const itemIndex =
        cart.findIndex(
            item =>
                String(item.id)
                === String(itemId)
        );


    if (itemIndex === -1) {

        return;

    }


    cart.splice(
        itemIndex,
        1
    );


    if (saveCart()) {

        renderCart();

    }

}


/* =====================================================
   PRODUKTBUTTONS
===================================================== */

if (cartItemsContainer) {

    cartItemsContainer.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "button[data-action]"
                );


            if (!button) {

                return;

            }


            const cartItemElement =
                button.closest(
                    ".cart-item"
                );


            if (!cartItemElement) {

                return;

            }


            const itemId =
                cartItemElement
                    .dataset
                    .cartItemId;


            const action =
                button.dataset.action;


            if (action === "increase") {

                increaseQuantity(
                    itemId
                );


                return;

            }


            if (action === "decrease") {

                decreaseQuantity(
                    itemId
                );


                return;

            }


            if (action === "remove") {

                removeCartItem(
                    itemId
                );

            }

        }
    );

}


/* =====================================================
   CHECKOUT PRÜFEN
===================================================== */

function validateCheckout() {

    if (cart.length === 0) {

        window.alert(
            "Dein Warenkorb ist leer."
        );


        return false;

    }


    if (
        cartHasMixedOrderTypes()
    ) {

        window.alert(
            "Abhol- und Versandprodukte können momentan "
            + "nicht gemeinsam bestellt werden."
        );


        return false;

    }


    const orderType =
        getCartOrderType();


    if (
        orderType
        !== pickupOrderType
    ) {

        return true;

    }


    if (!selectedPickupLocation) {

        window.alert(
            "Der ausgewählte Abholstandort oder "
            + "Abholtermin ist nicht mehr verfügbar. "
            + "Bitte wähle erneut einen Standort aus."
        );


        return false;

    }


    if (
        cartHasInvalidPickupItems()
    ) {

        window.alert(
            "Mindestens ein Produkt gehört zu einem "
            + "anderen Abholstandort. Bitte prüfe "
            + "deinen Warenkorb."
        );


        return false;

    }


    /*
       Entscheidend:
       Unmittelbar vor der Weiterleitung wird
       die Bestellfrist erneut geprüft.
    */

    if (
        !isPickupDeadlineValid()
    ) {

        window.alert(
            "Die Bestellfrist für diesen Abholtermin "
            + "ist inzwischen abgelaufen. "
            + "Bestellungen müssen spätestens am "
            + "Vortag bis 21:15 Uhr abgeschlossen werden. "
            + "Bitte wähle einen neuen Abholtermin aus."
        );


        renderCart();


        return false;

    }


    return true;

}


/* =====================================================
   WEITER ZUM CHECKOUT
===================================================== */

if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        () => {

            if (
                !validateCheckout()
            ) {

                return;

            }


            localStorage.setItem(
                orderTypeStorageKey,
                getCartOrderType()
            );


            window.location.href =
                "checkout.html";

        }
    );

}


/* =====================================================
   SEITE NACH BROWSER-ZURÜCK ERNEUT PRÜFEN

   pageshow wird auch ausgelöst, wenn die Seite aus
   dem Browser-Cache wiederhergestellt wird.
===================================================== */

window.addEventListener(
    "pageshow",
    () => {

        cart =
            loadCart();


        selectedPickupLocation =
            loadPickupLocation();


        renderCart();

    }
);


/* =====================================================
   START
===================================================== */

let cart =
    loadCart();


let selectedPickupLocation =
    loadPickupLocation();


if (cart.length > 0) {

    saveCart();

}


renderCart();