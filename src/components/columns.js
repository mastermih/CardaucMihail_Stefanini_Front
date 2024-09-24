import React, { useState, useRef } from 'react';
import debounce from 'lodash.debounce'; // Import debounce for better API call handling

export const COLUMNS = (handleOperatorSelection, getOperatorName) => [
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
    Header: 'Operator Name',
    accessor: 'user_name',
    Cell: ({ row }) => {
      const [searchQuery, setSearchQuery] = useState('');
      const [filteredOperators, setFilteredOperators] = useState([]);
      const [showDropdown, setShowDropdown] = useState(false);
      const inputRef = useRef(null);

      const debouncedSearch = useRef(
        debounce(async (query) => {
          if (query.length >= 3) {
            try {
              const operatorNames = await getOperatorName(query); // Fetch operators by name
              
              // Ensure that the response is an array and contains usernames
              if (Array.isArray(operatorNames)) {
                setFilteredOperators(operatorNames.slice(0, 5)); // Limit to 5 results
              } else {
                setFilteredOperators([]); // Clear dropdown if no results
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
        debouncedSearch(query); // Trigger search when the user types
      };

      const handleOperatorSelectionLocal = (operator) => {
        setSearchQuery(operator); // Set the selected operator in the input
        setShowDropdown(false); // Hide the dropdown after selection
        handleOperatorSelection(row.original.id, operator); // Call the passed handler to set the operator for the row
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
            style={{ width: '200px' }} // Adjust the width to fit the table
          />

          {/* Dropdown for showing filtered operator options */}
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
                  {operator} {/* Assuming `operator` is a string */}
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
