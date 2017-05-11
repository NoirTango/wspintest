// jshint esnext:true
import React from 'react';
import {editableColumn, deleteColumn, apiConnectedTable} from './generic.js';

export default React.createClass(
	Object.assign(
		{}, 
		apiConnectedTable('/api/scores/', {grade: 'New grade', score: 1.0}),
		{
		    getColumns() {
		        return [
		            editableColumn('grade', 'Climb grade', ()=>(true), 'Grade?', this.putData),
		            editableColumn('score', 'Score', (v) => (v.match(/^\s*[0-9]+\.?[0-9]*\s*$/) !== null),
		                           '0.0', this.putData),
		            deleteColumn('id', this.deleteData, this.toggleEmptyRow, this.createData)
		        ];
		    }
		}
	)
);
