// jshint esnext: true
var React, ReactDOM, console;
var globalReloadGradeScoreList, ConnectToAPIComponent;

var GradeScore = React.createClass({
    propTypes: {
        grade: React.PropTypes.string.isRequired,
        score: React.PropTypes.number.isRequired
    },

    render: function() {
        return (
            React.createElement('tr', {className: this.props.className},
                React.createElement('td', {}, this.props.grade),
                React.createElement('td', {}, this.props.score)
            )
        );
    }
});

var GradeScoreList = React.createClass({
    getInitialState: function() {
        return {climbs: [], reload: true};
    },
    componentWillMount: function() {
        var component = this;
        globalReloadGradeScoreList = function() {
            component.setState((prevState, props) => Object.assign({}, prevState, {reload: true}));
        };
    },
    setData: function(data) {
        this.setState((prevState, props) => Object.assign({}, prevState, {climbs: data, reload: false}));
    },
    render: function() {
        var scales = [
            ['french', 'Import French scale'],
            ['polish', 'Import Polish scale'],
            ['uiaa', 'Import UIAA scale']
        ];
        return (
            React.createElement('div', {},
                React.createElement(ConnectToAPIComponent, {
                   query: "/api/scores/",
                   reload: this.state.reload,
                   dataCallback: this.setData
                }),
                scales.map((g) => React.createElement('div', {
                    className: 'button',
                    onClick: (() => importStaticGrades(g[0]))
                }, g[1])),
                React.createElement('table', {className: 'climb-list'},
                    React.createElement('tbody', {},
                        React.createElement('tr', {},
                            React.createElement('th', {}, 'Grade'),
                            React.createElement('th', {}, 'Score')
                        ),
                        this.state.climbs.map(function(cr, i) {
                            if (i%2) {
                                cr.className = 'odd';
                            } else {
                                cr.className = 'even';
                            }
                            return React.createElement(GradeScore, cr);
                        })
                    )
                )
            )
        );
    }
});
