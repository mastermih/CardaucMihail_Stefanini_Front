import React, { useState, useEffect } from 'react';
import { updateUser, getUser, uploadImage } from '../../components/dataService'; 
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { jwtDecode } from 'jwt-decode';  // Correct import (default export)
import { useParams } from 'react-router-dom';  // To capture userId from the URL
import './UserProfile.css'; 

const UserProfile = () => {
    const { id: userIdFromUrl } = useParams();  // Get the userId from the URL params
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userId, setUserId] = useState(userIdFromUrl || null);  // Either from URL or token
    const [image, setImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const baseURL = 'http://localhost:8080/';  // Adjust based on your backend URL

    useEffect(() => {
        if (!userIdFromUrl) {
            // If no userId in URL, try to extract it from the token
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);  // Decode the token
                const extractedUserId = decodedToken.userId;  // Assuming the token contains userId
                setUserId(extractedUserId);
                console.log('User ID extracted from token:', extractedUserId);
            } else {
                console.error("No token found");
            }
        }
    }, [userIdFromUrl]);

    useEffect(() => {
        if (userId) {
            const fetchUserDetails = async () => {
                try {
                    console.log('Fetching user details for userId:', userId);
                    const user = await getUser(userId); 
                    setUserName(user.username);
                    setEmail(user.email);
                    setPhoneNumber(user.phoneNumber || '');
                    setImagePreviewUrl(baseURL + user.image); 
                    console.log('User details fetched successfully:', user);
                } catch (error) {
                    console.error("Error fetching user details:", error);
                }
            };
            fetchUserDetails();
        }
    }, [userId]);

    // Function to update the user profile
    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const updatedUser = {
            userId: { id: userId },
            name: { name: userName },
            email: { email: email },
            password: password,
            phoneNumber: phoneNumber,
            image: image ? image.name : imagePreviewUrl.replace(baseURL, '') 
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

    // Function to handle the image file change
    const handleImageChange = (e) => {
        setImage(e.target.files[0]); 
    };

    // Function to upload the image and refresh the user data
    const handleImageUpload = async () => {
        if (!image) {
            alert('Please select an image to upload.');
            return;
        }
        try {
            const imageUrl = await uploadImage(image, userId);
            setImagePreviewUrl(baseURL + imageUrl);  // Update the preview URL with the uploaded image path

            // Fetch the updated user details after image upload
            const updatedUser = await getUser(userId);  
            setUserName(updatedUser.username);
            setEmail(updatedUser.email);
            setPhoneNumber(updatedUser.phoneNumber || '');
            setImagePreviewUrl(baseURL + updatedUser.image);  // Update the preview to the newly uploaded image
            setMessage('Image uploaded and user profile updated successfully');
        } catch (error) {
            setMessage('Error uploading image.');
            console.error('Error uploading image:', error);
        }
    };

    return (
        <Container className="user-profile-container">
            <div className="profile-settings-header">
                <div className="profile-header-left">
                    {/* Display the image */}
                    <img className="profile-avatar" src={imagePreviewUrl || "default-avatar.jpg"} alt="Profile" />
                    <h1 className="profile-username">{userName || 'User'}</h1>
                </div>
            </div>

            <Form onSubmit={handleUpdateUser} className="profile-form">
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

                <Form.Group controlId="phoneNumber">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Phone Number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Save Changes'}
                </Button>
            </Form>

            <div className="image-upload-section">
                <h3>Upload Profile Image</h3>
                <input type="file" onChange={handleImageChange} />
                <Button variant="success" onClick={handleImageUpload}>
                    Upload Image
                </Button>
            </div>

            {imagePreviewUrl && (
                <div className="image-preview">
                    <h4>Profile Image:</h4>
                    <img src={imagePreviewUrl} alt="Profile" className='profile-image' />
                </div>
            )}

            {message && <div className="message">{message}</div>}
        </Container>
    );
};

export default UserProfile;
