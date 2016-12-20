var console = require('console');

module.exports = function(query, dataCallback, dataErrback){
    var loadData = function(e) {
        if(e.target.status == 200) {
            dataCallback(JSON.parse(e.target.response));
        } else {
            console.error(e.target.response);
            if (dataErrback === 'function') {
                dataErrback(e.target.response);
            }
        }
    };

    var client = new XMLHttpRequest();
    client.onload = loadData;
    client.open("GET", query);
    client.setRequestHeader("Accept", "application/json");
    client.send();
};
