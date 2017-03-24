import React from 'react';
import ReactDOM from 'react-dom';
import {RIEInput, RIENumber} from 'riek';

const GradeScore = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },
    render() {
        return (
            <tr className={this.props.className}>
                <td>
                    <RIEInput
                        value={this.props.data.grade}
                        change={(v) => (this.props.callback(v, this.props.data))}
                        propName="grade"
                    />
                </td>
                <td>
                    <RIEInput
                        value={this.props.data.score}
                        change={(v) => (this.props.callback(
                            Object.assign({}, v, {score: parseFloat(v.score)}), 
                            this.props.data
                        ))}
                        validate={(v) => (v.match(/^\w*[0-9]+\.?[0-9]*\w*$/) !== null)}
                        propName="score"
                    />
                </td>
                <td className="icon-no climb-record-delete" onClick={this.onDelete}>
                </td>
            </tr>
        );
    }
});

module.exports = React.createClass({
    props: {
        grades: React.PropTypes.array.isRequired
    },
    render() {
        return (
            <div>
                <table className='climb-list'>
                    <tbody>
                        <tr key='header_row'>
                            <th key='header_grade'>Grade</th>
                            <th key='header_score'>Score</th>
                        </tr>
                        {this.props.grades.map((cr, i) => ( 
                                <GradeScore className={(i%2)?('even'):('odd')} key={cr.id} data={cr} callback={this.props.rowEditCallback}/>
                            ))}
                    </tbody>
                </table>
            </div>
        );
    }
});
