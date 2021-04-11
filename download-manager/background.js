// This script is always running in the background. This is where things like monitoring a user's
// download have to go.

let downloadItems = [];
chrome.storage.local.get(['storedItems'], function(result) {
    if (result) {
        downloadItems = result.storedItems;
    }
});

// Called at intervals to update the progress of all the downloads.
function updateProgress() {
    for (i = 0; i < downloadItems.length; i++) {
        // Assign i to a variable so that we still have access to this index in the callback
        // function.
        let index = i;
        (function () {
            chrome.downloads.search({id: downloadItems[index].id}, function(items) {
                // We are searching for 1 item and so only 1 item is ever returned
                item = items[0];
                if (downloadItems[index] && item && item.id == downloadItems[index].id) {
                    downloadItems[index].bytesReceived = item.bytesReceived;
                    downloadItems[index].danger = item.danger;
                    downloadItems[index].filename = item.filename;
                    downloadItems[index].paused = item.paused;
                    downloadItems[index].totalBytes = item.totalBytes;
                }

                // Update our local storage so that the popup can get the updated progress.
                chrome.storage.local.set({storedItems: downloadItems}, function() {});
            })
        })(index);
    }
}

// Update the progress every half second
setInterval(updateProgress, 500);

if (chrome.downloads) {
    downloads = chrome.downloads;

    // Create a listener that monitors the user's download. I.e. provides the functionality that the
    // user expects from the extension.
    downloads.onCreated.addListener(function(downloadItem) {
        item = {
            bytesReceived: downloadItem['bytesReceived'],
            danger: downloadItem['danger'],
            filename: downloadItem['filename'],
            id: downloadItem['id'],
            paused: downloadItem['paused'],
            totalBytes: downloadItem['totalBytes']
        }

        // Add this new item to the head and keep the list <= 10 elements.
        downloadItems.unshift(item);
        if (downloadItems.length > 10) {
            downloadItems.length = 10;
        }

        updateProgress();
    });
}
