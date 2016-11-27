var React, ReactDOM, console;
var ClimbRecordList, ClimbRecordStats, globalSetClimbRecordList, globalSetClimbRecordStats,
    RecordForm, postData, reloadListFromAPI, globalReloadClimbRecordStats;

var climb_record_list = React.createElement(ClimbRecordList, {className: 'climb-list'}),
    climb_record_stats = React.createElement(ClimbRecordStats, {className: 'climb-stats'});


function reloadDataFromAPI() {
    reloadListFromAPI();
    globalReloadClimbRecordStats();
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

