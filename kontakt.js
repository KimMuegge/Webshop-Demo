/* =====================================================
   WEBSHOP PROTOTYP
   KONTAKT V1

   Funktionen:
   - Kontaktformular prüfen
   - Pflichtfelder validieren
   - E-Mail-Adresse prüfen
   - Nachricht prüfen
   - Datenschutzhinweis prüfen
   - Prototyp-Meldungen anzeigen

   WICHTIG:
   Das Formular versendet derzeit KEINE Nachricht.

   Personenbezogene Daten werden:
   - nicht im localStorage gespeichert
   - nicht an ein Backend übertragen
   - nicht per E-Mail versendet

   Die echte Übermittlung wird später ergänzt.
===================================================== */


/* =====================================================
   HTML-ELEMENTE
===================================================== */

const contactForm =
    document.querySelector("#contactForm");

const firstNameInput =
    document.querySelector("#contactFirstName");

const lastNameInput =
    document.querySelector("#contactLastName");

const emailInput =
    document.querySelector("#contactEmail");

const orderNumberInput =
    document.querySelector("#orderNumber");

const subjectInput =
    document.querySelector("#contactSubject");

const messageInput =
    document.querySelector("#contactMessage");

const privacyInput =
    document.querySelector("#contactPrivacy");

const sendButton =
    document.querySelector("#sendContactForm");


/* =====================================================
   GRUNDPRÜFUNG
===================================================== */

const contactElementsAvailable =
    contactForm
    && firstNameInput
    && lastNameInput
    && emailInput
    && orderNumberInput
    && subjectInput
    && messageInput
    && privacyInput
    && sendButton;


if (!contactElementsAvailable) {

    console.error(
        "Das Kontaktformular konnte nicht vollständig "
        + "gestartet werden. Mindestens ein benötigtes "
        + "HTML-Element fehlt."
    );
}


/* =====================================================
   MELDUNGSBOX ERZEUGEN
===================================================== */

const contactMessage =
    document.createElement("div");

contactMessage.className =
    "contact-message";

contactMessage.setAttribute(
    "role",
    "status"
);

contactMessage.setAttribute(
    "aria-live",
    "polite"
);

document.body.appendChild(
    contactMessage
);


let messageTimer = null;


/* =====================================================
   MELDUNG ANZEIGEN
===================================================== */

function showMessage(
    message,
    type = "info"
) {

    contactMessage.textContent =
        message;


    contactMessage.classList.remove(
        "success",
        "error",
        "info",
        "visible"
    );


    contactMessage.classList.add(
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

                contactMessage.classList.remove(
                    "visible"
                );

            },
            4000
        );
}


/* =====================================================
   E-MAIL-ADRESSE PRÜFEN
===================================================== */

function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    return emailPattern.test(
        String(email).trim()
    );
}


/* =====================================================
   TEXTFELD PRÜFEN
===================================================== */

function hasMinimumLength(
    value,
    minimumLength
) {

    return (
        String(value)
            .trim()
            .length
        >= minimumLength
    );
}


/* =====================================================
   FORMULAR PRÜFEN
===================================================== */

function validateContactForm() {


    /* =========================
       VORNAME
    ========================= */

    if (
        !hasMinimumLength(
            firstNameInput.value,
            2
        )
    ) {

        showMessage(
            "Bitte gib deinen Vornamen ein.",
            "error"
        );

        firstNameInput.focus();

        return false;
    }


    /* =========================
       NACHNAME
    ========================= */

    if (
        !hasMinimumLength(
            lastNameInput.value,
            2
        )
    ) {

        showMessage(
            "Bitte gib deinen Nachnamen ein.",
            "error"
        );

        lastNameInput.focus();

        return false;
    }


    /* =========================
       E-MAIL
    ========================= */

    if (
        !isValidEmail(
            emailInput.value
        )
    ) {

        showMessage(
            "Bitte gib eine gültige E-Mail-Adresse ein.",
            "error"
        );

        emailInput.focus();

        return false;
    }


    /* =========================
       BETREFF
    ========================= */

    if (
        String(
            subjectInput.value
        ).trim() === ""
    ) {

        showMessage(
            "Bitte wähle einen Betreff aus.",
            "error"
        );

        subjectInput.focus();

        return false;
    }


    /* =========================
       NACHRICHT
    ========================= */

    if (
        !hasMinimumLength(
            messageInput.value,
            10
        )
    ) {

        showMessage(
            "Bitte beschreibe dein Anliegen etwas genauer.",
            "error"
        );

        messageInput.focus();

        return false;
    }


    /* =========================
       DATENSCHUTZ
    ========================= */

    if (
        !privacyInput.checked
    ) {

        showMessage(
            "Bitte bestätige, dass du die Datenschutzhinweise "
            + "zur Kenntnis genommen hast.",
            "error"
        );

        privacyInput.focus();

        return false;
    }


    return true;
}


