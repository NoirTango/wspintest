// jshint esnext: true
import React  from 'react';
import ReactDOM from 'react-dom';
import ClimbRecordForm from './ClimbRecordForm.js';
import getAPIData from './getAPIData.js';
import postAPIData from './postAPIData.js';
import deleteAPI from './deleteAPI.js';
import ClimbRecordTable from './tables/ClimbRecordTable.js';

var MainPage = React.createClass({
    getInitialState: function() {
        this.reloadData();
        return {climbs: [], show_form: false};
    },
    setData: function(data) {
        this.setState((prevState, props) => Object.assign({}, prevState, {climbs: data}));
    },
    reloadData: function() {
        getAPIData('/api/climb-records/', this.setData);
    },
    submitForm: function(data) {
        var flatData = {
            route: data.route.id,
            sector: data.sector.id,
            crag: data.crag.id,
            route_name: data.route.value,
            route_grade: data.grade,
            style: data.style,
            sector_name: data.sector.value,
            crag_name: data.crag.value,
            crag_country: data.country,
            date: data.date
        };
        postAPIData(flatData, '/api/climb-records/ajax/', this.reloadData);
    },
    deleteRecord: function(id) {
        console.log('Deleting ' + id);
        deleteAPI('/api/climb-records/'+id, this.reloadData);  
    },
    editRecord: function(id) {
        console.log('Editing ' + id);
        // ??  
    },
    showForm: function() {
        this.setState((prevState, props) => Object.assign({}, prevState, {show_form: true}));
    },
    hideForm: function() {
        this.setState((prevState, props) => Object.assign({}, prevState, {show_form: false}));
    },
    render: function() {
        var show_form_button, form_placeholder;
        if (this.state.show_form) {
            show_form_button = React.createElement('div', {className: 'hide-climb-record-form icon-left-open', onClick: this.hideForm}, 'Hide form');
            form_placeholder = React.createElement(ClimbRecordForm, {
                onSubmit: this.submitForm
            });
        } else {
            show_form_button = React.createElement('div', {className: 'show-climb-record-form icon-right-open', onClick: this.showForm}, 'Add route');
            form_placeholder = '';
        }
        return React.createElement('div', {},
            show_form_button,
            form_placeholder,
            React.createElement(ClimbRecordTable)
        );
    }
});

var buildApp = function() {
    ReactDOM.render(
        React.createElement(MainPage),
        document.getElementById('react-app')
    );
};

buildApp();

