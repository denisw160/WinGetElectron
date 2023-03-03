// renderer.js
// noinspection JSUnresolvedFunction,JSUnresolvedVariable

// This file is loaded via the <script> tag in the index.html file and will
// be executed in the renderer process for that window. No Node.js APIs are
// available in this process because `nodeIntegration` is turned off and
// `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
// to expose Node.js functionality from the main process.

show = function (sId) {
    console.debug('showing: ' + sId);

    // Hide all others
    $('#installed').addClass('visually-hidden');
    $('#updates').addClass('visually-hidden');
    $('#search').addClass('visually-hidden');

    // Show only selected
    $('#' + sId).removeClass('visually-hidden');
}

$(document).ready(function () {
    console.debug('Running renderer.js onReady');

    const oSearchButton = document.getElementById('btn-search');
    oSearchButton.addEventListener('click', async () => {
        const oSearchField = document.getElementById('fld-search');
        if (oSearchField.value !== undefined && oSearchField.value.length > 0) {
            const oResult = await window.electronAPI.doSearch(oSearchField.value);
            oSearchField.value = 'done';
        }
    })

    console.debug('renderer.js finished');
});


