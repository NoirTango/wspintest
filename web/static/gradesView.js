// jshint esnext: true
var ReactDOM = require('react-dom'),
    React = require('react'),
    GradeScoreList = require('./GradeScoreList.js'),
    getAPIData = require('./getAPIData.js'),
    postAPIData = require('./postAPIData.js');

var GradesView = React.createClass({
    getInitialState: function() {
        this.reloadData();
        return {grades: []};
    },
    setData: function(data) {
        this.setState((prevState, props) => Object.assign({}, prevState, {grades: data}));
    },
    reloadData: function() {
        getAPIData('/api/scores/', this.setData);
    },
    importStaticGrades: function(name){
        return (() => postAPIData({type: name}, '/api/scores/import_static/', this.reloadData));
    },
    rowEditCallback: function(new_value, old_row) {
        // In fact it should be simpler by calling update to API
        console.log(new_value);
        console.log(old_row);
        var newgrades = [];
        this.setData(this.state.grades.map(function(row){
            if (row.id != old_row.id) {
                return row;
            } else {
                return Object.assign({}, old_row, new_value);
            }
        }));
    },
    render: function() {
        var scales = [
            ['french', 'Import French scale'],
            ['polish', 'Import Polish scale'],
            ['uiaa', 'Import UIAA scale']
        ];
        return React.createElement('div', {},
            scales.map((g) => React.createElement('div', {
                key: g[0] + 'button',
                className: 'button',
                onClick: this.importStaticGrades(g[0])
            }, g[1])),
            React.createElement(GradeScoreList, {className: 'climb-history', grades: this.state.grades, rowEditCallback: this.rowEditCallback})
        );
    }
});

ReactDOM.render(
    React.createElement(GradesView),
    document.getElementById('react-app')
);
