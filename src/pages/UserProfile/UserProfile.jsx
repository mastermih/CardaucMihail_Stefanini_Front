// import React, { useState, useEffect } from 'react';
// import { updateUserDetails, getUserDetails, uploadImage } from '../../components/dataService'; // Assuming these functions exist
// import Container from 'react-bootstrap/Container';
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
// import './UserProfile.css'; // Assuming you will create this CSS file

// const UserProfile = () => {
//   const [loading, setLoading] = useState(false);
//   const [userName, setUserName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [userId, setUserId] = useState(null); // Store userId after fetching the details
//   const [image, setImage] = useState(null); // For handling image
//   const [imagePreviewUrl, setImagePreviewUrl] = useState(''); // URL of the uploaded image
  
//   // Fetch user details on component mount
//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       try {
//         const user = await getUserDetails(); // Assuming this fetches current user details
//         setUserName(user.name);
//         setEmail(user.email);
//         setUserId(user.id);
//         setImagePreviewUrl(user.image); // Preload the current profile image if available
//       } catch (error) {
//         console.error("Error fetching user details:", error);
//       }
//     };
//     fetchUserDetails();
//   }, []);

//   // Handle user profile update
//   const handleUpdateUser = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');

//     const updatedUser = {
//       name: userName,
//       email: email,
//       password: password ? password : null, // Only update password if provided
//     };

//     try {
//       const response = await updateUserDetails(userId, updatedUser); // Call the update function
//       setMessage('User profile updated successfully');
//     } catch (error) {
//       setMessage('Error updating user profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle image selection
//   const handleImageChange = (e) => {
//     setImage(e.target.files[0]); // Store the selected image
//   };

//   // Function to upload the new image
//   const handleImageUpload = async () => {
//     if (!image) {
//       alert('Please select an image to upload.');
//       return;
//     }
//     try {
//       const imageUrl = await uploadImage(image, userId); // Pass image and userId to backend
//       setImagePreviewUrl(imageUrl); // Set the new image URL for preview
//       setMessage('Image uploaded successfully');
//     } catch (error) {
//       setMessage('Error uploading image.');
//       console.error('Error uploading image:', error);
//     }
//   };

//   return (
//     <Container className="user-profile-container">
//       <h1>Settings</h1>
//       <Form onSubmit={handleUpdateUser}>
//         <Form.Group controlId="userName">
//           <Form.Label>Username</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter username"
//             value={userName}
//             onChange={(e) => setUserName(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Form.Group controlId="email">
//           <Form.Label>Email address</Form.Label>
//           <Form.Control
//             type="email"
//             placeholder="Enter email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </Form.Group>

//         <Form.Group controlId="password">
//           <Form.Label>Password</Form.Label>
//           <Form.Control
//             type="password"
//             placeholder="New password (optional)"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </Form.Group>

//         <Button variant="primary" type="submit" disabled={loading}>
//           {loading ? 'Updating...' : 'Save Changes'}
//         </Button>
//       </Form>

//       {/* Image Upload Section */}
//       <div className="image-upload-section">
//         <h3>Upload Profile Image</h3>
//         <input type="file" onChange={handleImageChange} />
//         <Button variant="success" onClick={handleImageUpload}>
//           Upload Image
//         </Button>
//       </div>

//       {/* Image Preview */}
//       {imagePreviewUrl && (
//         <div className="image-preview">
//           <h4>Profile Image:</h4>
//           <img src={imagePreviewUrl} alt="Profile" style={{ maxWidth: '100%', height: 'auto' }} />
//         </div>
//       )}

//       {message && <div className="message">{message}</div>}
//     </Container>
//   );
// };

// export default UserProfile;
