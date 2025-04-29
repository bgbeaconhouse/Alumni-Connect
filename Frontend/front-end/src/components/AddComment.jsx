import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AddComment = () => {
  const [textContent, setTextContent] = useState('');
  const [errors, setErrors] = useState({}); // Changed to object for consistency with previous example
  const navigate = useNavigate();
  const { id } = useParams(); // Get the post ID from the route parameters

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = {};
    if (!textContent.trim()) {
      validationErrors.textContent = "Comment is required"; // More user-friendly message
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const token = localStorage.getItem('token');
    const requestBody = JSON.stringify({
      textContent: textContent,
    });

    try {
      const response = await fetch(`http://localhost:3000/api/posts/${id}/comments`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json', // Specify JSON content type
          'Authorization': `Bearer ${token}`
        },
        body: requestBody,
      });

      if (response.ok) {
        console.log("Comment added successfully!");
        navigate(`/posts/${id}`); // Navigate back to the specific post
      } else if (response.status === 401 || response.status === 403) {
        console.error("Unauthorized to add comment");
        setErrors({ general: "Unauthorized to add a new comment. Please log in." });
      } else {
        const errorData = await response.json();
        console.error("Error adding comment:", errorData);
        setErrors({ general: "Failed to add comment." });
      }
    } catch (error) {
      console.error("Fetch error:", error.message);
      setErrors({ general: "Network error. Please try again." });
    }

    if (!errors.general && Object.keys(validationErrors).length === 0) {
      setTextContent("");
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrors(prevErrors => ({ ...prevErrors, [name]: "" }));
    switch (name) {
      case "textContent":
        setTextContent(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="add-pickup-form-page"> {/* Consider renaming this CSS class */}
      <div className="form-container">
        <h2 className="form-title">Add New Comment</h2>
        <form method='post' onSubmit={handleSubmit} className="add-form">
          {errors.general && <p className="error-message general-error">{errors.general}</p>}
          <div className="form-group">
            <label htmlFor="textContent" className="form-label">Comment:</label>
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
          <button type="submit" className="submit-button">Add Comment</button>
        </form>
      </div>
    </div>
  );
}

export default AddComment;