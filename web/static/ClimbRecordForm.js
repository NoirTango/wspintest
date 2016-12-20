//jshint esnext:true

var React = require('react'),
    console = require('console')
    QueryableTextField = require('./QueryableTextField.js');

var routeDisplay = function(route) {
    return route.name + ' ' + route.grade + ' - ' + route.sector_name + ' - ' + route.crag_name;
};

var sectorDisplay = function(sector) {
    return sector.name + ' - ' + sector.crag_name + ' / ' + sector.crag_country;
};

var cragDisplay = function(crag) {
    return crag.name  + ' / ' + crag.country;
};

module.exports = React.createClass({
    propTypes: {
        onChange: React.PropTypes.func,
    },
    getInitialState: function() {
        return {
            route: {value: '', id: null},
            grade: '',
            sector: {value: '', id: null},
            crag: {value: '', id: null},
            country: '',
            date: new Date().toISOString().substring(0,10)
        };
    },
    disconnectRoute: function() {
        this.setState((prevState, props) => (Object.assign({}, prevState, {
            route: {value: prevState.route.value, id: null, selected_object: null}
        })));
    },
    disconnectSector: function() {
        this.setState((prevState, props) => (Object.assign({}, prevState, {sector: {
            value: prevState.sector.value, id: null, selected_object: null}
        })));
        this.disconnectRoute();
    },
    disconnectCrag: function() {
        this.setState((prevState, props) => (Object.assign({}, prevState, {
            crag: {value: prevState.crag.value, id: null, selected_object: null}
        })));
        this.disconnectSector();
    },
    onRouteChange: function(obj) {
        this.setState((prevState, props) => (Object.assign({}, prevState, {route: obj})));
        if (obj.selected_object !== null) {
            var sector = {value: obj.selected_object.sector_name, id: obj.selected_object.sector},
                crag = {value: obj.selected_object.crag_name, id: obj.selected_object.crag};
            this.setState((prevState, props) => (Object.assign({}, prevState, {
                grade: obj.selected_object.grade,
                sector: sector,
                crag: crag,
                country: obj.selected_object.crag_country
            })));
            this.sectorComponent.setState(sector);
            this.cragComponent.setState(crag);
        }
    },
    onGradeChange: function(e) {
        var value = e.target.value;
        this.disconnectRoute();
        this.setState((prevState, props) => (Object.assign({}, prevState, {grade: value})));
    },
    onSectorChange: function(obj) {
        this.setState((prevState, props) =>(Object.assign({}, prevState, {sector: obj})));
        this.disconnectRoute();
        if (obj.selected_object !== null) {
            var crag = {value: obj.selected_object.crag_name, id: obj.selected_object.crag};
            this.setState((prevState, props) => (Object.assign({}, prevState, {
                crag: crag,
                country: obj.selected_object.crag_country
            })));
            this.cragComponent.setState(crag);
        }
    },
    onCragChange: function(obj) {
        this.setState((prevState, props) => (Object.assign({}, prevState, {crag: obj})));
        this.disconnectSector();
        if (obj.selected_object !== null) {
            this.setState((prevState, props) => (Object.assign({}, prevState, {
                country: obj.selected_object.country
            })));
        }
    },
    onCountryChange: function(e) {
        var value = e.target.value;
        this.disconnectCrag();
        this.setState((prevState, props) => (Object.assign({}, prevState, {country: value})));
    },
    onDateChange: function(e) {
        var value = e.target.value;
        this.setState((prevState, props) => (Object.assign({}, prevState, {date: value})));
    },
    onSubmit: function(e) {
        e.preventDefault();
        this.props.onSubmit(this.state);
        this.setState((prevState, props) => (Object.assign({}, prevState, {grade: ''})));
        this.routeComponent.setState({value: '', selected_object: null});
    },
    render: function() {
        return (
            React.createElement('div', {className: 'climb-record-form'},
                React.createElement('form', {noValidate: true, className: 'climb-record-form', onSubmit: this.onSubmit},
                    React.createElement('div', {},
                        React.createElement(QueryableTextField, {
                            value: this.state.route.value,
                            id: 'route',
                            placeholder: 'Route name',
                            dataDisplay: routeDisplay,
                            query: "/api/routes/?search=",
                            onChange: this.onRouteChange,
                            ref: (component) => this.routeComponent = component
                        }),
                        React.createElement('input', {
                            type: 'text',
                            id: 'grade',
                            placeholder: 'grade',
                            value: this.state.grade,
                            onChange: this.onGradeChange
                        }),
                        React.createElement(QueryableTextField, {
                            value: this.state.sector.value,
                            id: 'sector',
                            placeholder: 'Sector name',
                            dataDisplay: sectorDisplay,
                            query: "/api/sectors/?search=",
                            onChange: this.onSectorChange,
                            ref: (component) => this.sectorComponent = component
                        })
                    ),
                    React.createElement('div', {},
                        React.createElement(QueryableTextField, {
                            value: this.state.crag.value,
                            id: 'crag',
                            placeholder: 'Crag name',
                            dataDisplay: cragDisplay,
                            query: "/api/crags/?search=",
                            onChange: this.onCragChange,
                            ref: (component) => this.cragComponent = component
                        }),
                        React.createElement('input', {
                            type: 'text',
                            id: 'country',
                            placeholder: 'Country',
                            value: this.state.country,
                            onChange: this.onCountryChange
                        }),
                        React.createElement('input', {
                            type: 'text',
                            id: 'date',
                            value: this.state.date,
                            onChange: this.onDateChange
                        })
                    ),
                    //React.createElement('div', {}, JSON.stringify(this.state)),
                    React.createElement('div', {className: 'submit'},
                        React.createElement('button', {type: 'submit'}, 'Linked!')
                    )
                )
            )
        );
    }
});
