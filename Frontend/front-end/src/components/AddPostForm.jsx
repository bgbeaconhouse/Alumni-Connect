import { useState } from "react";
import { useNavigate } from 'react-router-dom';


const AddPostForm = () => {
  const [textContent, setTextContent] = useState("");
  const [imageContents, setImageContents] = useState([]);

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = {};
    if (!textContent.trim()) {
      validationErrors.textContent = "textContent is required";
    }


    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const token = localStorage.getItem('token'); // Retrieve the token
    const formData = new FormData();
    formData.append("textContent", textContent);
    imageContents.forEach((imageContent) => { // Append each image
      formData.append("imageContents", imageContent);
    });
   

    try {
      const response = await fetch("http://localhost:3000/api/posts", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`, // Include the token in the headers
        },
        body: formData,
      });

      if (response.ok) {
        console.log("Post added successfully!");
        navigate("/home");
      } else if (response.status === 401 || response.status === 403) {
        console.error("Unauthorized to add post");
        setErrors({ general: "Unauthorized to add a new post. Please log in." });
      } else {
        const errorData = await response.json();
        console.error("Error adding post:", errorData);
        setErrors({ general: "Failed to add post." }); // Set a general error message
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
      setErrors({ general: "Network error. Please try again." }); // Set a network error message
    }

    // Clear the form fields only on successful submission (no general error)
    if (!errors.general && Object.keys(validationErrors).length === 0) {
      setTextContent("");
   
      setImageContents([]);
   
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrors(prevErrors => ({ ...prevErrors, [name]: "" }));
    switch (name) {
      case "textContent":
        setTextContent(value);
        break;
      case "imageContents":
        setImageContents([...e.target.files]);
        break;
   
      default:
        break;
    }
  };

  return (
    <div className="add-pickup-form-page">
      <div className="form-container">
        <h2 className="form-title">Add New Post</h2>
        <form method='post' onSubmit={handleSubmit} encType="multipart/form-data" className="add-form">
          {errors.general && <p className="error-message general-error">{errors.general}</p>}
          <div className="form-group">
            <label htmlFor="textContent" className="form-label">Post:</label>
            <input
              type="text"
              id="textContent"
              name="textContent"
              value={textContent}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            {errors.textContent && <p className="error-message">{errors.textContent}</p>}
          </div>
     
          <div className="form-group">
            <label htmlFor="imageContents" className="form-label">Images:</label>
            <input
              type="file"
              id="imageContents"
              name="imageContents"
              onChange={handleInputChange}
              className="form-input-file"
              multiple
            />
            {imageContents.length > 0 && (
              <div className="image-preview-container">
                {Array.from(imageContents).map((imageContent, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(imageContent)}
                    alt={`preview-${index}`}
                    className="image-preview"
                    style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }}
                  />
                ))}
              </div>
            )}
          </div>
         
          <button type="submit" className="submit-button">Add Post</button>
        </form>
      </div>
    </div>
  );
};

export default AddPostForm;