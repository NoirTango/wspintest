var React, ReactDOM, console;
var ClimbRecordList, climbRecordStats, globalSetClimbRecordList, RecordForm, postData, reloadListFromAPI;

var climb_record_list = React.createElement(ClimbRecordList, {className: 'climb-list'}),
    climb_record_stats = React.createElement(ClimbRecordStats, {className: 'climb-stats'});


function resetClimbRecordStats() {
  var retrieved_list;
  if(this.status == 200) {
    console.log(this.response);
    retrieved_list = JSON.parse(this.response);
    globalSetClimbRecordStats(retrieved_list);
  } else {
    console.log(this.response);
  }
}


function reloadStatsFromAPI() {
    var client = new XMLHttpRequest();
    client.onload = resetClimbRecordStats;
    client.open("GET", "/api/scores-total/");
    client.setRequestHeader("Accept", "application/json");
    client.send();
}

function reloadDataFromAPI() {
    reloadListFromAPI();
    reloadStatsFromAPI();
}

var buildApp = function() {
    ReactDOM.render(
        React.createElement('div', {},
            React.createElement(RecordForm, {
                onSubmit: postData
            }),
            climb_record_stats,
            climb_record_list
        ),
        document.getElementById('react_list'));
};

buildApp();
reloadDataFromAPI();

