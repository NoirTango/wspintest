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
        data: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func,
    },
    onRouteChange: function(text) {
        this.props.data.route.text = text;
        this.props.onChange(this.props.data);
    },
    onSectorChange: function(text) {
        this.props.data.sector.text = text;
        this.props.onChange(this.props.data);
    },
    onCragChange: function(text) {
        this.props.data.crag.text = text;
        this.props.onChange(this.props.data);
    },
    render: function() {
        return (
            React.createElement('form', {noValidate: true},
                React.createElement(QueryableTextField, {
                    value: this.props.data.route,
                    name: 'route',
                    dataDisplay: routeDisplay,
                    query: "/api/routes/?search=",
                    onChange: this.onRouteChange
                }),
                React.createElement(QueryableTextField, {
                    value: this.props.data.sector,
                    name: 'sector',
                    dataDisplay: sectorDisplay,
                    query: "/api/sectors/?search=",
                    onChange: this.onSectorChange
                }),
                React.createElement(QueryableTextField, {
                    value: this.props.data.crag,
                    name: 'crag',
                    dataDisplay: cragDisplay,
                    query: "/api/crags/?search=",
                    onChange: this.onCragChange
                }),
                React.createElement('button', {type: 'submit'}, 'Linked!')
            )
        );
    }
});
