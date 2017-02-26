// jshint esnext: true
var React = require('react'),
    console = require('console'),
    ClimbRecordRow = require('./ClimbRecordRow.js');

var normalise = function(api_data) {
    console.log(api_data);
    return {
        id: api_data.id,
        name: api_data.route_name,
        grade: api_data.route_grade,
        score: api_data.route_score,
        style: api_data.style,
        sector: api_data.sector_name,
        crag: api_data.crag_name,
        country: api_data.crag_country,
        date: api_data.date,
        search_term: (api_data.date +' ' +
                      api_data.route_name.toLowerCase() + ' ' +
                      api_data.route_grade.toLowerCase() + ' ' +
                      api_data.style.toLowerCase() + ' ' +
                      api_data.sector_name.toLowerCase() + ' ' +
                      api_data.crag_name.toLowerCase() + ' ' +
                      api_data.crag_country.toLowerCase())
    };
};


module.exports = React.createClass({
    props: {
        climbs: React.PropTypes.array.required
    },
    getInitialState: function() {
        return {filter_text: '', sort_key: '', sort_order: 1};
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
        var normalised_rows = this.props.climbs.map(normalise),
            component = this,
            columns = {
                'date': 'Date',
                'name': 'Name',
                'grade': 'Grade',
                'style': 'Style',
                'sector': 'Sector',
                'crag': 'Crag',
                'country': 'Country'
            },
            column_keys = ['name', 'grade', 'style', 'sector', 'crag', 'country', 'date'];

        if (this.state.sort_key !== '') {
            var key = this.state.sort_key, comparator;
            if (key == 'grade') {
                comparator = (a,b) => this.state.sort_order*Math.sign(a.score - b.score);
            } else {
                comparator = (a,b) => this.state.sort_order*a[key].localeCompare(b[key]);
            }
            normalised_rows = normalised_rows.sort(comparator);
        }

        return (
            React.createElement('div', {},
                React.createElement('div', {className: 'filter'},
                    'Filter:',
                    React.createElement('input', {
                       type: 'text',
                       value: this.state.filter_text,
                       onChange: this.updateFilter
                    })
                ),
                React.createElement('table', {className: 'climb-list'},
                    React.createElement('tbody', {key: 'body'},
                        React.createElement('tr', {key: 'header'},
                            column_keys.map(function(column_key, i){
                                var icon = null;
                                if (column_key == component.state.sort_key) {
                                    icon = React.createElement('i', {
                                        className: component.state.sort_order > 0 ? 'icon-down-dir' : 'icon-up-dir'
                                    });
                                }
                                return React.createElement('th', {
                                    onClick: component.updateSort(column_key),
                                    key: column_key+'H'
                                }, icon, columns[column_key], icon);
                            })
                        ),
                        normalised_rows
                        .filter(function(cr) {
                            return cr.search_term.indexOf(component.state.filter_text) >= 0;
                        })
                        .map(function(row_props, i) {
                            if (i%2) {
                                row_props.className = 'odd';
                            } else {
                                row_props.className = 'even';
                            }
                            row_props.key = row_props.id + 'CRR';
                            return React.createElement(ClimbRecordRow, row_props);
                        })
                    )
                )
            )
        );
    }
});
