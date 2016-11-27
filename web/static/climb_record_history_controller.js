var React, ReactDOM, console;

var globalReloadClimbRecordHistory;

var ConnectToAPIComponent = React.createClass({
    propTypes: {
        query: React.PropTypes.string.isRequired,
        dataCallback: React.PropTypes.func.isRequired
    }
});
var ClimbRecordHistory = React.createClass({
    propTypes: {},
    getInitialState: function() {
        return ({
            data: null
        });
    },
    reloadCallback: function(e) {
        var retrieved_list;
        if(e.target.status == 200) {
            retrieved_list = JSON.parse(e.target.response);
            this.setState((prevState, props) => Object.assign({}, prevState, {data: retrieved_list}));
        } else {
            console.log(e.target.response);
        }
    },
    reloadHistory: function() {
        var client = new XMLHttpRequest();
        var query = "/api/scores-history/";
        client.onload = this.reloadCallback;
        client.open("GET", query);
        client.setRequestHeader("Accept", "application/json");
        client.send();
    },
    componentWillMount: function() {
        var component = this;
        globalReloadClimbRecordHistory = function() {
            component.reloadHistory();
        };
    },
    render: function() {
        if (this.state.data === null) {
            return null;
        }
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
    }
});

