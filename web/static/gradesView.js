import * as Table from 'reactabular-table';
import ReactDOM  from 'react-dom';
import React from 'react';
import GradeScoreList from './GradeScoreList.js';
import getAPIData from './getAPIData.js';
import postAPIData from './postAPIData.js';

const GradesView = React.createClass({
    getInitialState() {
        this.reloadData();
        return {grades: []};
    },
    setData(data) {
        this.setState((prevState, props) => Object.assign({}, prevState, {grades: data}));
    },
    reloadData() {
        getAPIData('/api/scores/', this.setData);
    },
    importStaticGrades(name){
        return (() => postAPIData({type: name}, '/api/scores/import_static/', this.reloadData));
    },
    rowEditCallback(new_value, old_row) {
        var updated_data = Object.assign({}, old_row, new_value), component = this;
        console.log(new_value, old_row);
        postAPIData(updated_data, '/api/scores/' + old_row.id + '/', 
                    component.reloadData,
                    console.log,
                    [],
                    'PUT');
    },
    render() {
        var scales = [
            ['french', 'Import French scale'],
            ['polish', 'Import Polish scale'],
            ['uiaa', 'Import UIAA scale']
        ];
        return (
            <div>
                {
                    scales.map((g) => (
                        <div key={g[0] + 'button'} className='button' onClick={this.importStaticGrades(g[0])}>
                            {g[1]}
                        </div>
                    ))
                }
                <GradeScoreList className='climb-history' grades={this.state.grades} rowEditCallback={this.rowEditCallback} />
            </div>
        );
    }
});

const columns = [
              {
                property: 'style',
                header: {
                  label: 'Climb style'
                }
              },
              {
                property: 'multiplier',
                header: {
                  label: 'Score multiplier'
                }
              }
            ];

const StylesTable = React.createClass({
    getInitialState() {
        this.reloadData();
        return {styles: []}
    },
    setData: function(data) {
        this.setState((prevState, props) => Object.assign({}, prevState, {styles: data}));
    },
    reloadData: function() {
        getAPIData('/api/styles/', this.setData);
    },
    render() {
        return (
            <Table.Provider
                className="pure-table pure-table-striped"
                columns={columns}>
                <Table.Header />
                <Table.Body rows={this.state.styles} rowKey="id" />
            </Table.Provider>    
        );
    }
});

ReactDOM.render(
    <div>
        <StylesTable />
        <GradesView />
    </div>
    ,
    document.getElementById('react-app')
);
