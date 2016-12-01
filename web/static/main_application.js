var React, ReactDOM, console;
var ClimbRecordList, ClimbRecordStats, ClimbRecordHistory,
    globalReloadClimbRecordList, globalReloadClimbRecordStats, globalReloadClimbRecordHistory,
    RecordForm, postData;

var climb_record_list = React.createElement(ClimbRecordList, {className: 'climb-list'}),
    climb_record_stats = React.createElement(ClimbRecordStats, {className: 'climb-stats'}),
    climb_record_history = React.createElement(ClimbRecordHistory, {className: 'climb-history'});


function reloadDataFromAPI() {
    globalReloadClimbRecordList();
    globalReloadClimbRecordStats();
    globalReloadClimbRecordHistory();
}

var WspinologiaNavigation = React.createClass({
    propTypes: {},
    getInitialState: function() {
        return {selected: 'list'};
    },
    render: function() {
        var nav_bar = React.createElement('div', {className: 'navigation'},
            React.createElement('span', {
                onClick: () => this.setState({selected: 'list'}),
                className: (this.state.selected === 'list' ? 'active' : '')
            }, 'LIST'),
            React.createElement('span', {
                onClick: () => this.setState({selected: 'stats'}),
                className: (this.state.selected === 'stats' ? 'active' : '')
            }, 'STATS'),
            React.createElement('span', {
                onClick: () => this.setState({selected: 'import'}),
                className: (this.state.selected === 'import' ? 'active' : '')
            }, 'IMPORT/EXPORT')
        );
        if (this.state.selected === 'list') {
            return (React.createElement('div', {},
                nav_bar,
                React.createElement(RecordForm, {
                    onSubmit: postData
                }),
                climb_record_list
            ));
        } else if (this.state.selected === 'stats') {
            return (React.createElement('div', {},
                nav_bar,
                climb_record_stats,
                climb_record_history
            ));
        } else {
            console.log('HELL');
            return (React.createElement('div', {}, nav_bar));
        }
    }
});

var buildApp = function() {
    ReactDOM.render(
        React.createElement(WspinologiaNavigation, {}),
        document.getElementById('react_list')
    );
};

buildApp();
reloadDataFromAPI();

