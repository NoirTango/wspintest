import React from 'react';
import ReactDOM from 'react-dom';
import SumHistoryChart from './SumHistoryChart.js';
import CragCountryChart from './CragCountryChart.js';

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

