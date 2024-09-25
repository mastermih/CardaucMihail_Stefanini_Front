import React, { useState, useRef } from 'react';
import debounce from 'lodash.debounce'; 
import { useNavigate } from 'react-router-dom';
export const COLUMNS = (handleOperatorSelection, getOperatorName) => [
  {
    Header: 'Id',
    accessor: 'id',
    Cell: ({ value }) => {
      const navigate = useNavigate();
      return (
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() => navigate(`/DetailedOrder?orderId=${value}`)}
        >
          {value}
        </span>
      );
    },
  },
  {
    Header: 'Customer Name',  
    accessor: 'creatorUsername',
    Cell: ({ row }) => {
      const customerName = row.original.creatorUsername || 'N/A'; 
      return <span>{customerName}</span>;
    },
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
    Header: 'Assign Operator',
    accessor: 'assign_operator',
    Cell: ({ row }) => {
      const [searchQuery, setSearchQuery] = useState(row.original.userName || '');  // Prepopulate with the current operator's name
      const [filteredOperators, setFilteredOperators] = useState([]);
      const [showDropdown, setShowDropdown] = useState(false);
      const inputRef = useRef(null);

      const debouncedSearch = useRef(
        debounce(async (query) => {
          if (query.length >= 3) {
            try {
              const operatorNames = await getOperatorName(query);
              if (Array.isArray(operatorNames)) {
                setFilteredOperators(operatorNames.slice(0, 5));
              } else {
                setFilteredOperators([]);
              }
              setShowDropdown(true);
            } catch (error) {
              console.error('Error fetching operators:', error);
              setFilteredOperators([]);
              setShowDropdown(false);
            }
          } else {
            setShowDropdown(false);
          }
        }, 300)
      ).current;

      const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
      };

      const handleOperatorSelectionLocal = async (operator) => {
        setSearchQuery(operator);  // Set the selected operator name in the input
        setShowDropdown(false);
        await handleOperatorSelection(row.original.id, operator);  // Handle operator selection (e.g., API call)
      };

      return (
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for operator"
            className="form-control"
            ref={inputRef}
            style={{ width: '200px' }}
          />

          {showDropdown && filteredOperators.length > 0 && (
            <ul
              className="dropdown-menu"
              style={{
                display: 'block',
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 1000,
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                listStyle: 'none',
                maxHeight: '150px',
                overflowY: 'auto',
              }}
            >
              {filteredOperators.map((operator, index) => (
                <li
                  key={index}
                  onClick={() => handleOperatorSelectionLocal(operator)}
                  style={{ padding: '8px', cursor: 'pointer' }}
                >
                  {operator}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    },
  },
];




export const COLUMNS_WITHOUT_OPERATOR_NAME = () => [
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
