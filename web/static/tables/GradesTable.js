import React from 'react';
import {editableColumn, deleteColumn, apiConnectedTable} from './generic.js';

const GradesTable = React.createClass(
	Object.assign(
		{}, 
		apiConnectedTable('/api/scores/', {grade: 'New grade', score: 1.0}),
		{
		    getColumns() {
		        return [
		            editableColumn('grade', 'Climb grade', ()=>(true), this.putData),
		            editableColumn('score', 'Score', (v) => (v.match(/^\s*[0-9]+\.?[0-9]*\s*$/) !== null), this.putData),
		            deleteColumn('id', this.deleteData, this.createData)
		        ];
		    }
		}
	)
);

module.exports = GradesTable;
