var React = require('react'),
    console = require('console');
    
module.exports = React.createClass({
    propTypes: {
        onOk: React.PropTypes.func,
        onCancel: React.PropTypes.func,
        //text: React.PropTypes.string.required,
        className: React.PropTypes.string
    },
    render: function() {
        return React.createElement('div', {className: this.props.className},
            this.props.children,
            React.createElement('span', {className: 'ok icon-yes', onClick: this.props.onOk}, 'OK'),
            React.createElement('span', {className: 'cancel icon-no', onClick: this.props.onCancel}, 'Cancel')
        );         
    }
});