//jshint esnext: true
import ReactDOM  from 'react-dom';
import React from 'react';
import postAPIData from './postAPIData.js';
import StylesTable from './tables/StylesTable.js';
import GradesTable from './tables/GradesTable.js';

const GradesView = React.createClass({
    importStaticGrades(name){
        return (() => postAPIData({type: name}, '/api/scores/import_static/', this.reloadData));
    },
    reloadData() {
        location.reload();
    },
    render() {
        var scales = [
            ['french', 'Import French scale'],
            ['polish', 'Import Polish scale'],
            ['uiaa', 'Import UIAA scale']
        ];
        return (
            <div>
                {
                    scales.map((g) => (
                        <div key={g[0] + 'button'} className='button' onClick={this.importStaticGrades(g[0])}>
                            {g[1]}
                        </div>
                    ))
                }
            </div>
        );
    }
});


ReactDOM.render(
    <div>
        <GradesView />
        <StylesTable />
        <GradesTable />
    </div>
    ,
    document.getElementById('react-app')
);
