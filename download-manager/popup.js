// Add the listeners

let downloadItems = [];

chrome.storage.local.get(['storedItems'], function(result) {
    if (result) {
        downloadItems = result.storedItems;
        console.log(downloadItems);
        for (i = 0; i < downloadItems.length; i++) {
            displayProgress(i);
        }
    }
});

function parseFilename(filename) {
    lastSlash = filename.lastIndexOf('/');
    if (lastSlash == -1) {
        return filename;
    }

    return filename.slice(lastSlash + 1, filename.length);
}

function progress(bytesReceived, totalBytes) {
    return Math.floor(bytesReceived / totalBytes) * 100 + '%';
}

function displayProgress(index) {
    var element = document.getElementById(index);
    if (element.hasChildNodes()) {
        child1 = element.childNodes[1];
        child1.innerHTML = parseFilename(downloadItems[index].filename);
        child2 = element.childNodes[3];
        if (child2.hasChildNodes()) {
            foreground = child2.childNodes[1];
            curProgress = progress(downloadItems[index].bytesReceived, downloadItems[index].totalBytes);
            foreground.innerHTML = curProgress;
            foreground.style.width = curProgress;
        }
    }
}

// create a function that continually updates the progress of these downloads
function updateProgress() {
    for (i = 0; i < downloadItems.length; i++) {
        // call this function in a way that i doesn't change
        let index = i;
        (function () {
            chrome.downloads.search({id: downloadItems[index].id}, function(items) {
                item = items[0];
                if (item.id == downloadItems[index].id && downloadItems[index]) {
                    downloadItems[index].bytesReceived = item.bytesReceived;
                    downloadItems[index].danger = item.danger;
                    downloadItems[index].filename = item.filename;
                    downloadItems[index].paused = item.paused;
                    downloadItems[index].totalBytes = item.totalBytes;
                }

                chrome.storage.local.set({storedItems: downloadItems}, function() {
                    console.log('saved to storage');
                });

                displayProgress(index);
            });
        })(index);
    }
}

// update the progress every 200 ms
setInterval(updateProgress, 500);

if (chrome.downloads) {
    downloads = chrome.downloads;

    downloads.onCreated.addListener(function(downloadItem) {
        item = {
            'bytesReceived': downloadItem['bytesReceived'],
            'danger': downloadItem['danger'],
            'filename': downloadItem['filename'],
            'id': downloadItem['id'],
            'paused': downloadItem['paused'],
            'totalBytes': downloadItem['totalBytes']
        }

        // add item to the head and keep the list under (or equal to) 10 elements long
        downloadItems.unshift(item);
        if (downloadItems.length > 10) {
            downloadItems.length = 10;
        }

        updateProgress();
    });
}
