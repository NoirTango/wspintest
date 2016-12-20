//jshint esnext: true
var React = require('react'),
    console = require('console'),
    getAPIData = require('./getAPIData.js');

module.exports = React.createClass({
    propTypes: {},
    getInitialState: function() {
        return ({
            data: null,
            reload: true
        });
    },
    setData: function(data) {
        this.setState((prevState, props) => Object.assign({}, prevState, {data: data, reload: false}));
    },
    reloadData: function() {
        getAPIData('/api/scores-history/', this.setData);
    },
    buildCountTable: function() {
        var totals = this.state.data.years.map((year) => this.state.data.total_counts[year]),
            max_total = totals.reduce((a,b) => (a>b?a:b), 0);
        return React.createElement('table', {className: 'history-table'},
            React.createElement('tbody', {},
                React.createElement('tr', {key: 'history-header'},
                    React.createElement('th', {key: 'grade'}, ''),
                    this.state.data.years.map(function(year) {
                        return React.createElement('th', {key: year}, year);
                    })
                ),
                this.state.data.counts.map(function(count) {
                    return (
                        React.createElement('tr', {key: 'row'+count.grade},
                            React.createElement('td', {key: 'info'+count.grade, className: 'climb-count-cell'}, count.grade),
                            count.count.map(function(num, i) {
                                return React.createElement('td', {key: 'data'+count.grade+i, className: 'climb-count-cell'},
                                    React.createElement('svg', {},
                                        React.createElement('line', {
                                            x1: '0%', y1: '50%', x2: '100%', y2: '50%',
                                            className: 'climb-count-horizontal-line'
                                        }),
                                        React.createElement('circle', {
                                            r: num/max_total + 'em',
                                            cx: "50%",
                                            cy: "50%",
                                            className: 'climb-count-dot'
                                        })
                                    )
                                );
                            })
                        )
                    );
                })
            )
        );
    },
    buildPointsTable: function() {

        return React.createElement('table', {},
            React.createElement('tbody', {},
                React.createElement('tr', {},
                    React.createElement('td', {className: 'climb-points-cell'}),
                    this.state.data.years.map((year) => React.createElement('th', {className: 'climb-points-cell'}, year))
                ),
                React.createElement('tr', {},
                    React.createElement('td', {className: 'climb-points-cell'}),
                    this.state.data.years.map((year) => React.createElement('td', {className: 'climb-points-cell'},
                        React.createElement('svg', {},
                            React.createElement('line', {x1: '50%', y1: '100%', x2: '50%', y2:
                                (100-this.state.data.total_points[year]) + '%', className: 'climb-points-line'})
                            )
                        )
                    )
                )
            )
        );
    },
    render: function() {
        var count_table, points_table;
        if (this.state.reload) {
            this.reloadData();
        }
        if (this.state.data === null) {
            count_table = null;
            points_table = null;
        } else {
            count_table = this.buildCountTable();
            points_table = this.buildPointsTable();
        }
        return React.createElement('div', {}, count_table, points_table );
    }
});