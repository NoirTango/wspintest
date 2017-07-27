// jshint esnext:true
import React from 'react';
import {nonEditableColumn, deleteColumn, searchableConnectedTable, editableColumn} from './generic.js';

export default React.createClass(
	Object.assign(
 		searchableConnectedTable({uri: '/api/climb-records/', className: 'editable-table', filter: function(v){console.log(v); return true;}}),
		{
		    getColumns() {
		        return [
		            editableColumn({property: 'route_name', label: 'Route', onchange: this.putData}),
		            editableColumn({property: 'route_grade', label: 'Grade', onchange: this.putData}),
		            editableColumn({property: 'style', label: 'Style', onchange: this.putData}),
		            editableColumn({property: 'sector_name', label: 'Sector', onchange: this.putData}),
		            editableColumn({property: 'crag_name', label: 'Crag', onchange: this.putData}),
		            editableColumn({property: 'crag_country', label: 'Country', onchange: this.putData}),
		            editableColumn({property: 'date', label: 'Date', onchange: this.putData,
		            	validation: v => (v.match(/^\s*[0-9]{4}-[0-9]{2}-[0-9]{2}\s*$/) !== null)}),
		            deleteColumn({ondelete: this.deleteWithConfirmation, onshowempty: null, oncreate: null})
		        ];
		    },
		    deleteWithConfirmation(v) {
		    	console.log('YEP!');
		    	this.deleteData(v);
		    }
		}
	)
);
