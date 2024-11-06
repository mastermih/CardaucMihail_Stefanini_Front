import React, { useState, useEffect } from 'react';
import { updateUser, getUser, uploadImage } from '../../components/dataService'; 
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { jwtDecode } from 'jwt-decode';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './UserProfile.css';

const UserProfile = () => {
    const { id: userIdFromUrl } = useParams();
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userId, setUserId] = useState(userIdFromUrl || null);
    const [image, setImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(''); // To display the profile image
    const navigate = useNavigate();

    // Set userId from JWT if not provided in the URL
    useEffect(() => {
        if (!userIdFromUrl) {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = jwtDecode(token);
                setUserId(decodedToken.id);
            } else {
                console.error("No token found");
            }
        }
    }, [userIdFromUrl]);

    // Fetch user details
    useEffect(() => {
        if (userId) {
            const fetchUserDetails = async () => {
                try {
                    const user = await getUser(userId);
                    setUserName(user.username);
                    setEmail(user.email);
                    setPhoneNumber(user.phone_number || '');

                    // Set the image preview URL from the backend response
                    if (user.image) {
                        setImagePreviewUrl(user.image); // URL is set here for display
                    }
                } catch (error) {
                    console.error("Error fetching user details:", error);
                }
            };
            fetchUserDetails();
        }
    }, [userId]);

    // Handle user update
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
            image: image ? image.name : imagePreviewUrl,
        };

        try {
            await updateUser(updatedUser);
            setMessage('User profile updated successfully');
        } catch (error) {
            setMessage('Error updating user profile');
        } finally {
            setLoading(false);
        }
    };

    // Handle image change
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    // Handle image upload
    const handleImageUpload = async () => {
        if (!image) {
            alert('Please select an image to upload.');
            return;
        }
        try {
            const imageUrl = await uploadImage(image, userId);
            setImagePreviewUrl(imageUrl); // Set the new image URL after upload

            // Refetch user details to update the profile information
            const updatedUser = await getUser(userId);
            setUserName(updatedUser.username);
            setEmail(updatedUser.email);
            setPhoneNumber(updatedUser.phone_number || '');
            setImagePreviewUrl(updatedUser.image);
            setMessage('Image uploaded and user profile updated successfully');
        } catch (error) {
            setMessage('Error uploading image.');
            console.error('Error uploading image:', error);
        }
    };

    return (
        <>
            <Header />
            <Container className="user-profile-container">
                <div className="profile-settings-header">
                    <div className="profile-header-left">
                        {/* Display the image directly from the URL */}
                        {imagePreviewUrl ? (
                            <img className="profile-avatar" src={imagePreviewUrl} alt="Profile" />
                        ) : (
                            <span>No profile image</span>
                        )}
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
                        <img src={imagePreviewUrl} alt="Profile" className="profile-image" />
                    </div>
                )}

                {message && <div className="message">{message}</div>}
            </Container>
        </>
    );
};

export default UserProfile;