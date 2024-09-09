import React, { useState, useEffect } from 'react';
import { updateUser, getUser, uploadImage } from '../../components/dataService'; 
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './UserProfile.css'; 

const UserProfile = () => {
    const hardcodedUserId = 115; // Hardcoded userId for testing
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [userId, setUserId] = useState(hardcodedUserId); 
    const [image, setImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');

    // Fetch user details on component 
    useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const user = await getUser(userId); 
          setUserName(user.username);
          setEmail(user.email);

          const baseURL = 'http://localhost:8080/'; // Replace with your server base URL
          setImagePreviewUrl(baseURL + user.image); 
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };
      fetchUserDetails();
    }, [userId]);

    // Handle user profile update
    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
      
        const updatedUser = {
          userId:{
            id: userId,
          } ,
          name: {
            name: userName,
          },
          email: {
            email: email,
          },
          password: password,
        //   phoneNumber: phoneNumber,
        //   role: role,
        //   accountNonLocked: accountNotLocked,
        };
      
        try {
          const response = await updateUser(updatedUser); 
          setMessage('User profile updated successfully');
        } catch (error) {
          setMessage('Error updating user profile');
        } finally {
          setLoading(false);
        }
    };

    // Handle image selection
    const handleImageChange = (e) => {
      setImage(e.target.files[0]); 
    };

   // Function to upload the new image
const handleImageUpload = async () => {
    if (!image) {
      alert('Please select an image to upload.');
      return;
    }
    try {
      // Upload the image using userId
      const imageUrl = await uploadImage(image, userId); 
  
      // After successful upload, fetch the updated user details (including the new image)
      const user = await getUser(userId);
      
      // Set the new image preview URL from the updated user data
      const baseURL = 'http://localhost:8080/'; // Replace with your server base URL
      setImagePreviewUrl(baseURL + user.image); 
  
      setMessage('Image uploaded and updated successfully');
    } catch (error) {
      setMessage('Error uploading image.');
      console.error('Error uploading image:', error);
    }
  };
  

    return (
      <Container className="user-profile-container">
        <h1>Settings</h1>
        <Form onSubmit={handleUpdateUser}>
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
              placeholder="New password (optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Save Changes'}
          </Button>
        </Form>

        {/* Image Upload Section */}
        <div className="image-upload-section">
          <h3>Upload Profile Image</h3>
          <input type="file" onChange={handleImageChange} />
          <Button variant="success" onClick={handleImageUpload}>
            Upload Image
          </Button>
        </div>

        {/* Image Preview */}
        {imagePreviewUrl && (
          <div className="image-preview">
            <h4>Profile Image:</h4>
            <img src={imagePreviewUrl} alt="Profile" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        )}

        {message && <div className="message">{message}</div>}
      </Container>
    );
};

export default UserProfile;
