var React, ReactDOM, console;
var ClimbRecordList, ClimbRecordStats, globalSetClimbRecordList, globalSetClimbRecordStats,
    RecordForm, postData, reloadListFromAPI, globalReloadClimbRecordStats, ClimbRecordHistory;

var climb_record_list = React.createElement(ClimbRecordList, {className: 'climb-list'}),
    climb_record_stats = React.createElement(ClimbRecordStats, {className: 'climb-stats'}),
    climb_record_history = React.createElement(ClimbRecordHistory, {className: 'climb-history'});


function reloadDataFromAPI() {
    reloadListFromAPI();
    globalReloadClimbRecordStats();
    globalReloadClimbRecordHistory();
}

var buildApp = function() {
    ReactDOM.render(
        React.createElement('div', {},
            React.createElement(RecordForm, {
                onSubmit: postData
            }),
            climb_record_stats,
            climb_record_list,
            climb_record_history
        ),
        document.getElementById('react_list'));
};

buildApp();
reloadDataFromAPI();

