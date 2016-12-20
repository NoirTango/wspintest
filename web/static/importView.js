//jshint esnext: true
var React = require('react'),
    ReactDOM = require('react-dom'),
    postAPIData = require('./postAPIData.js'),
    console = require('console');


var ImportView = React.createClass({
    props: {},
    submitImport: function() {
        var r = new FileReader(), file = this.refs.filebutton.files[0];
        r.onload = function(e) {
            postAPIData(e.target.result, '/api/csv-import/',
                function(){console.log('OK');},
                function(){console.log('ERR');},
                [['Content-Type', 'text/csv'], ['Content-Disposition', 'attachment; filename="'+file.name+'"']]
            );
        };
        r.readAsText(file);
    },
    render: function() {
        return React.createElement('div', {className: 'import-export'},
            React.createElement('span', {
                className: 'button',
                onClick: function() {location.replace('/api/csv-export/');}
            }, 'Export'),
            React.createElement('span', {
                className: 'button',
                onClick: (() => this.refs.filebutton.click())
            },
            React.createElement('input', {
                type: 'file',
                ref: 'filebutton',
                style: {display: 'none'},
                onChange: this.submitImport
            }),
            'Import'
        ));
    }
});

ReactDOM.render(
    React.createElement(ImportView),
    document.getElementById('react_list')
);
