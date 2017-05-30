// jshint esnext:true
import React from 'react';
import {editableColumn, deleteColumn, apiConnectedTable} from './generic.js';

export default React.createClass(
	Object.assign(
		apiConnectedTable({uri: '/api/styles/', className: 'editable-table fixed-width'}),
		{
			getColumns() {
				return [
					editableColumn({property: 'style', label: 'Climb style', new_value: 'Style?', onchange: this.putData}),
					editableColumn({property: 'multiplier', label: 'Score multiplier', 
							       validation: (v) => (v.match(/^\s*[0-9]+\.?[0-9]*\s*$/) !== null), 
								   new_value: '1.0', onchange: this.putData}),
					deleteColumn({ondelete: this.deleteData, onshowempty: this.toggleEmptyRow, oncreate: this.createData})
				];
			}
		}
	)
);
