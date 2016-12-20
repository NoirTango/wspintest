//jshint esnext: true
var React = require('react'),
    ReactDOM = require('react-dom'),
    ClimbRecordStats = require('./ClimbRecordStats.js'),
    ClimbRecordHistory = require('./ClimbRecordHistory.js');


ReactDOM.render(
    React.createElement('div', {},
        React.createElement(ClimbRecordStats, {className: 'climb-stats'}),
        React.createElement(ClimbRecordHistory, {className: 'climb-history'})
    ),
    document.getElementById('react_list')
);

