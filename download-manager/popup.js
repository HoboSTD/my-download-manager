// This script updates the progress that is displayed in the popup.
// Display all progress straight away so there is no delay.
displayAllProgress();

// Returns the filename from the filepath.
function parseFilename(filepath) {
    lastSlash = filepath.lastIndexOf('/');
    if (lastSlash == -1) {
        return filepath;
    }

    return filepath.slice(lastSlash + 1, filepath.length);
}

// Calculates the progress of the download and returns 0% to 100%.
function progress(bytesReceived, totalBytes) {
    return Math.floor(bytesReceived / totalBytes) * 100 + '%';
}

// Display the progress of the given item. It is stored in the ith element.
function displayProgress(item, i) {
    var element = document.getElementById(i);
    if (element.hasChildNodes()) {
        child1 = element.childNodes[1];
        child1.innerHTML = parseFilename(item.filename);
        child2 = element.childNodes[3];
        if (child2.hasChildNodes()) {
            foreground = child2.childNodes[1];
            curProgress = progress(item.bytesReceived, item.totalBytes);
            foreground.innerHTML = curProgress;
            foreground.style.width = curProgress;
        }
    }
}

// Displays the progress of the 10 most recent downloads.
function displayAllProgress() {
    // Get the progress updates.
    chrome.storage.local.get(['storedItems'], function(result) {
        if (result) {
            storedItems = result.storedItems;
            for (i = 0; i < storedItems.length; i++) {
                displayProgress(storedItems[i], i);
            }
        }
    })
}

// Re-display the progress every half second.
setInterval(displayAllProgress, 500);
