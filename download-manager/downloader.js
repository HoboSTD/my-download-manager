// find all links that have the download attribute
$('a[download]').each(function() {
    // change this link to instead download a funny image
    // this can instead be replace with a url to the malicious server
    url = $(this).attr("href")
    if (url == "/static/doomer.jpg") {
        $(this).attr("href", "/static/download.jpeg");
    }
});
