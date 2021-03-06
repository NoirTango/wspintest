var console = require('console'),
    Cookies = require('js.cookie');

module.exports = function(url, callback, errback, headers=[]) {
    var postReceived = function(e) {
        var http_response = e.target;
        if (http_response.readyState === 4 ) {
            if (http_response.status < 400) {
                console.log(http_response, http_response.status, http_response.response);
                callback(http_response.response);
            } else {
                console.error(http_response.response);
                if (typeof errback === 'function') {
                    errback(http_response.response);
                }
            }
        }
    };
    var csrfCookie = Cookies.get('csrftoken'),
        client = new XMLHttpRequest();

    client.onreadystatechange = postReceived;
    client.open("DELETE", url, true);
    client.setRequestHeader("Accept", "application/json");
    client.setRequestHeader("X-CSRFToken", csrfCookie);
    client.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    headers.map(function(val){console.log(val[0],val[1]);client.setRequestHeader(val[0], val[1]);});

    client.send('');
};
