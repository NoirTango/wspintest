// jshint esnext:true
import React from 'react';
import {RIEInput} from 'riek';
import * as Table from 'reactabular-table';
import getAPIData from '../getAPIData.js';
import postAPIData from '../postAPIData.js';

export const editableColumn = function(props) {
	var final_props = Object.assign({validation: (v) => true, new_value: 'value?'}, props);
    return {
        property: final_props.property,
        new_value: final_props.new_value,
        header: {
            label: final_props.label
        },
        cell: {
            formatters: [
                (value, cell_info) => (
                    <RIEInput
                        value={value?value:'-'}
                        propName={final_props.property}
                        change={(v) => final_props.onchange(v, cell_info.rowData)}
                        validate={final_props.validation}
                    />
                )
            ]
        }
    };
};

export const nonEditableColumn = function(props) {
    return {
        property: props.property,
        header: {
            label: props.label
        }
    };
};

export const deleteColumn = function(props) {
	var final_props = Object.assign({property: 'id'}, props);
    return {
        property: final_props.property,
        new_value: null,
        header: {
            transforms: [
                () => ((props.onshowempty === null)?{
                	className: "manipulation-column",
                	children: " "
                }:{
                    className: "icon-plus-squared manipulation-column",
                    onClick: final_props.onshowempty,
                    children: " "
                })
            ]
        },
        cell: {
            transforms: [
                (v, cell_info) => ((v === null) ? { 
                    className: "icon-ok-squared manipulation-column",
                    onClick: () => final_props.oncreate(v, cell_info),
                    children: " "
                } : {
                    className: "icon-no manipulation-column",
                    onClick: () => final_props.ondelete(v),
                    children: " "
                })
            ]
        }
    };
};

export const apiConnectedTable = function(props) {
	var final_props = Object.assign({filter: (row, filter)=>(true)}, props);
	
	return {
	    getInitialState() {
	        getAPIData(final_props.uri, this.setData);
	        return {
	            data: [],
	            show_empty: false,
	            loading: 'loading',
	            filtercontent: null
	        };
	    },
	    setData(data) {
	        this.setState((prevState, props) => Object.assign({}, prevState, {data: data}));
	        this.loadingAnimation(false);
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
        	this.loadingAnimation(true);
	        getAPIData(final_props.uri, this.setData);
	    },
	    loadingAnimation(flag) {
	    	this.setState((prevState, props) => Object.assign({}, prevState, {loading: flag?'loading':''}));
	    },
	    putData(value, row_data) {
	        if (row_data.id === null) {
	        	Object.assign(row_data, value);
	            return;
	        }
	        postAPIData(
	            Object.assign({}, row_data, value), 
	            final_props.uri+row_data.id+'/', 
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
	            final_props.uri+id+'/',
	            this.reloadData,
	            console.log,
	            [],
	            'DELETE'
	        );
	    },
	    createData(v, y) {
	        postAPIData(
	            y.rowData,
	            final_props.uri,
	            this.reloadData,
	            console.log
	        );
            this.hideEmptyRow();
	    },
	    render() {
            var empty_row = {}, table_rows;
	        this.getColumns().map(function(v) {
	            empty_row[v.property] = v.new_value;
	        });
	        if (this.state.show_empty) {
	            table_rows = [empty_row].concat(this.state.data);
	        } else {
	            table_rows = this.state.data;
	        }
	        return (
	            <Table.Provider
	                className={props.className + " " + this.state.loading}
	                columns={this.getColumns()}>
	                <Table.Header />
	                <Table.Body rows={table_rows.filter((row)=>(final_props.filter(row, this.state.filtercontent)))} rowKey="id" />
	            </Table.Provider>    
	        );
	    }
	}
};

export const searchableConnectedTable = function(props) {
	var table = apiConnectedTable(props);
	table.original_render = table.render;
	table.render = function () {
		return (
			<div>
			    <div>Filter: <input type="text" onChange={this.filterchange}></input></div>
			    {this.original_render()}
			</div>
		);
	}
	table.filterchange = function(v) {
	    var new_content = v.target.value;
	    this.setState((prevState, props) => Object.assign({}, prevState, {filtercontent: new_content}));
	};
	return table;
}
