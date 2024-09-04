import React, { useState } from 'react';
import { createUser } from '../../components/dataService';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './UserCreation.css';

const UserCreation = () => {
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('User')
    const [accountNotLocked, setAccountNotLocked] = useState(false);
    const [message, setMessage] = useState('');


    const handleCreateUser = async (e) => {
        e.preventDefault(); // Prevent page reload on form submission // Dar cred ca e fara rost
        setLoading(true);
        setMessage('');


        const user = {
            name: {
                name: userName,
            },
            email: {
                email: email,
            },
            password: password,
            role: role,
            accountNonLocked: accountNotLocked
        };
        try {
            // Call the createUser function to send the data
            const response = await createUser(user);
            setMessage(`User created with ID: ${response}`);
            setUserName('');  // Clear the form fields
            setEmail('');
            setPassword('');
            setAccountNotLocked(false);
          } catch (error) {
            setMessage('Error creating user');
          } finally {
            setLoading(false); // Reset loading state
          }
        };
      
        return (
          <Container className="user-creation-container">
            <h1>Create New User</h1>
            <Form onSubmit={handleCreateUser}>
              <Form.Group controlId="userName">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </Form.Group>
      
              <Form.Group controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
      
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="role">
          <Form.Label>Role</Form.Label>
          <Form.Select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="SALESMAN">Salesman</option>
          </Form.Select>
        </Form.Group>
      
              <Form.Group controlId="accountNotLocked">
                <Form.Check
                  type="checkbox"
                  label="Account Not Locked"
                  checked={accountNotLocked}
                  onChange={(e) => setAccountNotLocked(e.target.checked)}
                />
              </Form.Group>
      
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create User'}
              </Button>
            </Form>
      
            {message && <div className="message">{message}</div>}
          </Container>
        );
      };
      
      export default UserCreation;