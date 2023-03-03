// renderer.js
// noinspection JSUnresolvedFunction,JSUnresolvedVariable

// This file is loaded via the <script> tag in the index.html file and will
// be executed in the renderer process for that window. No Node.js APIs are
// available in this process because `nodeIntegration` is turned off and
// `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
// to expose Node.js functionality from the main process.

/**
 * Show main with the id.
 * @param sId ID
 */
show = function (sId) {
    console.debug('showing: ' + sId);

    // Hide all others
    $('#installed').addClass('visually-hidden');
    $('#updates').addClass('visually-hidden');
    $('#search').addClass('visually-hidden');

    // Show only selected
    $('#' + sId).removeClass('visually-hidden');
}

/**
 * Show/hide the overlay spinner.
 * @param bShow Show/Hide
 */
spinner = function (bShow) {
    console.debug('spinner: ' + bShow);
    if (bShow) {
        $('#overlay').removeClass('visually-hidden');
    } else {
        $('#overlay').addClass('visually-hidden');
    }
}

/**
 * Register, when document is ready.
 */
$(document).ready(function () {
    console.debug('Running renderer.js onReady');

    const oSearchButton = document.getElementById('btn-search');
    oSearchButton.addEventListener('click', async () => {
        const oSearchField = document.getElementById('fld-search');
        if (oSearchField.value !== undefined && oSearchField.value.length > 0) {
            // Start the spinner
            spinner(true);

            // Clear table
            $("#tbl-search > tbody").empty();

            // Execute search
            const oResult = await window.electronAPI.doSearch(oSearchField.value);
            if (!oResult.success || oResult.results.length === 0) {
                $('#tbl-search > tbody')
                    .append('<tr><th scope="row" class="text-start" colspan="3">No results</th></tr>');
            } else {
                debugger;
                oResult.results.forEach(value => {
                    $('#tbl-search > tbody')
                        .append('<tr><th scope="row" class="text-start">' + value.name + '</th><td>' + value.id + '</td><td>' + value.version + '</td></tr>');
                });
            }

            // Hide the spinner
            spinner(false);
        }
    })

    console.debug('renderer.js finished');
});


