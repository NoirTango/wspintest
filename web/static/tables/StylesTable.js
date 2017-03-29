import React from 'react';
import {editableColumn, deleteColumn, apiConnectedTable} from './generic.js';

module.exports = React.createClass(
	Object.assign(
		{}, 
		apiConnectedTable('/api/styles/', {style: 'New style', multiplier: 1.0}),
		{
			getColumns() {
				return [
					editableColumn('style', 'Climb style', ()=>(true), this.putData),
					editableColumn('multiplier', 'Score multiplier', (v) => (v.match(/^\s*[0-9]+\.?[0-9]*\s*$/) !== null), this.putData),
					deleteColumn('id', this.deleteData, this.createData)
				];
			}
		}
	)
);
