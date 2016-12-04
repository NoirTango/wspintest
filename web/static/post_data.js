var console, Cookies, reloadDataFromAPI;
var postReceived = function() {
    if(this.status == 201) {
        console.log(this.response);
        reloadDataFromAPI();
    } else {
        console.log(this.response);
    }
};

var postClimbRecordData = function(data) {
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

var postCsvReceived = function() {
    if (this.status === 204) {
        reloadDataFromAPI();
    } else {
        console.log(this.status);
        console.log(this.response);
    }
};

var putClimbRecordCSV = function(csv_file) {
    var csrfCookie = Cookies.get('csrftoken');
    var fr = new FileReader();
    fr.onload = function(e) {
        var payload = e.target.result;
        var client = new XMLHttpRequest();
        client.onload = postCsvReceived;
        client.open("POST", "/api/csv-import/");
        client.setRequestHeader("X-CSRFToken", csrfCookie);
        client.setRequestHeader("Content-Type", "text/csv");
        client.setRequestHeader("Content-Disposition", 'attachment;filename="'+csv_file.filename+'"');
        client.send(payload);
    };
    fr.readAsText(csv_file);
};

var importStaticGrades = function(scale_type) {
    var csrfCookie = Cookies.get('csrftoken');
    var client = new XMLHttpRequest();
    client.onload = globalReloadGradeScoreList;
    client.open("POST", "/api/scores/import_static/");
    client.setRequestHeader("X-CSRFToken", csrfCookie);
    client.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    client.send(JSON.stringify({type: scale_type}));
};