/* =====================================================
   FORMULAR ABSENDEN
===================================================== */

function handleContactSubmit(event) {

    /*
       Verhindert das normale Absenden des Formulars.

       Wichtig:
       Im Prototyp existiert noch kein Backend.
    */

    event.preventDefault();


    if (
        !contactElementsAvailable
    ) {
        return;
    }


    /* Formular prüfen */

    if (
        !validateContactForm()
    ) {
        return;
    }


    /*
       =================================================
       PROTOTYP

       An dieser Stelle wird später die Anfrage an das
       Backend eingebaut.

       Geplanter Ablauf:

       Browser
           ↓
       HTTPS
           ↓
       Backend
           ↓
       Formular serverseitig prüfen
           ↓
       Nachricht verarbeiten
           ↓
       zentrale Kontakt-E-Mail

       AKTUELL:

       Es werden KEINE Formularwerte übertragen.
       =================================================
    */


    showMessage(
        "Das Formular wurde erfolgreich geprüft. "
        + "Die Nachrichtenübermittlung wird aktiviert, "
        + "sobald die zentrale E-Mail-Adresse und das "
        + "Backend eingerichtet sind.",
        "info"
    );


    /*
       Formular bewusst NICHT zurücksetzen.

       Dadurch bleiben die eingegebenen Daten sichtbar
       und der Nutzer verliert seine Nachricht nicht,
       obwohl sie im Prototyp noch nicht versendet wird.
    */
}


/* =====================================================
   EVENT-LISTENER
===================================================== */

if (
    contactElementsAvailable
) {

    contactForm.addEventListener(
        "submit",
        handleContactSubmit
    );

}


/* =====================================================
   ZEICHENZÄHLER FÜR NACHRICHT
===================================================== */

if (messageInput) {

    const counter =
        document.createElement(
            "small"
        );


    counter.className =
        "message-counter";


    counter.setAttribute(
        "aria-live",
        "polite"
    );


    messageInput.insertAdjacentElement(
        "afterend",
        counter
    );


    function updateMessageCounter() {

        const length =
            messageInput.value.length;


        counter.textContent =
            `${length} Zeichen`;

    }


    messageInput.addEventListener(
        "input",
        updateMessageCounter
    );


    updateMessageCounter();

}


/* =====================================================
   BESTELLNUMMER BEREINIGEN

   Das Feld bleibt optional.
===================================================== */

if (orderNumberInput) {

    orderNumberInput.addEventListener(
        "blur",
        () => {

            const value =
                orderNumberInput
                    .value
                    .trim();


            if (value === "") {
                return;
            }


            /*
               Wenn ausschließlich eine Nummer
               eingegeben wurde, ergänzen wir für
               die Darstellung ein #.
            */

            if (
                /^\d+$/.test(value)
            ) {

                orderNumberInput.value =
                    `#${value}`;

            }

        }
    );

}


/* =====================================================
   PERSONENBEZOGENE DATEN NICHT SPEICHERN
===================================================== */

/*
   Es gibt hier absichtlich KEIN:

   localStorage.setItem(...)
   sessionStorage.setItem(...)
   fetch(...)
   XMLHttpRequest(...)
   mailto:-Versand

   Die Eingaben existieren ausschließlich
   innerhalb des aktuell geöffneten Formulars.
*/