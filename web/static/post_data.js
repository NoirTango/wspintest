var console, Cookies, reloadDataFromAPI;
var postReceived = function() {
    if(this.status == 201) {
        console.log(this.response);
        reloadDataFromAPI();
    } else {
        console.log(this.response);
    }
};

var postData = function(data) {
    var csrfCookie = Cookies.get('csrftoken');
    var flatData = {
        route: data.route.id,
        sector: data.sector.id,
        crag: data.crag.id,
        route_name: data.route.value,
        route_grade: data.grade,
        sector_name: data.sector.value,
        crag_name: data.crag.value,
        crag_country: data.country,
        date: data.date
    };
    var postData = JSON.stringify(flatData);
    var client = new XMLHttpRequest();
    client.onload = postReceived;
    client.open("POST", "/api/climb-records/ajax/");
    client.setRequestHeader("Accept", "application/json");
    client.setRequestHeader("X-CSRFToken", csrfCookie);
    client.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    client.send(postData);
};

