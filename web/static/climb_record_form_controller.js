var React, console, QueryableTextField;

var routeDisplay = function(route) {
    return route.name + ' ' + route.grade + ' - ' + route.sector_name + ' - ' + route.crag_name;
};

var sectorDisplay = function(sector) {
    return sector.name + ' - ' + sector.crag_name + ' / ' + sector.crag_country;
};

var cragDisplay = function(crag) {
    return crag.name  + ' / ' + crag.country;
};


var RecordForm = React.createClass({
    propTypes: {
        route: React.PropTypes.string.isRequired,
        sector: React.PropTypes.string.isRequired,
        crag: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func,
    },
    getInitialState: function() {
        return {};
    },
    onRouteChange: function(obj) {
        this.setState(Object.assign({}, this.state, {route: obj}));
        console.log(obj);
        //this.props.onChange(this.props.data);
    },
    onSectorChange: function(obj) {
        this.setState(Object.assign({}, this.state, {sector: obj}));
        console.log(obj);
        //this.props.onChange(this.props.data);
    },
    onCragChange: function(obj) {
        this.setState(Object.assign({}, this.state, {crag: obj}));
        console.log(obj);
        //this.props.onChange(this.props.data);
    },
    render: function() {
        return (
            React.createElement('form', {noValidate: true},
                React.createElement('div', {},
                    React.createElement(QueryableTextField, {
                        value: this.props.route,
                        name: 'route',
                        dataDisplay: routeDisplay,
                        query: "/api/routes/?search=",
                        onChange: this.onRouteChange
                    }),
                    React.createElement('input', {type: 'text', name: 'grade'})
                ),
                React.createElement('div', {},
                    React.createElement(QueryableTextField, {
                        value: this.props.sector,
                        name: 'Sector',
                        dataDisplay: sectorDisplay,
                        query: "/api/sectors/?search=",
                        onChange: this.onSectorChange
                    })
                ),
                React.createElement('div', {},
                    React.createElement(QueryableTextField, {
                        value: this.props.crag,
                        name: 'Crag',
                        dataDisplay: cragDisplay,
                        query: "/api/crags/?search=",
                        onChange: this.onCragChange
                    }),
                    React.createElement('input', {type: 'text', name: 'country'})
                ),
                React.createElement('input', {type: 'text'}),
                React.createElement('div', {}, JSON.stringify(this.state)),
                React.createElement('button', {type: 'submit'}, 'Linked!')
            )
        );
    }
});
