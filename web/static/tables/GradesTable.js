// jshint esnext:true
import React from 'react';
import {editableColumn, deleteColumn, apiConnectedTable} from './generic.js';

export default React.createClass(
	Object.assign(
 		apiConnectedTable({uri: '/api/scores/', className: 'editable-table fixed-width'}),
		{
		    getColumns() {
		        return [
		            editableColumn({property: 'grade', label: 'Climb grade', new_value: 'Grade?', onchange: this.putData}),
		            editableColumn({property: 'score', label: 'Score', validation: (v) => (v.match(/^\s*[0-9]+\.?[0-9]*\s*$/) !== null),
		                           new_value: '0.0', onchange: this.putData}),
		            deleteColumn({ondelete: this.deleteData, onshowempty: this.toggleEmptyRow, oncreate: this.createData})
		        ];
		    }
		}
	)
);
