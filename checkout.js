/* =====================================================
   WEBSHOP PROTOTYP
   CHECKOUT V3

   Funktionen:
   - Gastbestellung starten
   - Versand und Abholung unterscheiden
   - Kontaktdaten inklusive Telefonnummer prüfen
   - Liefer- und Rechnungsadresse prüfen
   - gespeicherten Abholstandort anzeigen
   - konkreten Abholtermin anzeigen
   - Bestellschluss anzeigen
   - 21:15-Uhr-Bestellfrist mehrfach prüfen
   - Bestellung zur Prüfung zusammenfassen
   - Demo-Bestellabschluss durchführen

   BESTELLFRIST:
   Abholbestellungen müssen spätestens am Vortag
   des Abholtermins bis 21:15 Uhr abgeschlossen werden.

   WICHTIG:
   Es werden keine personenbezogenen Daten dauerhaft
   gespeichert oder an ein Backend übertragen.
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
   CHECKOUT-SCHRITTE
===================================================== */

const checkoutStep1 =
    document.querySelector("#checkoutStep1");

const checkoutStep2 =
    document.querySelector("#checkoutStep2");

const checkoutStep3 =
    document.querySelector("#checkoutStep3");

const checkoutSuccess =
    document.querySelector("#checkoutSuccess");


/* =====================================================
   FORTSCHRITT
===================================================== */

const progressStep1 =
    document.querySelector("#progressStep1");

const progressStep2 =
    document.querySelector("#progressStep2");

const progressStep3 =
    document.querySelector("#progressStep3");

const progressLine1 =
    document.querySelector("#progressLine1");

const progressLine2 =
    document.querySelector("#progressLine2");


/* =====================================================
   SCHRITT 1
===================================================== */

const continueAsGuestButton =
    document.querySelector("#continueAsGuest");


/* =====================================================
   GASTFORMULAR
===================================================== */

const guestCheckoutForm =
    document.querySelector("#guestCheckoutForm");

const guestFirstNameInput =
    document.querySelector("#guestFirstName");

const guestLastNameInput =
    document.querySelector("#guestLastName");

const guestEmailInput =
    document.querySelector("#guestEmail");

const guestPhoneInput =
    document.querySelector("#guestPhone");

const reviewOrderButton =
    document.querySelector("#reviewOrderButton");


/* =====================================================
   BESTELLART
===================================================== */

const shippingOrderInformation =
    document.querySelector(
        "#shippingOrderInformation"
    );

const pickupOrderInformation =
    document.querySelector(
        "#pickupOrderInformation"
    );


/* =====================================================
   ABHOLUNG
===================================================== */

const pickupCheckoutSection =
    document.querySelector(
        "#pickupCheckoutSection"
    );

const checkoutPickupLocationName =
    document.querySelector(
        "#checkoutPickupLocationName"
    );

const checkoutPickupLocationAddress =
    document.querySelector(
        "#checkoutPickupLocationAddress"
    );

const checkoutPickupDay =
    document.querySelector(
        "#checkoutPickupDay"
    );

const checkoutPickupTime =
    document.querySelector(
        "#checkoutPickupTime"
    );


/* =====================================================
   LIEFERADRESSE
===================================================== */

const shippingAddressSection =
    document.querySelector(
        "#shippingAddressSection"
    );

const shippingFirstNameInput =
    document.querySelector(
        "#shippingFirstName"
    );

const shippingLastNameInput =
    document.querySelector(
        "#shippingLastName"
    );

const shippingStreetInput =
    document.querySelector(
        "#shippingStreet"
    );

const shippingHouseNumberInput =
    document.querySelector(
        "#shippingHouseNumber"
    );

const shippingCityInput =
    document.querySelector(
        "#shippingCity"
    );

const shippingZipInput =
    document.querySelector(
        "#shippingZip"
    );

const shippingCountryInput =
    document.querySelector(
        "#shippingCountry"
    );


/* =====================================================
   RECHNUNGSADRESSE
===================================================== */

const billingAddressSection =
    document.querySelector(
        "#billingAddressSection"
    );

const differentBillingAddress =
    document.querySelector(
        "#differentBillingAddress"
    );

const billingFields =
    document.querySelector(
        "#billingFields"
    );

const billingFirstNameInput =
    document.querySelector(
        "#billingFirstName"
    );

const billingLastNameInput =
    document.querySelector(
        "#billingLastName"
    );

const billingStreetInput =
    document.querySelector(
        "#billingStreet"
    );

const billingHouseNumberInput =
    document.querySelector(
        "#billingHouseNumber"
    );

