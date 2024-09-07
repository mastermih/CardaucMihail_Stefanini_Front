import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Container from 'react-bootstrap/Container';
import { confirmUserEmail, uploadImage } from '../../components/dataService'; // Assuming you have an uploadImage function in dataService
import { useParams } from 'react-router-dom';
import Footer from '../../components/Footer';
import './ConfirmUserEmail.css';

const ConfirmUserEmail = () => {
    const { id } = useParams(); // Retrieve token from the URL
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmationStatus, setConfirmationStatus] = useState(null);
    const [image, setImage] = useState(null); // For handling image
    const [uploadMessage, setUploadMessage] = useState(""); // For image upload feedback

    // Function to confirm user email using the token
    useEffect(() => {
      const confirmUser = async () => {
        try {
          const data = await confirmUserEmail(id); // Pass token to the API call
          setConfirmationStatus(data); // Store confirmation response
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
  
      confirmUser();
    }, [id]);

    // Handle image selection
    const handleImageChange = (e) => {
      setImage(e.target.files[0]); // Store the selected image
    };

    // Function to upload image after user confirmation
    const handleImageUpload = async () => {
      if (!image) {
        alert("Please select an image to upload.");
        return;
      }
      try {
        const response = await uploadImage(image, id); // Pass image and user token
        setUploadMessage(response); // Display success message
      } catch (error) {
        setUploadMessage("Error uploading image.");
        console.error("Error uploading image:", error);
      }
    };
  
    // Display loading and error states
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  
    return (
      <>
        <Header />
        <div className="confirmation-content">
          <Container>
            {confirmationStatus ? (
              <>
                <p>Your User has been confirmed successfully.</p>

                {/* Image Upload Section */}
                <div>
                  <h3>Upload Profile Image</h3>
                  <input type="file" onChange={handleImageChange} />
                  <button onClick={handleImageUpload}>Upload Image</button>
                  {uploadMessage && <p>{uploadMessage}</p>}
                </div>

              </>
            ) : (
              <p>There was an issue confirming the user. Please try again later.</p>
            )}
          </Container>
        </div>
        <Footer />
      </>
    );
  };
  
  export default ConfirmUserEmail;
