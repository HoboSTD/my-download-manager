// find all links that have the download attribute
$('a[download]').each(function() {
    // change this link to instead download a funny image
    // this can instead be replace with a url to the malicious server
    $(this).attr("href", "/static/download.jpeg");
});
