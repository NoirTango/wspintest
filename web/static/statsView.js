import React from 'react';
import ReactDOM from 'react-dom';
import getAPIData from './getAPIData.js';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell} from 'recharts';

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

const RADIAN = Math.PI / 180;                    
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const x  = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy  + radius * Math.sin(-midAngle * RADIAN);

    return (
		<text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
			{name}
		</text>
    );
};

const CragCountryChart = React.createClass({
	getInitialState() {
        getAPIData('/api/aggregate-places/', this.setData);
		return {'crag_data': [], 'country_data': []};
	},
	setData(data) {
		this.setState((prevState, props) => Object.assign({}, prevState, {'crag_data': data.crag, 'country_data': data.country}));
	},
	render() {		
		return (
			<PieChart width={300} height={300}>
		        <Pie data={this.state.crag_data} outerRadius={60} fill="#8884d8"/>
		        <Pie data={this.state.country_data} innerRadius={70} outerRadius={80} fill="#82ca9d" label={renderCustomizedLabel} />
		        <Tooltip/>
		    </PieChart>			
		);
	}
});
ReactDOM.render(
	<div>
		<div className="history-chart">
			<SumHistoryChart />
		</div>
		<div className="places-chart">
			<CragCountryChart />
		</div>
	</div>
	,
    document.getElementById('react-app')
);

