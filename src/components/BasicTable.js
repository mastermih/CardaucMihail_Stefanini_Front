import React, { useMemo } from 'react';
import { useTable } from 'react-table';
import '../assets/styles/table.css';
import { COLUMNS, COLUMNS2 } from './columns';

const BasicTable = ({ data, columnsType, handleButtonClick }) => {
  const columns = useMemo(() => {
    if (columnsType === 'COLUMNS') {
      return COLUMNS(handleButtonClick); // Pass handleButtonClick only for COLUMNS
    } else if (columnsType === 'COLUMNS2') {
      return COLUMNS2; // No action button for COLUMNS2
    }
    return [];
  }, [columnsType, handleButtonClick]);

  const tableInstance = useTable({
    columns,
    data,
  });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <table {...getTableProps()} className="table table-striped">
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()} key={column.id}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={row.id}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()} key={cell.column.id}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default BasicTable;
