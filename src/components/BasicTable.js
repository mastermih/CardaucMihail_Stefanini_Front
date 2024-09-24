import React, { useMemo } from 'react';
import { useTable } from 'react-table';
import { COLUMNS, COLUMNS_WITHOUT_OPERATOR_NAME} from './columns'; // Two different sets of columns

const BasicTable = ({ data, handleOperatorSelection, getOperatorName, role}) => {
  const safeData = useMemo(() => data || [], [data]);

  const columns = useMemo(() => {
    if (role === 'ADMIN') {
      return COLUMNS(handleOperatorSelection, getOperatorName); // Admins can see the Operator Name
    } else {
      return COLUMNS_WITHOUT_OPERATOR_NAME(); // Users do not see the Operator Name
    }
  }, [handleOperatorSelection, getOperatorName, role]);

  const tableInstance = useTable({
    columns,
    data: safeData, // Pass the safeData which is guaranteed to be an array
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
