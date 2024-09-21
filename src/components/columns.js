export const COLUMNS = (handleRoleSelection, handleOperatorSelection, operators = {}, operatorsName = {}) => [
  {
    Header: 'Id',
    accessor: 'id',
  },
  {
    Header: 'User Id',
    accessor: 'user_id',
  },
  {
    Header: 'Created Date',
    accessor: 'created_date',
  },
  {
    Header: 'Updated Date',
    accessor: 'updated_date',
  },
  {
    Header: 'Order Status',
    accessor: 'order_status',
  },
  {
    Header: 'Operator',
    accessor: 'assigned_operator',
    Cell: ({ row }) => (
      <div>
        <select
          value={row.original.assigned_operator || ''}
          onChange={(e) => handleRoleSelection(row.original.id, e.target.value)}
          className="form-select"
        >
          <option value="">Not Selected</option>
          <option value="ADMIN">Admin</option>
          <option value="SALESMAN">Salesman</option>
          <option value="MANAGER">Manager</option>
        </select>
      </div>
    ),
  },
  {
    Header: 'Operator Name',
    accessor: 'user_name',
    Cell: ({ row }) => (
      <div>
        <select
          value={operatorsName[row.original.id] || ''}
          onChange={(e) => handleOperatorSelection(row.original.id, e.target.value)}
          className="form-select"
        >
          <option value="">Not Selected</option>
          {operators[row.original.id]?.length > 0 ? (
            operators[row.original.id].map((operator, index) => (
              <option key={index} value={operator}>{operator}</option>
            ))
          ) : (
            <option value="" disabled>No operators available</option>
          )}
        </select>
      </div>
    )    
  },
];



// COLUMNS2 (assuming this is for another table)
export const COLUMNS2 = [
  {
    Header: 'OrderID',
    accessor: 'id',
  },
  {
    Header: 'Product Name',
    accessor: 'product_name',
  },
  {
    Header: 'Quantity',
    accessor: 'quantity',
  },
  {
    Header: 'Price',
    accessor: 'price',
  },
];
