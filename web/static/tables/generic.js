import React from 'react';
import {RIEInput} from 'riek';
import * as Table from 'reactabular-table';
import getAPIData from '../getAPIData.js';
import postAPIData from '../postAPIData.js';

const editableColumn = function(property_name, label, validation, onchange) {
    return {
        property: property_name,
        header: {
            label: label
        },
        cell: {
            formatters: [
                (value, cell_info) => (
                    <RIEInput
                        value={value}
                        propName={property_name}
                        change={(v) => onchange(v, cell_info.rowData)}
                        validate={validation}
                    />
                )
            ]
        }
    };
};

const deleteColumn = function(property_name, ondelete, oncreate) {
    return {
        property: property_name,
        header: {
            transforms: [
                () => ({
                    className: "icon-plus-squared table-row-new",
                    onClick: oncreate,
                    children: " "
                })
            ]
        },
        cell: {
            transforms: [
                (v) => ({
                    className: "icon-no table-row-delete",
                    onClick: () => ondelete(v),
                    children: " "
                })
            ]
        }
    };
};

const apiConnectedTable = function(uri, new_data_template) {
	return {
	    getInitialState() {
	        this.reloadData();
	        return {data: []}
	    },
	    setData(data) {
	        this.setState((prevState, props) => Object.assign({}, prevState, {data: data}));
	    },
	    reloadData() {
	        getAPIData(uri, this.setData);
	    },
	    putData(value, row_data) {
	        postAPIData(
	            Object.assign({}, row_data, value), 
	            uri+row_data.id+'/', 
	            this.reloadData, 
	            console.log, 
	            [], 
	            'PUT'
	        );
	    },
	    deleteData(id) {
	        postAPIData(
	            '',
	            uri+id+'/',
	            this.reloadData,
	            console.log,
	            [],
	            'DELETE'
	        );
	    },
	    createData(v) {
	        postAPIData(
	            new_data_template,
	            uri,
	            this.reloadData,
	            console.log
	        );
	    },
	    render() {
	        return (
	            <Table.Provider
	                className="pure-table pure-table-striped"
	                columns={this.getColumns()}>
	                <Table.Header />
	                <Table.Body rows={this.state.data} rowKey="id" />
	            </Table.Provider>    
	        );
	    }
	}
};

module.exports = {
	editableColumn: editableColumn,
	deleteColumn: deleteColumn,
	apiConnectedTable: apiConnectedTable
};
