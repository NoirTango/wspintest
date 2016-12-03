// jshint esnext: true
var React, ReactDOM, console;
var ClimbRecordList, ClimbRecordStats, ClimbRecordHistory,
    globalReloadClimbRecordList, globalReloadClimbRecordStats, globalReloadClimbRecordHistory,
    globalReloadGradeScoreList,
    RecordForm, postClimbRecordData, putClimbRecordCSV, GradeScoreList;

var climb_record_list = React.createElement(ClimbRecordList, {className: 'climb-list'}),
    climb_record_stats = React.createElement(ClimbRecordStats, {className: 'climb-stats'}),
    climb_record_history = React.createElement(ClimbRecordHistory, {className: 'climb-history'}),
    grade_score_list = React.createElement(GradeScoreList, {className: 'climb-history'});


function reloadDataFromAPI() {
    var all_reload_functions = [globalReloadClimbRecordList, globalReloadGradeScoreList, globalReloadClimbRecordStats,
                                globalReloadClimbRecordHistory];
    all_reload_functions.map((f) => (typeof f === 'function' ? f() : null));
}

var NavigationElement = React.createClass({
    propTypes: {
        state_name: React.PropTypes.string.isRequired,
        state_label: React.PropTypes.string.isRequired,
        render_body: React.PropTypes.func
    },
    render: function() {
        return this.props.render_body();
    }
});

var WspinologiaNavigation = React.createClass({
    propTypes: {},
    getInitialState: function() {
        return {selected: 'list'};
    },
    submitImport: function() {
        putClimbRecordCSV(this.refs.filebutton.files[0]);
    },
    render: function() {
        var nav_bar = React.createElement('div', {className: 'navigation'},
            this.props.children.map((chld) => React.createElement('span', {
                    onClick: () => this.setState({selected: chld.props.state_name}),
                    className: (this.state.selected === chld.props.state_name ? 'active' : '')
                },
                chld.props.state_label)
            )
        );
        return React.createElement('div', {},
            nav_bar,
            this.props.children.map((chld) => (this.state.selected == chld.props.state_name ? chld.props.render_body() : null))
        );
    }
});

var buildApp = function() {
    ReactDOM.render(
        React.createElement(WspinologiaNavigation, {},
            React.createElement(NavigationElement, {
                state_name: 'list',
                state_label: 'List',
                render_body: function() {
                    return React.createElement('div', {},
                        React.createElement(RecordForm, {
                            onSubmit: postClimbRecordData
                        }),
                        climb_record_list
                    );
                }
            }),
            React.createElement(NavigationElement, {
                state_name: 'stats',
                state_label: 'Stats',
                render_body: function() {
                    return React.createElement('div', {},
                        climb_record_stats,
                        climb_record_history
                    );
                }
            }),
            React.createElement(NavigationElement, {
                state_name: 'grades',
                state_label: 'Grades',
                render_body: function() {
                    return React.createElement('div', {},
                        grade_score_list
                    );
                }
            }),
            React.createElement(NavigationElement, {
                state_name: 'import',
                state_label: 'Import/Export',
                render_body: function() {
                    return React.createElement('div', {className: 'import-export'},
                        React.createElement('span', {
                            className: 'button',
                            onClick: function() {location.replace('/api/csv-export/');}
                        }, 'Export'),
                        React.createElement('span', {
                            className: 'button',
                            onClick: (() => this.refs.filebutton.click())
                        },
                        React.createElement('input', {
                            type: 'file',
                            ref: 'filebutton',
                            style: {display: 'none'},
                            onChange: this.submitImport
                        }),
                        'Import'
                    ));
                }
            })
        ),
        document.getElementById('react_list')
    );
};

buildApp();
reloadDataFromAPI();