const billingCityInput =
    document.querySelector(
        "#billingCity"
    );

const billingZipInput =
    document.querySelector(
        "#billingZip"
    );


/* =====================================================
   BESTELLÜBERSICHT SCHRITT 2
===================================================== */

const checkoutItems =
    document.querySelector("#checkoutItems");

const checkoutEmptyCart =
    document.querySelector("#checkoutEmptyCart");

const checkoutSubtotal =
    document.querySelector("#checkoutSubtotal");

const checkoutTotal =
    document.querySelector("#checkoutTotal");

const shippingCostRow =
    document.querySelector("#shippingCostRow");


/* =====================================================
   PRÜFANSICHT SCHRITT 3
===================================================== */

const reviewContactName =
    document.querySelector("#reviewContactName");

const reviewContactEmail =
    document.querySelector("#reviewContactEmail");

const reviewContactPhone =
    document.querySelector("#reviewContactPhone");

const reviewShippingCard =
    document.querySelector("#reviewShippingCard");

const reviewShippingAddress =
    document.querySelector("#reviewShippingAddress");

const reviewBillingAddress =
    document.querySelector("#reviewBillingAddress");

const reviewBillingAddressText =
    document.querySelector(
        "#reviewBillingAddressText"
    );

const reviewPickupCard =
    document.querySelector("#reviewPickupCard");

const reviewPickupLocationName =
    document.querySelector(
        "#reviewPickupLocationName"
    );

const reviewPickupLocationAddress =
    document.querySelector(
        "#reviewPickupLocationAddress"
    );

const reviewPickupDateTime =
    document.querySelector(
        "#reviewPickupDateTime"
    );

const reviewOrderItems =
    document.querySelector("#reviewOrderItems");

const reviewOrderTotal =
    document.querySelector("#reviewOrderTotal");

const reviewShippingNote =
    document.querySelector("#reviewShippingNote");

const shippingPaymentPlaceholder =
    document.querySelector(
        "#shippingPaymentPlaceholder"
    );

const pickupPaymentPlaceholder =
    document.querySelector(
        "#pickupPaymentPlaceholder"
    );


/* =====================================================
   BEARBEITEN UND ABSCHLIESSEN
===================================================== */

const editContactDataButton =
    document.querySelector("#editContactData");

const editShippingDataButton =
    document.querySelector("#editShippingData");

const editPickupDataButton =
    document.querySelector("#editPickupData");

const confirmOrderCheckbox =
    document.querySelector("#confirmOrder");

const placeOrderButton =
    document.querySelector("#placeOrderButton");


/* =====================================================
   GRUNDPRÜFUNG
===================================================== */

const requiredElementsAvailable =
    checkoutStep1
    && checkoutStep2
    && checkoutStep3
    && checkoutSuccess
    && progressStep1
    && progressStep2
    && progressStep3
    && progressLine1
    && progressLine2
    && continueAsGuestButton
    && guestCheckoutForm
    && guestFirstNameInput
    && guestLastNameInput
    && guestEmailInput
    && guestPhoneInput
    && reviewOrderButton
    && checkoutItems
    && checkoutEmptyCart
    && checkoutSubtotal
    && checkoutTotal
    && reviewContactName
    && reviewContactEmail
    && reviewContactPhone
    && reviewOrderItems
    && reviewOrderTotal
    && confirmOrderCheckbox
    && placeOrderButton;


if (!requiredElementsAvailable) {

    console.error(
        "Der Checkout konnte nicht vollständig gestartet werden. "
        + "Mindestens ein benötigtes HTML-Element fehlt."
    );

}


/* =====================================================
   PREISFORMATIERUNG
===================================================== */

