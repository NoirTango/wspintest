import * as Table from 'reactabular-table';
import React from 'react';
import getAPIData from '../getAPIData.js';
import postAPIData from '../postAPIData.js';
import {editableColumn, deleteColumn} from './generic.js';

const GradesTable = React.createClass({
    getInitialState() {
        this.reloadData();
        return {styles: []}
    },
    setData(data) {
        this.setState((prevState, props) => Object.assign({}, prevState, {styles: data}));
    },
    reloadData() {
        getAPIData('/api/scores/', this.setData);
    },
    putData(value, row_data) {
        postAPIData(
            Object.assign({}, row_data, value), 
            '/api/scores/'+row_data.id+'/', 
            this.reloadData, 
            console.log, 
            [], 
            'PUT'
        );
    },
    deleteData(id) {
        postAPIData(
            '',
            '/api/scores/'+id+'/',
            this.reloadData,
            console.log,
            [],
            'DELETE'
        );
    },
    createData(v) {
        postAPIData(
            {grade: 'New grade', score: 1.0},
            '/api/scores/',
            this.reloadData,
            console.log
        );
    },
    getColumns() {
        return [
            editableColumn('grade', 'Climb grade', ()=>(true), this.putData),
            editableColumn('score', 'Score', (v) => (v.match(/^\s*[0-9]+\.?[0-9]*\s*$/) !== null), this.putData),
            deleteColumn('id', this.deleteData, this.createData)
        ];
    },
    render() {
        return (
            <Table.Provider
                className="pure-table pure-table-striped"
                columns={this.getColumns()}>
                <Table.Header />
                <Table.Body rows={this.state.styles} rowKey="id" />
            </Table.Provider>    
        );
    }
});

module.exports = GradesTable;
