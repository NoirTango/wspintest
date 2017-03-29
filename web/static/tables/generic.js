import React from 'react';
import {RIEInput} from 'riek';

const editableColumn = function(property_name, label, validation, onchange) {
    return {
        property: property_name,
        header: {
            label: label
        },
        cell: {
            formatters: [
                (value, cell_info) => (
                    <RIEInput
                        value={value}
                        propName={property_name}
                        change={(v) => onchange(v, cell_info.rowData)}
                        validate={validation}
                    />
                )
            ]
        }
    };
};

const deleteColumn = function(property_name, ondelete, oncreate) {
    return {
        property: property_name,
        header: {
            transforms: [
                () => ({
                    className: "icon-plus-squared table-row-new",
                    onClick: oncreate,
                    children: " "
                })
            ]
        },
        cell: {
            transforms: [
                (v) => ({
                    className: "icon-no table-row-delete",
                    onClick: () => ondelete(v),
                    children: " "
                })
            ]
        }
    };
};

module.exports = {
	editableColumn: editableColumn,
	deleteColumn: deleteColumn
};
