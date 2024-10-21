import React, { useState, useRef } from 'react';
import Select from 'react-select';
import debounce from 'lodash.debounce';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

export const COLUMNS = (
  handleOperatorSelection,
  getOperatorName,
  handleDeleteOperatorFromTheOrder,
  handleDeleteAllOperatorsFromTheOrder,
  handleAddMeAsOperatorToOrder,
  role,
  operatorID
) => [
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
      console.log('Role in COLUMNS:', role);
      console.log('Current operator ID:', operatorID);

      const operatorUserIds = row.original.operatorUserIds
        ? row.original.operatorUserIds.split(', ')
        : [];
      const userNames = row.original.userName ? row.original.userName.split(', ') : [];
      
      const isAssignedToUser = operatorUserIds.includes(operatorID.toString());
      const isAssigned = userNames.length > 0;

      const [selectedOperators, setSelectedOperators] = useState(
        userNames.map((op) => ({ value: op, label: op }))
      );
      const [filteredOperators, setFilteredOperators] = useState([]);
      const [loading, setLoading] = useState(false);

      const debouncedSearch = useRef(
        debounce(async (query) => {
          if (query.length >= 2) {
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

      if (role === 'ADMIN') {
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
            <Button
              variant="outline-warning"
              size="sm"
              onClick={handleAddMeClick}
              style={{ marginLeft: '5px' }}
            >
              Assign As Operator
            </Button>
          </div>
        );
      } else if (role === 'MANAGER' || role === 'SALESMAN') {
        return (
          <div>
            <span>{isAssignedToUser ? 'Assigned on you' : isAssigned ? 'Assigned' : 'Not Assigned'}</span>
            <Button
              variant={isAssignedToUser || isAssigned ? 'secondary' : 'outline-warning'}
              size="sm"
              onClick={handleAddMeClick}
              style={{
                marginLeft: '10px',
                marginTop: '5px',
                marginRight: '-150px',
                backgroundColor: isAssignedToUser || isAssigned ? 'grey' : '',
                borderColor: isAssignedToUser || isAssigned ? 'grey' : '',
              }}
              disabled={isAssignedToUser || isAssigned}
            >
              {isAssignedToUser ? 'Already assigned on you' : 'Assign on me'}
            </Button>
          </div>
        );
      } else {
        return <span>No permission to view</span>;
      }
    },
  },
];


export const COLUMNS_WITHOUT_OPERATOR_NAME = () => [
  {
    Header: 'Id',
    accessor: 'id',
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

export const UserCOLUMNS = [
  {
    Header: 'UserId',
    accessor: 'id',
  },
  {
    Header: 'User Name',
    accessor: 'username',
  },
  {
    Header: 'Email',
    accessor: 'email',
  },
  {
    Header: 'Is account locked',
    accessor: 'account_not_locked',
  },

  {
    Header: 'Phone number',
    accessor: 'phone_number',
  },
];