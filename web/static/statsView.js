import React from 'react';
import ReactDOM from 'react-dom';
import getAPIData from './getAPIData.js';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

const data = [
      {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
      {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
      {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
      {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
      {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
      {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
      {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

const SumHistoryChart = React.createClass({
    getInitialState() {
        this.reloadData();
        return {history_totals: [], show_form: false};
    },
    setData(data) {
        this.setState((prevState, props) => Object.assign({}, prevState, {history_totals: data}));
    },
    reloadData() {
        getAPIData('/api/sum-history/', this.setData);
    },
	render () {
	  	return (
  			<ResponsiveContainer width='70%' aspect={4.0/3.0}>	
  				<BarChart data={this.state.history_totals}
  						margin={{top: 20, right: 30, left: 20, bottom: 5}}>
  					<XAxis dataKey="year"/>
  					<YAxis/>
  					<CartesianGrid strokeDasharray="3 3"/>
  					<Tooltip/>
  					<Legend />
  					<Bar dataKey="other" stackId="a" fill="#8884d8" />
  				</BarChart>
  			</ResponsiveContainer>
	    );
	}
});


ReactDOM.render(
	<SumHistoryChart />,
    document.getElementById('react-app')
);

