// jshint esnext: true
var React = require('react'),
    ReactDOM = require('react-dom'),
    ClimbRecordList = require('./ClimbRecordList.js'),
    ClimbRecordForm = require('./ClimbRecordForm.js'),
    getAPIData = require('./getAPIData.js'),
    postAPIData = require('./postAPIData.js');

var MainPage = React.createClass({
    getInitialState: function() {
        this.reloadData();
        return {climbs: []};
    },
    setData: function(data) {
        this.setState((prevState, props) => Object.assign({}, prevState, {climbs: data}));
    },
    reloadData: function() {
        getAPIData('/api/climb-records/', this.setData);
    },
    submitForm: function(data) {
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
        postAPIData(flatData, '/api/climb-records/', this.reloadData);
    },
    render: function() {
        return React.createElement('div', {},
            React.createElement(ClimbRecordForm, {
                onSubmit: this.submitForm
            }),
            React.createElement(ClimbRecordList, {className: 'climb-list', climbs: this.state.climbs})
        );
    }
});

var buildApp = function() {
    ReactDOM.render(
        React.createElement(MainPage),
        document.getElementById('react-app')
    );
};

buildApp();

