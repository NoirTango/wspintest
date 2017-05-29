// jshint esnext:true
import React from 'react';
import {editableColumn, deleteColumn, apiConnectedTable} from './generic.js';

export default React.createClass(
	Object.assign(
		{}, 
		apiConnectedTable('/api/styles/'),
		{
			getColumns() {
				return [
					editableColumn('style', 'Climb style', ()=>(true), 'Style?', this.putData),
					editableColumn('multiplier', 'Score multiplier', 
							       (v) => (v.match(/^\s*[0-9]+\.?[0-9]*\s*$/) !== null), 
								   '1.0', this.putData),
					deleteColumn('id', this.deleteData, this.toggleEmptyRow, this.createData)
				];
			}
		}
	)
);
