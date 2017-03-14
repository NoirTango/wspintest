import React from 'react';
import getAPIData from './getAPIData.js';
import {piechartcolors} from './ChartColormap.js';
import {Tooltip, PieChart, Pie, Cell} from 'recharts';

const RADIAN = Math.PI / 180;                    
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
	const x  = cx + outerRadius * Math.cos(-midAngle * RADIAN);
	const y = cy  + outerRadius * Math.sin(-midAngle * RADIAN);

    return (
		<text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
			{name}
		</text>
    );
};

module.exports = React.createClass({
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
		        <Pie data={this.state.crag_data} outerRadius={60}>
		        {
		        	this.state.crag_data.map((entry, index) => <Cell key={'crag'+index} fill={piechartcolors[index % piechartcolors.length]}/>)
		        }
		        </Pie>
		        <Pie data={this.state.country_data} innerRadius={70} outerRadius={80} label={renderCustomizedLabel} labelLine={false}>
		        {
		        	this.state.country_data.map((entry, index) => <Cell key={'country'+index} fill={piechartcolors[index % piechartcolors.length]}/>)
		        }
		        </Pie>
		        <Tooltip/>
		    </PieChart>			
		);
	}
});
