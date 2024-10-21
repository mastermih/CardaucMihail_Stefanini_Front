import React, { useMemo } from 'react';
import { useTable } from 'react-table';
import { COLUMNS, COLUMNS_WITHOUT_OPERATOR_NAME, UserCOLUMNS } from './columns';

const BasicTable = ({ 
  data, 
  handleOperatorSelection, 
  getOperatorName, 
  role, 
  handleDeleteOperatorFromTheOrder, 
  handleDeleteAllOperatorsFromTheOrder, 
  handleAddMeAsOperatorToOrder, 
  operatorID, 
  currentPage, 
  handleFetchData, 
  tableType // Added tableType prop
}) => {

  const safeData = useMemo(() => data || [], [data]);

  const columns = useMemo(() => {
    if (tableType === 'user') {
      // If tableType is 'user', use the UserCOLUMNS
      return UserCOLUMNS;
    }

    if (tableType === 'order') {
      // For order-related tables, dynamically choose columns based on role
      if (role === 'ADMIN' || role === 'MANAGER' || role === 'SALESMAN') {
        return COLUMNS(
          handleOperatorSelection, 
          getOperatorName, 
          handleDeleteOperatorFromTheOrder, 
          handleDeleteAllOperatorsFromTheOrder, 
          handleAddMeAsOperatorToOrder, 
          role, 
          operatorID, 
          currentPage, 
          handleFetchData
        );
      } else {
        return COLUMNS_WITHOUT_OPERATOR_NAME(); 
      }
    }
  }, [
    handleOperatorSelection, 
    getOperatorName, 
    handleDeleteOperatorFromTheOrder, 
    role, 
    handleDeleteAllOperatorsFromTheOrder, 
    handleAddMeAsOperatorToOrder, 
    operatorID, 
    currentPage, 
    handleFetchData, 
    tableType // Included tableType as dependency
  ]);

  const tableInstance = useTable({
    columns, 
    data: safeData
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
        {rows.map((row, rowIndex) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={`${row.original.id || rowIndex}-${rowIndex}`}>
              {row.cells.map((cell, cellIndex) => (
                <td {...cell.getCellProps()} key={cellIndex}>
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default BasicTable;
