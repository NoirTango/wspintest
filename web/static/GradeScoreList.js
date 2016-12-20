// jshint esnext: true
var React = require('react'),
    ReactDOM = require('react-dom'),
    console = require('console');

var GradeScore = React.createClass({
    propTypes: {
        grade: React.PropTypes.string.isRequired,
        score: React.PropTypes.number.isRequired
    },

    render: function() {
        return (
            React.createElement('tr', {className: this.props.className, key: this.props.grade+'ROW'},
                React.createElement('td', {key: this.props.grade+'GRADE'}, this.props.grade),
                React.createElement('td', {key: this.props.grade+'SCORE'}, this.props.score)
            )
        );
    }
});

module.exports = React.createClass({
    props: {
        grades: React.PropTypes.array.isRequired
    },
    render: function() {
        return (
            React.createElement('div', {},
                React.createElement('table', {className: 'climb-list'},
                    React.createElement('tbody', {},
                        React.createElement('tr', {key: 'header_row'},
                            React.createElement('th', {key: 'header_grade'}, 'Grade'),
                            React.createElement('th', {key: 'header_score'}, 'Score')
                        ),
                        this.props.grades.map(function(cr, i) {
                            if (i%2) {
                                cr.className = 'odd';
                            } else {
                                cr.className = 'even';
                            }
                            cr.key = cr.grade+'CONTAINER';
                            return React.createElement(GradeScore, cr);
                        })
                    )
                )
            )
        );
    }
});
