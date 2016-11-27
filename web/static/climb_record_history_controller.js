var React, ReactDOM, console, ConnectToAPIComponent;

var globalReloadClimbRecordHistory;

var ClimbRecordHistory = React.createClass({
    propTypes: {},
    getInitialState: function() {
        return ({
            data: null,
            reload: true
        });
    },
    componentWillMount: function() {
        var component = this;
        globalReloadClimbRecordHistory = function() {
            component.setState((prevState, props) => Object.assign({}, prevState, {reload: true}));
        };
    },
    setData: function(data) {
        this.setState((prevState, props) => Object.assign({}, prevState, {data: data, reload: false}));
    },
    buildTable: function() {
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
                            React.createElement('td', {key: 'info'+count.grade}, count.grade),
                            count.count.map(function(num, i) {
                                return React.createElement('td', {key: 'data'+count.grade+i},
                                    React.createElement('div', {
                                        style: {width: 100*num/max_total+'%'},
                                        className: 'count-span',
                                        dangerouslySetInnerHTML: {__html: '&nbsp;'}
                                    })
                                );
                            })
                        )
                    );
                })
            )
        );
    },
    render: function() {
        var loader = React.createElement(ConnectToAPIComponent, {
            query: "/api/scores-history/",
            dataCallback: this.setData,
            reload: this.state.reload
        });
        var table;
        if (this.state.data === null) {
            table = null;
        } else {
            table = this.buildTable();
        }
        return React.createElement('div', {}, loader, table );
    }
});
