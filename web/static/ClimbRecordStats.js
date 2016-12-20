// jshint esnext: true
var React = require('react'),
    console = require('console'),
    getAPIData = require('./getAPIData.js');


var normalise_stats = function(api_data, total) {
    return {
        key: api_data.grade,
        grade: api_data.grade,
        count: api_data.count,
        percentage: (total > 0.0 ? 100*api_data.count/total : 0.0)
    };
};

var YearSelector = React.createClass({
    propTypes: {
        year: React.PropTypes.string.isRequired,
        up: React.PropTypes.func,
        down: React.PropTypes.func
    },
    render: function() {
        var c_name_up = 'icon-right-open ' + (this.props.up !== null ? 'endbled' : 'disabled'),
            c_name_down = 'icon-left-open ' + (this.props.down !== null ? 'endbled' : 'disabled');
        return (
            React.createElement('span', {},
                React.createElement('i', {className: c_name_down, onClick: this.props.down}),
                this.props.year,
                React.createElement('i', {className: c_name_up, onClick: this.props.up})
            )
        );
    }
});

var GradeStat = React.createClass({
    propTypes: {
        grade: React.PropTypes.string.isRequired,
        count: React.PropTypes.number.isRequired,
        percentage: React.PropTypes.number.isRequired,
    },

    render: function() {
        return (
            React.createElement('li', {className: this.props.className},
                React.createElement('span', {className: 'grade'}, this.props.grade),
                React.createElement(
                    'span', {className: 'count', style:{width: this.props.percentage+'%'}}, this.props.count
                )
            )
        );
    }
});

module.exports = React.createClass({
    getInitialState: function() {
        var current_year = new Date().getFullYear();
        return {stats: [], year: null, maxYear: current_year, reload: true};
    },
    setData: function(data) {
        this.setState((prevState, props) => Object.assign({}, prevState, {stats: data, reload: false}));
    },
    reloadData: function() {
        var query = '/api/scores-total/';
        if ((this.state !== null) && (this.state.year !== null)) {
            query = query + '?year=' + this.state.year;
        }
        getAPIData(query, this.setData);
    },
    onUpClicked: function() {
        this.setState(function(prevState, props){
            var new_year = null;
            if (prevState.year < prevState.maxYear) {
                new_year = prevState.year + 1;
            }
            return Object.assign({}, prevState, {year: new_year, reload: true});
        });
    },
    onDownClicked: function() {
        this.setState(function(prevState, props){
            var new_year = prevState.maxYear;
            if (this.state.year !== null) {
                new_year = prevState.year - 1;
            }
            return Object.assign({}, prevState, {year: new_year, reload: true});
        });
    },
    render: function() {
        var total = this.state.stats.reduce(function(sum, stat) {return sum + stat.count;}, 0);
        if (this.state.reload) {
            this.reloadData();
        }
        return (
            React.createElement('div', {className: 'climb-stats'},
                React.createElement('div', {className: 'title'},
                    React.createElement('span', {}, 'Grade stats'),
                    React.createElement(YearSelector, {
                        year: (this.state.year !== null ? ''+this.state.year : 'all'),
                        up: (this.state.year !== null ? this.onUpClicked : null),
                        down: this.onDownClicked
                    })
                ),
                React.createElement('ul', {},
                    this.state.stats.map(function(s, i) {
                        var stat_props = normalise_stats(s, total);
                        return React.createElement(GradeStat, stat_props);
                    })
                )
            )
        );
    }
});
