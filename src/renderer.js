// renderer.js
// noinspection JSUnresolvedFunction

// This file is loaded via the <script> tag in the index.html file and will
// be executed in the renderer process for that window. No Node.js APIs are
// available in this process because `nodeIntegration` is turned off and
// `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
// to expose Node.js functionality from the main process.
$(document).ready(function () {
    console.debug('Running renderer.js onReady');

    console.debug('renderer.js finished');
});

show = function (id) {
    console.debug('showing: ' + id);

    // Hide all others
    $('#installed').addClass('visually-hidden');
    $('#updates').addClass('visually-hidden');
    $('#search').addClass('visually-hidden');

    // Show only selected
    $('#' + id).removeClass('visually-hidden');
}

