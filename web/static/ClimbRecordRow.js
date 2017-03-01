var React = require('react');

module.exports = React.createClass({
    propTypes: {
        id: React.PropTypes.number.isRequired,
        date: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        grade: React.PropTypes.string.isRequired,
        style: React.PropTypes.string.isRequired,
        sector: React.PropTypes.string.isRequired,
        crag: React.PropTypes.string.isRequired,
        country: React.PropTypes.string.isRequired,
        onEdit: React.PropTypes.func,
        onDelete: React.PropTypes.func
    },
    onEdit: function() {
        if (typeof this.props.onEdit == 'function') {
            this.props.onEdit(this.props);
        }
    },
    onDelete: function() {
        if (typeof this.props.onDelete == 'function') {
            this.props.onDelete(this.props);
        }
    },
    render: function() {
        return (
            React.createElement('tr', {className: this.props.className, key:this.props.id + 'R'},
                React.createElement('td', {key: this.props.id + 'N'}, this.props.name,
                    this.props.children
                ),
                React.createElement('td', {key: this.props.id + 'G'}, this.props.grade),
                React.createElement('td', {key: this.props.id + 'St'}, this.props.style),
                React.createElement('td', {key: this.props.id + 'S'}, this.props.sector),
                React.createElement('td', {key: this.props.id + 'Cr'}, this.props.crag),
                React.createElement('td', {key: this.props.id + 'Ct'}, this.props.country),
                React.createElement('td', {key: this.props.id + 'D'}, this.props.date),
                //React.createElement('td', {className: 'icon-pencil', onClick: this.onEdit}),
                React.createElement('td', {className: 'icon-no climb-record-delete', onClick: this.onDelete})
            )
        );
    }
});
