import React from 'react';
import getAPIData from './getAPIData.js';
import {stylebarcolors} from './ChartColormap.js';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

module.exports = React.createClass({
    getInitialState() {
        this.reloadData();
        return {history_totals: [], all_styles: [], show_form: false};
    },
    setData(data) {
        this.setState((prevState, props) => Object.assign({}, prevState, {history_totals: data}));
    },
    setStyles(data) {
    	data.push({'style': 'other'});
    	this.setState((prevState, props) => Object.assign({}, prevState, {all_styles: data.map((s) => s.style)}));
    },
    reloadData() {
        getAPIData('/api/sum-history/', this.setData);
        getAPIData('/api/styles/', this.setStyles);
    },
	render () {
    	var bars = [];
    	this.state.all_styles.forEach(function(style, i){
    		bars.push(
    			<Bar key={style} dataKey={style} stackId="a" fill={stylebarcolors[i]} />
    		);
    	});
    
	  	return (
			<BarChart data={this.state.history_totals}
					width={600} height={300}
					margin={{top: 20, right: 30, left: 20, bottom: 5}}>
				<XAxis dataKey="year"/>
				<YAxis/>
				<CartesianGrid strokeDasharray="3 3"/>
				<Tooltip/>
				<Legend />
				{bars}
			</BarChart>
	    );
	}
});
