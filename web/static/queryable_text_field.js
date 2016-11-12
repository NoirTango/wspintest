var React;

var QueryableTextField = React.createClass({
    propTypes: {
        value: React.PropTypes.string.isRequired,
        query: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        dataDisplay: React.PropTypes.func.isRequired,
        onChange: React.PropTypes.func
    },
    getInitialState: function() {
        return {
            value: this.props.value,
            choice_list: []
        };
    },
    onTextChange: function(e) {
        this.setState(Object.assign({}, this.state, {value: e.target.value}));

        var query = this.props.query;
        var component = this;
        var client = new XMLHttpRequest();
        client.onload = function() {
            if(this.status == 200) {
                console.log(component);
                component.setState(Object.assign({}, component.state, {choice_list: JSON.parse(this.response)}));
            }
        };
        client.open("GET", query + e.target.value);
        client.setRequestHeader("Accept", "application/json");
        client.send();
    },
    render: function() {
        var datalist_name = this.props.name + '_datalist';
        var display_func = this.props.dataDisplay;
        var option_list = this.state.choice_list.map(function(c) {
            return React.createElement('option', {key: c.id, value: c.name}, display_func(c));
        });
        var select_element = React.createElement('datalist', {id: datalist_name}, option_list);
        return (
            React.createElement('div', {},
                React.createElement('input', {
                    type: 'text',
                    list: datalist_name,
                    value: this.state.value,
                    onChange: this.onTextChange
                }),
                select_element
            )
        );
    }
});
