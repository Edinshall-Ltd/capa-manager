/*
 * Edinshall Utilities
 * 
 * Customize SharePoint O36
 * Version 1.0 - No jQuery Dependency
 */


/*
 * edinshall Element Placement
 * Version 2.1 - No jQuery Dependency
 */
(function () {
    var defaultOptions = {
        genericAlert: false,
        alertErrorText: "Form errors exist. Please fix form errors and try again"
    };

    function CapaElementPlacement(options) {
        var settings = Object.assign({}, defaultOptions, options);

        return new Promise((resolve, reject) => {
            placeFormElements();
            hideSaveCancelButtons();
            setupGenericAlert(settings);

            // Resolve the Promise once all tasks are completed
            resolve();
        });
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

/**/

/*
 * edinshall Table Sorter
 * Version 2.1 - No jQuery Dependency
 */
/**
     * Sorts a table based on the specified column and sorting direction.
     *
     * @param {string} tableId - The ID of the HTML table to sort.
     * @param {number} columnIndex - The index of the column to sort by (0-based).
     * @param {string} sortDirection - The sorting direction, either 'asc' (ascending) or 'desc' (descending).
     * @param {string} sortByClass - The class name used to identify the elements to sort within the column.
     */
    function sortTable(tableId, columnIndex, sortDirection, sortByClass) {
        var table, rows, switching, i, x, y, shouldSwitch, switchCount = 0;
        
        // Get the reference to the HTML table by its ID
        table = document.getElementById(tableId);
        
        // Set the flag to control the sorting loop
        switching = true;

        // Run the loop until no more switching is needed
        while (switching) {
            switching = false;
            rows = table.rows;

            // Loop through all table rows (excluding the headers)
            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                
                // Get the elements to compare from the current row and the next row
                x = rows[i].getElementsByTagName("TD")[columnIndex].getElementsByClassName(sortByClass)[0];
                y = rows[i + 1].getElementsByTagName("TD")[columnIndex].getElementsByClassName(sortByClass)[0];

                // Check if the two rows should switch places based on the sorting direction
                if (sortDirection === "asc") {
                    if (x && y && x.textContent.toLowerCase() > y.textContent.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                } else if (sortDirection === "desc") {
                    if (x && y && x.textContent.toLowerCase() < y.textContent.toLowerCase()) {
                        shouldSwitch = true;
                        break;
                    }
                }
            }

            // If a switch has been marked, make the switch and mark that a switch has been done
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                switchCount++;
            } else {
                // If no switching has been done AND the direction is "asc",
                // set the direction to "desc" and run the while loop again.
                if (switchCount === 0 && sortDirection === "asc") {
                    sortDirection = "desc";
                    switching = true;
                }
            }
        }
    }
/**/

/*
 * edinshall XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 * Version 2.1 - No jQuery Dependency
 */
 
/**/