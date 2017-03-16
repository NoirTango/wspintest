import React from 'react';

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
    onEdit() {
        if (typeof this.props.onEdit == 'function') {
            this.props.onEdit(this.props);
        }
    },
    onDelete() {
        if (typeof this.props.onDelete == 'function') {
            this.props.onDelete(this.props);
        }
    },
    render() {
        return( 
            <tr className={this.props.className} key={this.props.id + 'R'}>
                <td>
                    {this.props.name}
                    {this.props.children}
                </td>
                <td>{this.props.grade}</td>
                <td>{this.props.style}</td>
                <td>{this.props.sector}</td>
                <td>{this.props.crag}</td>
                <td>{this.props.country}</td>
                <td>{this.props.date}</td>
                <td className="icon-no climb-record-delete" onClick={this.onDelete}></td>
            </tr>
        );
    }
});
