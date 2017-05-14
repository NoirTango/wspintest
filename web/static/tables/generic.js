// jshint esnext:true
import React from 'react';
import {RIEInput} from 'riek';
import * as Table from 'reactabular-table';
import getAPIData from '../getAPIData.js';
import postAPIData from '../postAPIData.js';

export const editableColumn = function(property_name, label, validation, dummy_value, onchange) {
    return {
        property: property_name,
        empty_value: dummy_value,
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

export const deleteColumn = function(property_name, ondelete, onshowempty, oncreate) {
    return {
        property: property_name,
        empty_value: null,
        header: {
            transforms: [
                () => ({
                    className: "icon-plus-squared table-row-new",
                    onClick: onshowempty,
                    children: " "
                })
            ]
        },
        cell: {
            transforms: [
                (v, cell_info) => ((v === null) ? { 
                    className: "icon-plus-squared table-row-new",
                    onClick: () => oncreate(v, cell_info),
                    children: " "
                } : {
                    className: "icon-no table-row-delete",
                    onClick: () => ondelete(v),
                    children: " "
                })
            ]
        }
    };
};

export const apiConnectedTable = function(uri, new_data_template) {
	return {
	    getInitialState() {
	        this.reloadData();
	        return {
	            data: [],
	            show_empty: false
	        };
	    },
	    setData(data) {
	        this.setState((prevState, props) => Object.assign({}, prevState, {data: data}));
	    },
	    showEmptyRow() {
	        this.setState((prevState, props) => Object.assign({}, prevState, {show_empty: true}));
	    },
        hideEmptyRow() {
            this.setState((prevState, props) => Object.assign({}, prevState, {show_empty: false}));
        },
        toggleEmptyRow() {
            this.setState((prevState, props) => Object.assign({}, prevState, {show_empty: !prevState.show_empty}));
        },
	    reloadData() {
	        getAPIData(uri, this.setData);
	    },
	    putData(value, row_data) {
	        if (row_data.id === null) {
	        	Object.assign(row_data, row_data, value);
	            return;
	        }
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
	        if (id === null) {
	            this.hideEmptyRow();
	            return;
	        }
	        
	        postAPIData(
	            '',
	            uri+id+'/',
	            this.reloadData,
	            console.log,
	            [],
	            'DELETE'
	        );
	    },
	    createData(v, y) {
            console.log('Sending', v, y);
	        postAPIData(
	            this.state.edit_row,
	            uri,
	            this.reloadData,
	            console.log
	        );
            this.hideEmptyRow();
	    },
	    render() {
            var empty_row = {}, table_rows;
	        this.getColumns().map(function(v) {
	            empty_row[v.property] = v.empty_value;
	        });
	        if (this.state.show_empty) {
	            table_rows = [empty_row].concat(this.state.data);
	        } else {
	            table_rows = this.state.data;
	        }
	        return (
	            <Table.Provider
	                className="pure-table pure-table-striped"
	                columns={this.getColumns()}>
	                <Table.Header />
	                <Table.Body rows={table_rows} rowKey="id" />
	            </Table.Provider>    
	        );
	    }
	}
};
