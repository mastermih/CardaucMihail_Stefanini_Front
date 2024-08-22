export const COLUMNS = (handleButtonClick) => [
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
    Header: 'Actions',  // New column for actions
    accessor: 'actions', // Dummy accessor
    Cell: ({ row }) => (
      <button
        onClick={() => handleButtonClick(row.original)}
        className="btn btn-primary"
      >
        BOOM
      </button>
    ),
  },
];


export const COLUMNS2 = [
  {
    Header: 'OrderID',
    accessor: 'id',
  },
  {
    Header: 'ProductName',
    accessor: 'product_name',
  },
  {
    Header: 'Quantity',
    accessor: 'quantity',
  },
  {
    Header: 'PriceProduct',
    accessor: 'price_product',
  },
  {
    Header: 'Parent',
    accessor: 'parent',
  },
];