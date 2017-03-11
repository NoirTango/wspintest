import React from 'react';
import ReactDOM from 'react-dom';
import getAPIData from './getAPIData.js';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

const colormap = ['#8884d8', '#4444d8', '#d88884', '#8844d8', '#4484d8'];

const SumHistoryChart = React.createClass({
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
    			<Bar key={style} dataKey={style} stackId="a" fill={colormap[i]} />
    		);
    	});
    
	  	return (
  			<ResponsiveContainer width='70%' aspect={4.0/3.0}>	
  				<BarChart data={this.state.history_totals}
  						margin={{top: 20, right: 30, left: 20, bottom: 5}}>
  					<XAxis dataKey="year"/>
  					<YAxis/>
  					<CartesianGrid strokeDasharray="3 3"/>
  					<Tooltip/>
  					<Legend />
  					{bars}
  				</BarChart>
  			</ResponsiveContainer>
	    );
	}
});


ReactDOM.render(
	<SumHistoryChart />,
    document.getElementById('react-app')
);

