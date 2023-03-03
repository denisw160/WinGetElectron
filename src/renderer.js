// renderer.js

// This file is loaded via the <script> tag in the index.html file and will
// be executed in the renderer process for that window. No Node.js APIs are
// available in this process because `nodeIntegration` is turned off and
// `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
// to expose Node.js functionality from the main process.
$(document).ready(function () {
    console.log('Running renderer.js');

    let count = 0;
    $('#click-counter').text(count.toString());
    $('#countbtn').on('click', () => {
        count++;
        $('#click-counter').text(count);
    });

    console.log('renderer.js finished');
});
