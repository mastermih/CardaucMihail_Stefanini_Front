import React, { useState } from 'react';
import { createUser, uploadImage } from '../../components/dataService'; // Assuming uploadImage exists in dataService
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './UserCreation.css';

const UserCreation = () => {
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('USER');
  const [accountNotLocked, setAccountNotLocked] = useState(false);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null); // Store userId after creating the user
  const [image, setImage] = useState(null); // For handling image
  const [imagePreviewUrl, setImagePreviewUrl] = useState(''); // URL of the uploaded image
  
  // Handle user creation
  const handleCreateUser = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission
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
      phoneNumber: phoneNumber,
      role: role,
      accountNonLocked: accountNotLocked,
    };

    try {
      const response = await createUser(user); // Call the createUser function to send the data
      setUserId(response); // Save userId for future use
      setMessage(`User created with ID: ${response}`);
      setUserName('');  // Clear the form fields
      setEmail('');
      setPassword('');
      setPhoneNumber('');
      setAccountNotLocked(false);
    } catch (error) {
      setMessage('Error creating user');
    } finally {
      setLoading(false);
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Store the selected image
  };

  // Function to upload image after user creation
  const handleImageUpload = async () => {
    if (!image) {
      alert('Please select an image to upload.');
      return;
    }
    if (!userId) {
      alert('Please create a user first.');
      return;
    }
    try {
      const imageUrl = await uploadImage(image, userId); // Pass image and userId
      setImagePreviewUrl(imageUrl); // Set the image URL for preview
      setMessage('Image uploaded successfully');
    } catch (error) {
      setMessage('Error uploading image.');
      console.error('Error uploading image:', error);
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

        <Form.Group controlId="phoneNumber">
          <Form.Label>PhoneNumber</Form.Label>
          <Form.Control
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
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

      {/* Image Upload Section */}
      {userId && (
        <div className="image-upload-section">
          <h3>Upload Profile Image</h3>
          <input type="file" onChange={handleImageChange} />
          <Button variant="success" onClick={handleImageUpload}>
            Upload Image
          </Button>
        </div>
      )}

{imagePreviewUrl && (
  <div className="image-preview">
    <h4>Image Preview:</h4>
    {/* Display the image using the correct src */}
    <img src={imagePreviewUrl} alt="Uploaded profile" style={{ maxWidth: '100%', height: 'auto' }} />
  </div>
)}


      {message && <div className="message">{message}</div>}
    </Container>
  );
};

export default UserCreation;
