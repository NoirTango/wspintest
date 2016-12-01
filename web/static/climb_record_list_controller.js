var React, ReactDOM, console;

var globalReloadClimbRecordList;

var normalise = function(api_data) {
    return {
        key: api_data.id,
        name: api_data.route_name,
        grade: api_data.route_grade,
        sector: api_data.sector_name,
        crag: api_data.crag_name,
        country: api_data.crag_country,
        date: api_data.date
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
        return {climbs: [], reload: true};
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
    render: function() {
        return (
            React.createElement('div', {},
                React.createElement(ConnectToAPIComponent, {
                   query: "/api/climb-records/",
                   reload: this.state.reload,
                   dataCallback: this.setData
                }),
                React.createElement('table', {className: 'climb-list'},
                    React.createElement('tbody', {},
                        React.createElement('tr', {},
                            React.createElement('th', {}, 'Date'),
                            React.createElement('th', {}, 'Name'),
                            React.createElement('th', {}, 'Grade'),
                            React.createElement('th', {}, 'Sector'),
                            React.createElement('th', {}, 'Crag'),
                            React.createElement('th', {}, 'Country')
                        ),
                        this.state.climbs.map(function(cr, i) {
                            var row_props = normalise(cr);
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