const currencyFormatter =
    new Intl.NumberFormat(
        "de-DE",
        {
            style:
                "currency",

            currency:
                "EUR"
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
   BESTELLART NORMALISIEREN
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

   Die vollständigen Termin- und Fristdaten aus
   abholung.js werden übernommen.
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
   BESTELLART ERMITTELN
===================================================== */

function getCartOrderType() {

    if (cart.length === 0) {

        const storedOrderType =
            localStorage.getItem(
                orderTypeStorageKey
            );


        return normalizeOrderType(
            storedOrderType
        );

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
   GEMISCHTE BESTELLARTEN PRÜFEN
===================================================== */

function cartHasMixedOrderTypes() {

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
===================================================== */

function isPickupDeadlineValid() {

    if (
        currentOrderType
        !== pickupOrderType
    ) {

        return true;

    }


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
   ABHOLPRODUKTE PRÜFEN
===================================================== */

function cartHasInvalidPickupItems() {

    if (
        currentOrderType
        !== pickupOrderType
    ) {

        return false;

    }


    if (!selectedPickupLocation) {

        return true;

    }


    return cart.some(
        item =>
            item.orderType
                === pickupOrderType
            && Number(
                item.pickupLocationId
            ) !== selectedPickupLocation.id
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
   MELDUNGSBOX
===================================================== */

const checkoutMessage =
    document.createElement("div");


checkoutMessage.className =
    "checkout-message";


checkoutMessage.setAttribute(
    "role",
    "status"
);


checkoutMessage.setAttribute(
    "aria-live",
    "polite"
);


document.body.appendChild(
    checkoutMessage
);


let messageTimer =
    null;


/* =====================================================
   MELDUNG ANZEIGEN
===================================================== */

function showMessage(
    message,
    type = "error"
) {

    checkoutMessage.textContent =
        message;


    checkoutMessage.classList.remove(
        "success",
        "error",
        "visible"
    );


    checkoutMessage.classList.add(
        type,
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

                checkoutMessage.classList.remove(
                    "visible"
                );

            },
            4500
        );

}


/* =====================================================
   SCHRITTE ANZEIGEN
===================================================== */

function showCheckoutStep(stepNumber) {

    checkoutStep1.hidden =
        stepNumber !== 1;

    checkoutStep2.hidden =
        stepNumber !== 2;

    checkoutStep3.hidden =
        stepNumber !== 3;

    checkoutSuccess.hidden =
        true;


    progressStep1.classList.toggle(
        "active",
        stepNumber === 1
    );

    progressStep1.classList.toggle(
        "completed",
        stepNumber > 1
    );


    progressStep2.classList.toggle(
        "active",
        stepNumber === 2
    );

    progressStep2.classList.toggle(
        "completed",
        stepNumber > 2
    );


    progressStep3.classList.toggle(
        "active",
        stepNumber === 3
    );

    progressStep3.classList.toggle(
        "completed",
        false
    );


    progressLine1.classList.toggle(
        "active",
        stepNumber > 1
    );

    progressLine2.classList.toggle(
        "active",
        stepNumber > 2
    );


    window.scrollTo(
        {
            top:
                0,

            behavior:
                "smooth"
        }
    );

}


/* =====================================================
   ABHOLFRIST VALIDIEREN

   Diese Funktion wird an mehreren Stellen aufgerufen:

   - beim Einstieg in den Gastcheckout
   - vor dem Öffnen der Prüfansicht
   - unmittelbar vor dem Bestellabschluss
===================================================== */

function validatePickupDeadline() {

    if (
        currentOrderType
        !== pickupOrderType
    ) {

        return true;

    }


    if (!selectedPickupLocation) {

        showMessage(
            "Der ausgewählte Abholstandort oder "
            + "Abholtermin ist nicht mehr verfügbar. "
            + "Bitte wähle erneut einen Abholstandort aus.",
            "error"
        );


        return false;

    }


    if (
        cartHasInvalidPickupItems()
    ) {

        showMessage(
            "Mindestens ein Produkt gehört zu einem "
            + "anderen Abholstandort. Bitte prüfe "
            + "deinen Warenkorb.",
            "error"
        );


        return false;

    }


    if (
        !isPickupDeadlineValid()
    ) {

        showMessage(
            "Die Bestellfrist für diesen Abholtermin "
            + "ist inzwischen abgelaufen. "
            + "Bestellungen müssen spätestens am "
            + "Vortag bis 21:15 Uhr abgeschlossen werden. "
            + "Bitte wähle einen neuen Abholtermin aus.",
            "error"
        );


        return false;

    }


    return true;

}


/* =====================================================
   BESTELLART KONFIGURIEREN
===================================================== */

function configureOrderType() {

    const isPickup =
        currentOrderType
        === pickupOrderType;


    if (shippingOrderInformation) {

        shippingOrderInformation.hidden =
            isPickup;

    }


    if (pickupOrderInformation) {

        pickupOrderInformation.hidden =
            !isPickup;

    }


    if (pickupCheckoutSection) {

        pickupCheckoutSection.hidden =
            !isPickup;

    }


    if (shippingAddressSection) {

        shippingAddressSection.hidden =
            isPickup;

    }


    if (billingAddressSection) {

        billingAddressSection.hidden =
            isPickup;

    }


    if (reviewShippingCard) {

        reviewShippingCard.hidden =
            isPickup;

    }


    if (reviewPickupCard) {

        reviewPickupCard.hidden =
            !isPickup;

    }


    if (shippingPaymentPlaceholder) {

        shippingPaymentPlaceholder.hidden =
            isPickup;

    }


    if (pickupPaymentPlaceholder) {

        pickupPaymentPlaceholder.hidden =
            !isPickup;

    }


    if (shippingCostRow) {

        shippingCostRow.hidden =
            isPickup;

    }


    if (reviewShippingNote) {

        reviewShippingNote.hidden =
            isPickup;

    }


    setShippingFieldsRequired(
        !isPickup
    );


    if (isPickup) {

        if (differentBillingAddress) {

            differentBillingAddress.checked =
                false;

        }


        if (billingFields) {

            billingFields.hidden =
                true;

        }


        setBillingFieldsRequired(
            false
        );

    }


    renderPickupInformation();

}


/* =====================================================
   VERSANDFELDER ALS PFLICHTFELDER SETZEN
===================================================== */

function setShippingFieldsRequired(required) {

    const fields = [

        shippingFirstNameInput,
        shippingLastNameInput,
        shippingStreetInput,
        shippingHouseNumberInput,
        shippingCityInput,
        shippingZipInput,
        shippingCountryInput

    ];


    fields.forEach(
        input => {

            if (input) {

                input.required =
                    required;

            }

        }
    );

}


/* =====================================================
   RECHNUNGSFELDER ALS PFLICHTFELDER SETZEN
===================================================== */

function setBillingFieldsRequired(required) {

    const fields = [

        billingFirstNameInput,
        billingLastNameInput,
        billingStreetInput,
        billingHouseNumberInput,
        billingCityInput,
        billingZipInput

    ];


    fields.forEach(
        input => {

            if (input) {

                input.required =
                    required;

            }

        }
    );

}


/* =====================================================
   ABHOLINFORMATION DARSTELLEN
===================================================== */

function renderPickupInformation() {

    if (
        currentOrderType
        !== pickupOrderType
        || !pickupCheckoutSection
    ) {

        return;

    }


    if (!selectedPickupLocation) {

        if (checkoutPickupLocationName) {

            checkoutPickupLocationName.textContent =
                "Kein Abholstandort verfügbar";

        }


        if (checkoutPickupLocationAddress) {

            checkoutPickupLocationAddress.textContent =
                "Bitte wähle den Abholstandort erneut aus.";

        }


        if (checkoutPickupDay) {

            checkoutPickupDay.textContent =
                "–";

        }


        if (checkoutPickupTime) {

            checkoutPickupTime.textContent =
                "–";

        }


        return;

    }


    checkoutPickupLocationName.textContent =
        selectedPickupLocation.name;


    checkoutPickupLocationAddress.textContent =
        `${selectedPickupLocation.address}, `
        + `${selectedPickupLocation.zip} `
        + `${selectedPickupLocation.city}`;


    checkoutPickupDay.textContent =
        selectedPickupLocation.pickupDateLabel;


    checkoutPickupTime.textContent =
        selectedPickupLocation.time;


    renderCheckoutDeadlineNotice();

}


/* =====================================================
   BESTELLFRIST IM CHECKOUT ANZEIGEN
===================================================== */

function renderCheckoutDeadlineNotice() {

    const existingNotice =
        document.querySelector(
            "#checkoutDeadlineNotice"
        );


    if (existingNotice) {

        existingNotice.remove();

    }


    if (
        !pickupCheckoutSection
        || !selectedPickupLocation
    ) {

        return;

    }


    const deadlineValid =
        isPickupDeadlineValid();


    const notice =
        document.createElement("div");


    notice.id =
        "checkoutDeadlineNotice";


    notice.className =
        "privacy-information";


    notice.setAttribute(
        "aria-live",
        "polite"
    );


    notice.innerHTML = `
        <div aria-hidden="true">
            ⏳
        </div>

        <p>

            <strong>
                Bestellfrist für die Abholung
            </strong>

            <br>

            Abholtermin:
            <strong>
                ${escapeHtml(
                    selectedPickupLocation.pickupDateLabel
                )}
            </strong>,
            ${escapeHtml(
                selectedPickupLocation.time
            )}.

            <br>

            Bestellschluss:
            <strong>
                ${escapeHtml(
                    selectedPickupLocation.orderDeadlineLabel
                )} Uhr
            </strong>.

            <br>

            Bestellungen müssen spätestens am
            Vortag bis 21:15 Uhr abgeschlossen werden.

            ${
                deadlineValid
                    ? ""
                    : `
                        <br><br>

                        <strong>
                            Die Bestellfrist ist bereits abgelaufen.
                            Bitte wähle einen neuen Abholtermin aus.
                        </strong>
                    `
            }

        </p>
    `;


    pickupCheckoutSection.appendChild(
        notice
    );

}


/* =====================================================
   BESTELLÜBERSICHT SCHRITT 2
===================================================== */

function createCheckoutItem(item) {

    const itemTotal =
        Number(item.price)
        * Number(item.quantity);


    return `
        <div class="checkout-item">

            <div>

                <strong>
                    ${escapeHtml(item.name)}
                </strong>

                <p>
                    ${item.quantity} ×
                    ${formatPrice(item.price)}

                    ${
                        item.unit
                            ? ` · ${escapeHtml(item.unit)}`
                            : ""
                    }
                </p>

            </div>

            <span class="checkout-item-price">
                ${formatPrice(itemTotal)}
            </span>

        </div>
    `;

}


/* =====================================================
   BESTELLÜBERSICHT RENDERN
===================================================== */

function renderCheckoutSummary() {

    const cartIsEmpty =
        cart.length === 0;


    checkoutItems.hidden =
        cartIsEmpty;

    checkoutEmptyCart.hidden =
        !cartIsEmpty;


    checkoutItems.innerHTML =
        cartIsEmpty
            ? ""
            : cart
                .map(createCheckoutItem)
                .join("");


    const subtotal =
        calculateSubtotal();


    checkoutSubtotal.textContent =
        formatPrice(subtotal);


    checkoutTotal.textContent =
        formatPrice(subtotal);


    reviewOrderTotal.textContent =
        formatPrice(subtotal);


    reviewOrderButton.disabled =
        cartIsEmpty;

}


/* =====================================================
   ALLGEMEINE FORMULARPRÜFUNG
===================================================== */

function hasValue(input) {

    return (
        input
        && String(input.value)
            .trim()
            !== ""
    );

}


/* =====================================================
   E-MAIL PRÜFEN
===================================================== */

function isValidEmail(email) {

    return (
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(
                String(email)
                    .trim()
            )
    );

}


/* =====================================================
   TELEFONNUMMER PRÜFEN
===================================================== */

function isValidPhoneNumber(phoneNumber) {

    const value =
        String(phoneNumber)
            .trim();


    if (
        !/^[0-9+\-()\s/]+$/.test(
            value
        )
    ) {

        return false;

    }


    const digits =
        value.replace(
            /\D/g,
            ""
        );


    return (
        digits.length >= 7
        && digits.length <= 15
    );

}


/* =====================================================
   DEUTSCHE PLZ PRÜFEN
===================================================== */

function isValidGermanPostalCode(value) {

    return (
        /^\d{5}$/.test(
            String(value)
                .trim()
        )
    );

}


/* =====================================================
   FEHLER ANZEIGEN UND FELD FOKUSSIEREN
===================================================== */

function focusInvalidField(
    input,
    message
) {

    showMessage(
        message,
        "error"
    );


    if (input) {

        input.focus();

    }


    return false;

}


/* =====================================================
   KONTAKTDATEN PRÜFEN
===================================================== */

function validateContactData() {

    if (
        !hasValue(
            guestFirstNameInput
        )
    ) {

        return focusInvalidField(
            guestFirstNameInput,
            "Bitte gib deinen Vornamen ein."
        );

    }


    if (
        !hasValue(
            guestLastNameInput
        )
    ) {

        return focusInvalidField(
            guestLastNameInput,
            "Bitte gib deinen Nachnamen ein."
        );

    }


    if (
        !isValidEmail(
            guestEmailInput.value
        )
    ) {

        return focusInvalidField(
            guestEmailInput,
            "Bitte gib eine gültige E-Mail-Adresse ein."
        );

    }


    if (
        !isValidPhoneNumber(
            guestPhoneInput.value
        )
    ) {

        return focusInvalidField(
            guestPhoneInput,
            "Bitte gib eine gültige Telefonnummer ein."
        );

    }


    return true;

}


/* =====================================================
   LIEFERADRESSE PRÜFEN
===================================================== */

function validateShippingAddress() {

    if (
        currentOrderType
        !== shippingOrderType
    ) {

        return true;

    }


    const fields = [

        {
            input:
                shippingFirstNameInput,

            message:
                "Bitte gib den Vornamen für die Lieferadresse ein."
        },

        {
            input:
                shippingLastNameInput,

            message:
                "Bitte gib den Nachnamen für die Lieferadresse ein."
        },

        {
            input:
                shippingStreetInput,

            message:
                "Bitte gib die Straße der Lieferadresse ein."
        },

        {
            input:
                shippingHouseNumberInput,

            message:
                "Bitte gib die Hausnummer ein."
        },

        {
            input:
                shippingCityInput,

            message:
                "Bitte gib den Ort der Lieferadresse ein."
        }

    ];


    for (
        const field
        of fields
    ) {

        if (
            !hasValue(
                field.input
            )
        ) {

            return focusInvalidField(
                field.input,
                field.message
            );

        }

    }


    if (
        !isValidGermanPostalCode(
            shippingZipInput.value
        )
    ) {

        return focusInvalidField(
            shippingZipInput,
            "Bitte gib eine gültige fünfstellige Postleitzahl ein."
        );

    }


    return true;

}


/* =====================================================
   RECHNUNGSADRESSE PRÜFEN
===================================================== */

function validateBillingAddress() {

    if (
        currentOrderType
        !== shippingOrderType
        || !differentBillingAddress.checked
    ) {

        return true;

    }


    const fields = [

        {
            input:
                billingFirstNameInput,

            message:
                "Bitte gib den Vornamen der Rechnungsadresse ein."
        },

        {
            input:
                billingLastNameInput,

            message:
                "Bitte gib den Nachnamen der Rechnungsadresse ein."
        },

        {
            input:
                billingStreetInput,

            message:
                "Bitte gib die Straße der Rechnungsadresse ein."
        },

        {
            input:
                billingHouseNumberInput,

            message:
                "Bitte gib die Hausnummer der Rechnungsadresse ein."
        },

        {
            input:
                billingCityInput,

            message:
                "Bitte gib den Ort der Rechnungsadresse ein."
        }

    ];


    for (
        const field
        of fields
    ) {

        if (
            !hasValue(
                field.input
            )
        ) {

            return focusInvalidField(
                field.input,
                field.message
            );

        }

    }


    if (
        !isValidGermanPostalCode(
            billingZipInput.value
        )
    ) {

        return focusInvalidField(
            billingZipInput,
            "Bitte gib eine gültige fünfstellige "
            + "Postleitzahl für die Rechnungsadresse ein."
        );

    }


    return true;

}


/* =====================================================
   GESAMTEN CHECKOUT PRÜFEN
===================================================== */

function validateGuestCheckout() {

    if (cart.length === 0) {

        showMessage(
            "Dein Warenkorb ist leer.",
            "error"
        );


        return false;

    }


    if (
        cartHasMixedOrderTypes()
    ) {

        showMessage(
            "Abhol- und Versandprodukte können momentan "
            + "nicht gemeinsam bestellt werden.",
            "error"
        );


        return false;

    }


    /*
       Die Abholfrist wird vor allen weiteren
       Checkout-Schritten erneut geprüft.
    */

    if (
        !validatePickupDeadline()
    ) {

        return false;

    }


    if (
        !validateContactData()
    ) {

        return false;

    }


    if (
        !validateShippingAddress()
    ) {

        return false;

    }


    if (
        !validateBillingAddress()
    ) {

        return false;

    }


    return true;

}


/* =====================================================
   PRÜFANSICHT: KONTAKT
===================================================== */

function renderReviewContactData() {

    reviewContactName.textContent =
        `${guestFirstNameInput.value.trim()} `
        + `${guestLastNameInput.value.trim()}`;


    reviewContactEmail.textContent =
        guestEmailInput.value.trim();


    reviewContactPhone.textContent =
        guestPhoneInput.value.trim();

}


/* =====================================================
   PRÜFANSICHT: LIEFERADRESSE
===================================================== */

function renderReviewShippingAddress() {

    if (
        currentOrderType
        !== shippingOrderType
    ) {

        return;

    }


    const countryName =
        shippingCountryInput
        && shippingCountryInput.selectedIndex >= 0
            ? shippingCountryInput.options[
                shippingCountryInput.selectedIndex
            ].text
            : "Deutschland";


    reviewShippingAddress.textContent =
        `${shippingFirstNameInput.value.trim()} `
        + `${shippingLastNameInput.value.trim()}, `
        + `${shippingStreetInput.value.trim()} `
        + `${shippingHouseNumberInput.value.trim()}, `
        + `${shippingZipInput.value.trim()} `
        + `${shippingCityInput.value.trim()}, `
        + `${countryName}`;


    if (
        differentBillingAddress.checked
    ) {

        reviewBillingAddress.hidden =
            false;


        reviewBillingAddressText.textContent =
            `${billingFirstNameInput.value.trim()} `
            + `${billingLastNameInput.value.trim()}, `
            + `${billingStreetInput.value.trim()} `
            + `${billingHouseNumberInput.value.trim()}, `
            + `${billingZipInput.value.trim()} `
            + `${billingCityInput.value.trim()}`;

    } else {

        reviewBillingAddress.hidden =
            true;


        reviewBillingAddressText.textContent =
            "";

    }

}


/* =====================================================
   PRÜFANSICHT: ABHOLUNG
===================================================== */

function renderReviewPickupData() {

    if (
        currentOrderType
        !== pickupOrderType
        || !selectedPickupLocation
    ) {

        return;

    }


    reviewPickupLocationName.textContent =
        selectedPickupLocation.name;


    reviewPickupLocationAddress.textContent =
        `${selectedPickupLocation.address}, `
        + `${selectedPickupLocation.zip} `
        + `${selectedPickupLocation.city}`;


    reviewPickupDateTime.textContent =
        `${selectedPickupLocation.pickupDateLabel}, `
        + `${selectedPickupLocation.time} · `
        + `Bestellschluss: `
        + `${selectedPickupLocation.orderDeadlineLabel} Uhr`;

}


/* =====================================================
   PRÜFANSICHT: BESTELLUNG
===================================================== */

function createReviewOrderItem(item) {

    const itemTotal =
        Number(item.price)
        * Number(item.quantity);


    return `
        <div class="review-order-item">

            <div>

                <strong>
                    ${escapeHtml(item.name)}
                </strong>

                <p>
                    ${item.quantity} ×
                    ${formatPrice(item.price)}

                    ${
                        item.unit
                            ? ` · ${escapeHtml(item.unit)}`
                            : ""
                    }
                </p>

            </div>

            <span>
                ${formatPrice(itemTotal)}
            </span>

        </div>
    `;

}


function renderReviewOrder() {

    reviewOrderItems.innerHTML =
        cart
            .map(createReviewOrderItem)
            .join("");


    reviewOrderTotal.textContent =
        formatPrice(
            calculateSubtotal()
        );

}


/* =====================================================
   GESAMTE PRÜFANSICHT
===================================================== */

function renderReview() {

    renderReviewContactData();

    renderReviewShippingAddress();

    renderReviewPickupData();

    renderReviewOrder();


    confirmOrderCheckbox.checked =
        false;

}


/* =====================================================
   GASTBESTELLUNG STARTEN
===================================================== */

if (continueAsGuestButton) {

    continueAsGuestButton.addEventListener(
        "click",
        () => {

            if (cart.length === 0) {

                showMessage(
                    "Dein Warenkorb ist leer.",
                    "error"
                );


                return;

            }


            if (
                cartHasMixedOrderTypes()
            ) {

                showMessage(
                    "Abhol- und Versandprodukte können momentan "
                    + "nicht gemeinsam bestellt werden.",
                    "error"
                );


                return;

            }


            /*
               Erste Checkout-Prüfung der Abholfrist.
            */

            if (
                !validatePickupDeadline()
            ) {

                return;

            }


            showCheckoutStep(2);

        }
    );

}


/* =====================================================
   FORMULAR ABSENDEN
===================================================== */

if (guestCheckoutForm) {

    guestCheckoutForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            /*
               Zweite Fristprüfung vor der Prüfansicht.
            */

            if (
                !validateGuestCheckout()
            ) {

                return;

            }


            renderReview();


            showCheckoutStep(3);

        }
    );

}


/* =====================================================
   RECHNUNGSADRESSE EIN-/AUSBLENDEN
===================================================== */

if (differentBillingAddress) {

    differentBillingAddress.addEventListener(
        "change",
        () => {

            const showBillingFields =
                differentBillingAddress.checked;


            billingFields.hidden =
                !showBillingFields;


            setBillingFieldsRequired(
                showBillingFields
            );

        }
    );

}


/* =====================================================
   KONTAKTDATEN BEARBEITEN
===================================================== */

if (editContactDataButton) {

    editContactDataButton.addEventListener(
        "click",
        () => {

            showCheckoutStep(2);


            guestFirstNameInput.focus();

        }
    );

}


/* =====================================================
   VERSANDDATEN BEARBEITEN
===================================================== */

if (editShippingDataButton) {

    editShippingDataButton.addEventListener(
        "click",
        () => {

            showCheckoutStep(2);


            if (shippingFirstNameInput) {

                shippingFirstNameInput.focus();

            }

        }
    );

}


/* =====================================================
   ABHOLDATEN BEARBEITEN
===================================================== */

if (editPickupDataButton) {

    editPickupDataButton.addEventListener(
        "click",
        () => {

            window.location.href =
                "abholung.html";

        }
    );

}


/* =====================================================
   BESTELLUNG ABSCHLIESSEN
===================================================== */

if (placeOrderButton) {

    placeOrderButton.addEventListener(
        "click",
        () => {

            if (
                !confirmOrderCheckbox.checked
            ) {

                showMessage(
                    "Bitte bestätige, dass du deine Angaben "
                    + "und die Bestellung geprüft hast.",
                    "error"
                );


                confirmOrderCheckbox.focus();


                return;

            }


            /*
               ENTSCHEIDENDE LETZTE PRÜFUNG:

               Die 21:15-Uhr-Frist wird direkt vor dem
               Bestellabschluss erneut kontrolliert.

               So kann eine vor 21:15 Uhr geöffnete
               Checkout-Seite nicht nach Fristablauf
               abgeschlossen werden.
            */

            if (
                !validatePickupDeadline()
            ) {

                return;

            }


            /*
               Zusätzlich kontrollieren wir, ob der
               Warenkorb zwischenzeitlich ungültig wurde.
            */

            if (
                cart.length === 0
                || cartHasMixedOrderTypes()
            ) {

                showMessage(
                    "Die Bestellung kann nicht abgeschlossen werden. "
                    + "Bitte prüfe deinen Warenkorb erneut.",
                    "error"
                );


                return;

            }


            /*
               PROTOTYP:

               Es werden keine Formulardaten übertragen.
               Es entsteht keine echte Bestellung.

               Nur der Demo-Warenkorb und die Bestellart
               werden entfernt.
            */

            localStorage.removeItem(
                cartStorageKey
            );


            localStorage.removeItem(
                orderTypeStorageKey
            );


            checkoutStep1.hidden =
                true;

            checkoutStep2.hidden =
                true;

            checkoutStep3.hidden =
                true;

            checkoutSuccess.hidden =
                false;


            progressStep1.classList.add(
                "completed"
            );

            progressStep2.classList.add(
                "completed"
            );

            progressStep3.classList.add(
                "completed"
            );

            progressStep3.classList.remove(
                "active"
            );

            progressLine1.classList.add(
                "active"
            );

            progressLine2.classList.add(
                "active"
            );


            showMessage(
                "Die Demo-Bestellung wurde abgeschlossen.",
                "success"
            );


            window.scrollTo(
                {
                    top:
                        0,

                    behavior:
                        "smooth"
                }
            );

        }
    );

}


/* =====================================================
   BROWSER-ZURÜCK / CACHE

   Beim Wiederherstellen der Seite wird die Frist
   erneut kontrolliert und angezeigt.
===================================================== */

window.addEventListener(
    "pageshow",
    () => {

        cart =
            loadCart();


        selectedPickupLocation =
            loadPickupLocation();


        currentOrderType =
            getCartOrderType();


        if (!requiredElementsAvailable) {

            return;

        }


        configureOrderType();

        renderCheckoutSummary();


        if (
            currentOrderType === pickupOrderType
            && !isPickupDeadlineValid()
        ) {

            showMessage(
                "Die Bestellfrist für den ausgewählten "
                + "Abholtermin ist abgelaufen. Bitte wähle "
                + "einen neuen Abholtermin aus.",
                "error"
            );

        }

    }
);


/* =====================================================
   START
===================================================== */

let cart =
    loadCart();


let selectedPickupLocation =
    loadPickupLocation();


let currentOrderType =
    getCartOrderType();


if (requiredElementsAvailable) {

    configureOrderType();

    renderCheckoutSummary();

    showCheckoutStep(1);


    /*
       Sofortige Fristprüfung beim Öffnen der Seite.
    */

    if (
        currentOrderType === pickupOrderType
        && !isPickupDeadlineValid()
    ) {

        showMessage(
            "Die Bestellfrist für den ausgewählten "
            + "Abholtermin ist bereits abgelaufen. "
            + "Bitte wähle einen neuen Abholtermin aus.",
            "error"
        );

    }

}


/* =====================================================
   DATENSCHUTZ IM PROTOTYP

   Es gibt absichtlich kein:

   - localStorage.setItem für Kontaktdaten
   - sessionStorage.setItem für Kontaktdaten
   - fetch(...) für Bestelldaten
   - XMLHttpRequest für Bestelldaten

   Personenbezogene Angaben bleiben ausschließlich
   in den aktuell geöffneten Formularfeldern.
===================================================== */