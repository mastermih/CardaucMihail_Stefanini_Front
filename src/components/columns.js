// columns.js


export const COLUMNS = (handleRoleSelection) => [
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
];

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