import React, { useState, useRef } from 'react';
import Select from 'react-select';
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

export const COLUMNS = (handleOperatorSelection, getOperatorName, handleDeleteOperatorFromTheOrder, handleDeleteAllOperatorsFromTheOrder, handleAddMeAsOperatorToOrder) => [
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
    Header: 'Order Status',
    accessor: 'order_status',
  },
  {
    Header: 'Assign Operator',
    accessor: 'assign_operator',
    Cell: ({ row }) => {
      const userNames = row.original.userName ? row.original.userName.split(', ') : [];
      const [selectedOperators, setSelectedOperators] = useState(
        userNames.map((op) => ({ value: op, label: op }))
      );
      const [filteredOperators, setFilteredOperators] = useState([]);
      const [loading, setLoading] = useState(false);

      const debouncedSearch = useRef(
        debounce(async (query) => {
          if (query.length >= 3) {
            try {
              setLoading(true);
              const operatorNames = await getOperatorName(query);

              if (Array.isArray(operatorNames)) {
                const limitedOperators = operatorNames.slice(0, 3);
                setFilteredOperators(limitedOperators.map((op) => ({ value: op, label: op })));
              } else {
                setFilteredOperators([]);
              }
            } catch (error) {
              console.error('Error fetching operators:', error);
              setFilteredOperators([]);
            } finally {
              setLoading(false);
            }
          } else {
            setFilteredOperators([]);
          }
        }, 300)
      ).current;

      const handleOperatorChange = (selectedOptions, actionMeta) => {
        setSelectedOperators(selectedOptions || []);
    
        if (actionMeta.action === 'remove-value' && actionMeta.removedValue) {
            const removedOperator = actionMeta.removedValue.value;
            handleDeleteOperatorFromTheOrder(row.original.id, removedOperator);
        }
        if (selectedOptions.length === 0) {
          handleDeleteAllOperatorsFromTheOrder(row.original.id);
        }
        if (actionMeta.action === 'select-option') {
            const lastSelectedOperator = selectedOptions[selectedOptions.length - 1]?.value;
            handleOperatorSelection(row.original.id, lastSelectedOperator);
        }
   
      };
      const handleAddMeClick = () => {
        handleAddMeAsOperatorToOrder(row.original.id);
      };
      


      const customStyles = {
        multiValue: (provided) => ({
          ...provided,
          display: 'inline-block',
          margin: '0 5px',
          position: 'relative',
          paddingRight: '20px',
        }),
        multiValueRemove: (provided) => ({
          ...provided,
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'transparent',
          cursor: 'pointer',
        }),
      };
      

      return (
        <div style={{ position: 'relative' }}>
<Select
  isMulti
  value={selectedOperators}
  onChange={handleOperatorChange}
  onInputChange={(inputValue) => {
    debouncedSearch(inputValue);
  }}
  options={filteredOperators}
  placeholder="Search and select operators"
  isLoading={loading}
  className="form-control"
  styles={customStyles}  
/>
<Button variant="outline-warning" onClick={handleAddMeClick} style={{ marginTop: '10px' }}>
            Add Me As Operator
          </Button>
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
