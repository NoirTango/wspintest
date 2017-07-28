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
        return {show_form: false};
    },
    reloadData: function() {
        console.log("RELOADING");
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
    showForm: function() {
        this.setState((prevState, props) => Object.assign({}, prevState, {show_form: true}));
    },
    hideForm: function() {
        this.setState((prevState, props) => Object.assign({}, prevState, {show_form: false}));
    },
    render: function() {
        if (this.state.show_form) {
            return (
                <div>
                    <div className='hide-climb-record-form icon-left-open' onClick={this.hideForm}>
                        Hide form
                    </div>
                    <ClimbRecordForm onSubmit={this.submitForm}/>
                    <ClimbRecordTable/>
                </div>
            );
        } else {
            return (
                <div>
                    <div className='show-climb-record-form icon-right-open' onClick={this.showForm}>
                        Add route
                    </div>
                    <ClimbRecordTable/>
                </div>
            );
        }
    }
});

var buildApp = function() {
    ReactDOM.render(
        React.createElement(MainPage),
        document.getElementById('react-app')
    );
};

buildApp();

