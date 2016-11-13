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
            choice_list: [],
            selected_object: null
        };
    },
    findOption: function(text) {
        var display_func = this.props.dataDisplay;
        return this.state.choice_list.find(function(opt) {return display_func(opt)==text;});
    },
    onTextChange: function(e) {
        var selected_object = this.findOption(e.target.value);
        var new_state;
        if (selected_object) {
            new_state = Object.assign({}, this.state, {
                choice_list: [],
                selected_object: selected_object,
                value: selected_object.name
            });
        } else {
            var query = this.props.query;
            var component = this;
            var client = new XMLHttpRequest();
            client.onload = function() {
                if(this.status == 200) {
                    component.setState(Object.assign({}, component.state, {choice_list: JSON.parse(this.response)}));
                }
            };
            client.open("GET", query + e.target.value);
            client.setRequestHeader("Accept", "application/json");
            client.send();
            new_state = Object.assign({}, this.state, {selected_object: null, value: e.target.value});
        }
        this.setState(new_state);
        if (typeof this.props.onChange === 'function') {
            this.props.onChange({value: new_state.value, selected_object: new_state.selected_object});
        }
    },
    render: function() {
        var datalist_name = this.props.name + '_datalist';
        var display_func = this.props.dataDisplay;
        var option_list = this.state.choice_list.map(function(c) {
            return React.createElement('option', {
                key: c.id,
                value: display_func(c)
            }, display_func(c));
        });
        return (
            React.createElement('span', {},
                React.createElement('input', {
                    name: this.props.name,
                    type: 'text',
                    list: datalist_name,
                    value: this.state.value,
                    onChange: this.onTextChange
                }),
                React.createElement('datalist', {
                    id: datalist_name
                }, option_list)
            )
        );
    }
});
