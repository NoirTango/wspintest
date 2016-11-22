var React, ReactDOM;

var globalSetClimbRecordStats;

var normalise_stats = function(api_data) {
    return {
        key: api_data.grade,
        grade: api_data.grade,
        count: api_data.count,
        percentage: api_data.percentage
    };
};

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

var ClimbRecordStats = React.createClass({
    getInitialState: function() {
        return {stats: []};
    },
    componentWillMount: function() {
        var component = this;
        globalSetClimbRecordStats = function(stats) {
            component.setState(Object.assign({}, component.state, {stats: stats}));
        };
    },
    render: function() {
        return (
            React.createElement('div', {className: 'climb-stats'},
                React.createElement('div', {className: 'title'}, 'Grade stats'),
                React.createElement('ul', {},
                    this.state.stats.map(function(s, i) {
                        var stat_props = normalise_stats(s);
                        return React.createElement(GradeStat, stat_props);
                    })
                )
            )
        );
    }
});
