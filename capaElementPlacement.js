/*
 * CapaElementPlacement - Customize SharePoint 2013/2016/O365 classic forms
 * Version 2.1 - No jQuery Dependency
 */
(function () {
    var defaultOptions = {
        genericAlert: false,
        alertErrorText: "Form errors exist. Please fix form errors and try again"
    };

    function CapaElementPlacement(options) {
        var settings = Object.assign({}, defaultOptions, options);

        placeFormElements();
        hideSaveCancelButtons();
        setupGenericAlert(settings);
    }

    function placeFormElements() {
        var elements = document.querySelectorAll(".capa-element");
        elements.forEach(function (elem) {
            var displayName = elem.getAttribute("data-displayName");
            var formTableCells = document.querySelectorAll("table.ms-formtable td");
            formTableCells.forEach(function (cell) {
                if (cell.innerHTML.includes('FieldName="' + displayName + '"')) {
                    while (cell.childNodes.length > 0) {
                        elem.appendChild(cell.childNodes[0]);
                    }
                }
            });
        });
    }

    function hideSaveCancelButtons() {
        var saveButton = document.querySelector("input[type='button'][value='Save']");
        var cancelButton = document.querySelector("input[type='button'][value='Cancel']");

        if (saveButton) {
            saveButton.style.display = 'none';
        }

        if (cancelButton) {
            cancelButton.style.display = 'none';
        }
    }

    function setupGenericAlert(settings) {
        if (settings.genericAlert) {
            var saveButton = document.querySelector("input[type='button'][value='Save']");
            if (saveButton) {
                saveButton.addEventListener("click", function () {
                    var interval = setInterval(function () {
                        checkForErrors(settings.alertErrorText, interval);
                    }, 500);
                });
            }
        }
    }

    function checkForErrors(alertErrorText, interval) {
        var errorSpan = document.querySelector("span[role='alert']");
        if (errorSpan) {
            alert(alertErrorText);
            clearInterval(interval);
        }
    }

    window.CapaElementPlacement = CapaElementPlacement;
})();
