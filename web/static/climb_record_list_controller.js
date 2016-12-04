// jshint esnext: true
var React, ReactDOM, console;
var globalReloadClimbRecordList, ConnectToAPIComponent;

var normalise = function(api_data) {
    return {
        key: api_data.id,
        name: api_data.route_name,
        grade: api_data.route_grade,
        sector: api_data.sector_name,
        crag: api_data.crag_name,
        country: api_data.crag_country,
        date: api_data.date,
        search_term: (api_data.date +' ' +
                      api_data.route_name.toLowerCase() + ' ' +
                      api_data.route_grade.toLowerCase() + ' ' +
                      api_data.sector_name.toLowerCase() + ' ' +
                      api_data.crag_name.toLowerCase() + ' ' +
                      api_data.crag_country.toLowerCase())
    };
};

var ClimbRecord = React.createClass({
    propTypes: {
        date: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        grade: React.PropTypes.string.isRequired,
        sector: React.PropTypes.string.isRequired,
        crag: React.PropTypes.string.isRequired,
        country: React.PropTypes.string.isRequired,
    },

    render: function() {
        return (
            React.createElement('tr', {className: this.props.className},
                React.createElement('td', {}, this.props.date),
                React.createElement('td', {}, this.props.name),
                React.createElement('td', {}, this.props.grade),
                React.createElement('td', {}, this.props.sector),
                React.createElement('td', {}, this.props.crag),
                React.createElement('td', {}, this.props.country)
            )
        );
    }
});

var ClimbRecordList = React.createClass({
    getInitialState: function() {
        return {climbs: [], reload: true, filter_text: '', sort_key: '', sort_order: 1};
    },
    componentWillMount: function() {
        var component = this;
        globalReloadClimbRecordList = function() {
            component.setState((prevState, props) => Object.assign({}, prevState, {reload: true}));
        };
    },
    setData: function(data) {
        this.setState((prevState, props) => Object.assign({}, prevState, {climbs: data, reload: false}));
    },
    updateFilter: function(e) {
        var v = e.target.value;
        this.setState((prevState, props) => Object.assign({}, prevState, {filter_text: v}));
    },
    updateSort: function(column) {
        var component = this;
        return function() {
            var key = column, order = 1;
            if (component.state.sort_key == column) {
                if (component.state.sort_order === 1) {
                    order = -1;
                } else {
                    key = '';
                    order = 1;
                }
            }
            component.setState((prevState, props) => Object.assign({}, prevState, {sort_key: key, sort_order: order}));
        };
    },
    render: function() {
        var normalised_rows = this.state.climbs.map(normalise),
            component = this,
            columns = {
                'date': 'Date',
                'name': 'Name',
                'grade': 'Grade',
                'sector': 'Sector',
                'crag': 'Crag',
                'country': 'Country'
            },
            column_keys = ['date', 'name', 'grade', 'sector', 'crag', 'country'];

        if (this.state.sort_key !== '') {
            normalised_rows = normalised_rows.sort(
                (a,b) => this.state.sort_order*a[this.state.sort_key].localeCompare(b[this.state.sort_key])
            );
        }
        return (
            React.createElement('div', {},
                React.createElement(ConnectToAPIComponent, {
                   query: "/api/climb-records/",
                   reload: this.state.reload,
                   dataCallback: this.setData
                }),
                React.createElement('div', {className: 'filter'},
                    'Filter:',
                    React.createElement('input', {
                       type: 'text',
                       value: this.state.filter_text,
                       onChange: this.updateFilter
                    })
                ),
                React.createElement('table', {className: 'climb-list'},
                    React.createElement('tbody', {},
                        React.createElement('tr', {key: 'header'},
                            column_keys.map(function(column_key){
                                var icon = null;
                                if (column_key == component.state.sort_key) {
                                    icon = React.createElement('i', {
                                        className: component.state.sort_order > 0 ? 'icon-down-dir' : 'icon-up-dir'
                                    });
                                }
                                return React.createElement('th', {
                                    onClick: component.updateSort(column_key)
                                }, icon, columns[column_key], icon);
                            })
                        ),
                        normalised_rows
                        .filter(function(cr) {
                            return cr.search_term.indexOf(component.state.filter_text) >= 0;
                        })
                        .map(function(row_props, i) {
                            //var row_props = normalise(cr);
                            if (i%2) {
                                row_props.className = 'odd';
                            } else {
                                row_props.className = 'even';
                            }
                            return React.createElement(ClimbRecord, row_props);
                        })
                    )
                )
            )
        );
    }
});
