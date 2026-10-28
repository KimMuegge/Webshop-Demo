/* =====================================================
   WEBSHOP PROTOTYP
   KUNDENKONTO V1

   WICHTIG:
   Diese Datei enthält ausschließlich Demo-Logik.

   Es werden KEINE:
   - Passwörter
   - E-Mail-Adressen
   - Namen
   - echten Kundenkonten

   im localStorage gespeichert.

   Die echte Registrierung und Anmeldung
   wird später über das Backend umgesetzt.
===================================================== */


/* =====================================================
   HTML-ELEMENTE
===================================================== */

const loginForm =
    document.querySelector("#loginForm");

const registerForm =
    document.querySelector("#registerForm");

const passwordButtons =
    document.querySelectorAll(
        ".password-toggle"
    );


/* =====================================================
   STATUSMELDUNG ERZEUGEN
===================================================== */

const accountMessage =
    document.createElement("div");

accountMessage.className =
    "account-message";

accountMessage.setAttribute(
    "role",
    "status"
);

accountMessage.setAttribute(
    "aria-live",
    "polite"
);

document.body.appendChild(
    accountMessage
);


let messageTimer = null;


/* =====================================================
   STATUSMELDUNG ANZEIGEN
===================================================== */

function showMessage(
    message,
    type = "success"
) {

    accountMessage.textContent =
        message;

    accountMessage.classList.remove(
        "success",
        "error",
        "visible"
    );

    accountMessage.classList.add(
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

                accountMessage.classList.remove(
                    "visible"
                );

            },
            3000
        );
}


/* =====================================================
   PASSWORT ANZEIGEN / VERBERGEN
===================================================== */

passwordButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const targetId =
                    button.dataset.passwordTarget;

                const passwordInput =
                    document.getElementById(
                        targetId
                    );


                if (!passwordInput) {

                    return;
                }


                const passwordIsVisible =
                    passwordInput.type
                    === "text";


                passwordInput.type =
                    passwordIsVisible
                        ? "password"
                        : "text";


                button.textContent =
                    passwordIsVisible
                        ? "👁"
                        : "🙈";


                button.setAttribute(
                    "aria-label",
                    passwordIsVisible
                        ? "Passwort anzeigen"
                        : "Passwort verbergen"
                );

            }
        );

    }
);


/* =====================================================
   E-MAIL PRÜFEN
===================================================== */

function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    return emailPattern.test(
        email.trim()
    );
}


/* =====================================================
   PASSWORTREGELN
===================================================== */

function validatePassword(
    password
) {

    const errors = [];


    if (password.length < 8) {

        errors.push(
            "mindestens 8 Zeichen"
        );
    }


    if (
        !/[A-ZÄÖÜ]/.test(password)
    ) {

        errors.push(
            "mindestens einen Großbuchstaben"
        );
    }


    if (
        !/[a-zäöüß]/.test(password)
    ) {

        errors.push(
            "mindestens einen Kleinbuchstaben"
        );
    }


    if (
        !/[0-9]/.test(password)
    ) {

        errors.push(
            "mindestens eine Zahl"
        );
    }


    return errors;
}


/* =====================================================
   LOGIN
===================================================== */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const emailInput =
                document.querySelector(
                    "#loginEmail"
                );

            const passwordInput =
                document.querySelector(
                    "#loginPassword"
                );


            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;


            /* E-Mail */

            if (
                !isValidEmail(email)
            ) {

                showMessage(
                    "Bitte gib eine gültige E-Mail-Adresse ein.",
                    "error"
                );

                emailInput.focus();

                return;
            }


            /* Passwort */

            if (
                password.trim() === ""
            ) {

                showMessage(
                    "Bitte gib dein Passwort ein.",
                    "error"
                );

                passwordInput.focus();

                return;
            }


            /*
               DEMO:

               Hier wird bewusst KEIN Passwort geprüft
               oder gespeichert.

               Später erfolgt an dieser Stelle eine
               Anfrage an das Backend.
            */


            showMessage(
                "Demo-Anmeldung erfolgreich geprüft. Die echte Anmeldung wird später über das Backend umgesetzt.",
                "success"
            );

        }
    );

}


/* =====================================================
   REGISTRIERUNG
===================================================== */

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            /* Formularelemente */

            const firstNameInput =
                document.querySelector(
                    "#registerFirstName"
                );

            const lastNameInput =
                document.querySelector(
                    "#registerLastName"
                );

            const emailInput =
                document.querySelector(
                    "#registerEmail"
                );

            const passwordInput =
                document.querySelector(
                    "#registerPassword"
                );

            const passwordConfirmInput =
                document.querySelector(
                    "#registerPasswordConfirm"
                );

            const privacyAccepted =
                document.querySelector(
                    "#privacyAccepted"
                );


            /* Werte */

            const firstName =
                firstNameInput.value.trim();

            const lastName =
                lastNameInput.value.trim();

            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;

            const passwordConfirm =
                passwordConfirmInput.value;


            /* Vorname prüfen */

            if (
                firstName.length < 2
            ) {

                showMessage(
                    "Bitte gib deinen Vornamen ein.",
                    "error"
                );

                firstNameInput.focus();

                return;
            }


            /* Nachname prüfen */

            if (
                lastName.length < 2
            ) {

                showMessage(
                    "Bitte gib deinen Nachnamen ein.",
                    "error"
                );

                lastNameInput.focus();

                return;
            }


            /* E-Mail prüfen */

            if (
                !isValidEmail(email)
            ) {

                showMessage(
                    "Bitte gib eine gültige E-Mail-Adresse ein.",
                    "error"
                );

                emailInput.focus();

                return;
            }


            /* Passwort prüfen */

            const passwordErrors =
                validatePassword(
                    password
                );


            if (
                passwordErrors.length > 0
            ) {

                showMessage(
                    "Das Passwort benötigt "
                    + passwordErrors.join(", ")
                    + ".",
                    "error"
                );

                passwordInput.focus();

                return;
            }


            /* Passwörter vergleichen */

            if (
                password
                !== passwordConfirm
            ) {

                showMessage(
                    "Die eingegebenen Passwörter stimmen nicht überein.",
                    "error"
                );

                passwordConfirmInput.focus();

                return;
            }


            /* Datenschutz */

            if (
                !privacyAccepted.checked
            ) {

                showMessage(
                    "Bitte bestätige, dass du die Datenschutzhinweise gelesen hast.",
                    "error"
                );

                privacyAccepted.focus();

                return;
            }


            /*
               DEMO:

               Die eingegebenen Daten werden NICHT
               dauerhaft gespeichert.

               Später:

               Browser
                   ↓
               HTTPS
                   ↓
               Backend
                   ↓
               Passwort sicher hashen
                   ↓
               Kundendatenbank
            */


            showMessage(
                "Die Eingaben sind gültig. Das echte Kundenkonto wird später über das sichere Backend erstellt.",
                "success"
            );


            /*
               Formular anschließend bewusst NICHT
               zurücksetzen.

               Dadurch kann die Demo weiterhin
               kontrolliert werden.
            */

        }
    );

}


/* =====================================================
   PASSWORD-FELDER BEIM VERLASSEN ZURÜCKSETZEN

   Dadurch wird ein eingeblendetes Passwort automatisch
   wieder verborgen.
===================================================== */

window.addEventListener(
    "pagehide",
    () => {

        document
            .querySelectorAll(
                'input[type="text"][autocomplete="current-password"],'
                + 'input[type="text"][autocomplete="new-password"]'
            )
            .forEach(
                input => {

                    input.type =
                        "password";

                }
            );

    }
);