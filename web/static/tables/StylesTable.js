import * as Table from 'reactabular-table';
import React from 'react';
import getAPIData from '../getAPIData.js';
import postAPIData from '../postAPIData.js';
import {editableColumn, deleteColumn} from './generic.js';

module.exports = React.createClass({
    getInitialState() {
        this.reloadData();
        return {styles: []}
    },
    setData(data) {
        this.setState((prevState, props) => Object.assign({}, prevState, {styles: data}));
    },
    reloadData() {
        getAPIData('/api/styles/', this.setData);
    },
    putData(value, row_data) {
        postAPIData(
            Object.assign({}, row_data, value), 
            '/api/styles/'+row_data.id+'/', 
            this.reloadData, 
            console.log, 
            [], 
            'PUT'
        );
    },
    deleteData(id) {
        postAPIData(
            '',
            '/api/styles/'+id+'/',
            this.reloadData,
            console.log,
            [],
            'DELETE'
        );
    },
    createData(v) {
        postAPIData(
            {style: 'New style', multiplier: 1.0},
            '/api/styles/',
            this.reloadData,
            console.log
        );
    },
    getColumns() {
        return [
            editableColumn('style', 'Climb style', ()=>(true), this.putData),
            editableColumn('multiplier', 'Score multiplier', (v) => (v.match(/^\s*[0-9]+\.?[0-9]*\s*$/) !== null), this.putData),
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
