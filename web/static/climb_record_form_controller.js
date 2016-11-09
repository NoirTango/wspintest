var React, ReactDOM, console;

var QueryableTextField = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        query: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func
    },
    onTextChange: function(e) {
        this.props.data.text = e.target.value;
        this.props.onChange(this.props.data.text);

        var query = this.props.query;
        var data = this.props.data;
        var client = new XMLHttpRequest();
        client.onload = function() {
            if(this.status == 200) {
                data.list = JSON.parse(this.response);
                refreshApp();
            }
        };
        client.open("GET", query + data.text);
        client.setRequestHeader("Accept", "application/json");
        client.send();
    },
    render: function() {
        return (
            React.createElement('div', {},
                React.createElement('input', {
                    type: 'text',
                    value: this.props.data.text,
                    onChange: this.onTextChange
                }),
                React.createElement('div', {}, this.props.data.list.map(function(c) {
                    return React.createElement('div', {key: c.id}, c.name);
                }))
            )
        );
    }
});

var RecordForm = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired,
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
                    data: this.props.data.route,
                    query: "/api/routes/?search=",
                    onChange: this.onRouteChange
                }),
                React.createElement(QueryableTextField, {
                    data: this.props.data.sector,
                    query: "/api/sectors/?search=",
                    onChange: this.onSectorChange
                }),
                React.createElement(QueryableTextField, {
                    data: this.props.data.crag,
                    query: "/api/crags/?search=",
                    onChange: this.onCragChange
                }),
                React.createElement('button', {type: 'submit'}, 'Linked!')
            )
        );
    }
});
