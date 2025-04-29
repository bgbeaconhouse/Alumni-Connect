import React, { useState, useEffect } from "react";
import { format } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import './ViewPosts.css';

const AddComment = ({ postId, onCommentAdded, onCancel }) => {
  const [textContent, setTextContent] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = {};
    if (!textContent.trim()) {
      validationErrors.textContent = "Comment is required";
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
      const response = await fetch(`http://localhost:3000/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: requestBody,
      });

      if (response.ok) {
        console.log("Comment added successfully!");
        setTextContent("");
        if (onCommentAdded) {
          onCommentAdded(); // Call the callback to update comment count in ViewPosts
        }
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
    <div className="add-comment-container">
      <h3>Add New Comment</h3>
      <form method='post' onSubmit={handleSubmit} className="add-comment-form">
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
        <div className="add-comment-actions">
          <button type="submit" className="submit-button">Add Comment</button>
          <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

// Mock ViewComments component for demonstration purposes
const ViewComments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/posts/${postId}/comments`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Failed to fetch comments: ${errorMessage}`);
        }

        const data = await response.json();
        setComments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  if (loading) {
    return <div>Loading comments...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (comments.length === 0) {
    return <div>No comments yet.</div>;
  }

  return (
    <div className="comments-container">
      {comments.map(comment => (
        <div key={comment.id} className="comment-item">
          <p className="comment-text">{comment.textContent}</p>
          <p className="comment-author">
            By: {comment.user.username} - {format(new Date(comment.createdAt), 'MMMM dd, hh:mm a')}
          </p>
        </div>
      ))}
    </div>
  );
};

const ViewPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [commentCounts, setCommentCounts] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [addingCommentToPostId, setAddingCommentToPostId] = useState(null); // State to track which post is being commented on

  useEffect(() => {
    async function fetchPosts() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:3000/api/posts", {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            console.error('Unauthorized access to posts');
            setError('Unauthorized access. Please log in.');
            navigate('/');
            return;
          } else {
            const errorMessage = await response.text();
            console.error('Error fetching posts:', errorMessage);
            setError(`Failed to fetch posts: ${errorMessage}`);
            return;
          }
        }

        const result = await response.json();
        const sortedPosts = result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPosts(sortedPosts);

        sortedPosts.forEach(post => {
          fetchCommentCount(post.id, token);
        });

      } catch (error) {
        setError(error);
      }
    }

    fetchPosts();
  }, [navigate]);

  async function fetchCommentCount(postId, token) {
    try {
      const response = await fetch(`http://localhost:3000/api/posts/${postId}/comments/count`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCommentCounts(prevCounts => ({
          ...prevCounts,
          [postId]: data.commentCount,
        }));
      } else if (response.status === 401 || response.status === 403) {
        console.error(`Unauthorized access to comments for post ${postId}`);
      } else {
        const errorMessage = await response.text();
        console.error(`Error fetching comment count for post ${postId}:`, errorMessage);
      }
    } catch (error) {
      console.error(`Error fetching comment count for post ${postId}:`, error);
    }
  }

  const toggleComments = (postId) => {
    setOpenComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
    // Close the add comment section if it's open for this post
    if (addingCommentToPostId === postId) {
      setAddingCommentToPostId(null);
    }
  };

  const handleAddCommentClick = (postId) => {
    setAddingCommentToPostId(postId);
    // Close the comments section if it's open for this post
    if (openComments[postId]) {
      setOpenComments(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleCommentAdded = (postId) => {
    fetchCommentCount(postId, localStorage.getItem('token'));
    setOpenComments(prev => ({ ...prev, [postId]: true }));
    setAddingCommentToPostId(null);
  };

  const handleCancelComment = () => {
    setAddingCommentToPostId(null);
  };

  return (
    <div className="posts-container">
      {posts.map((post) => (
        <div key={post.id} className="post-container">
          <h3 className="post-header"> {post.user.firstName} {post.user.lastName}</h3>
          <h3 className="post-date">{format(new Date(post.createdAt), 'MMMM dd, hh:mm a')}</h3>
          <p className="post-text">{post.textContent}</p>
          {post.imageContents && post.imageContents.length > 0 && (
            <div className="pickup-image-container">
              <img
                src={`http://localhost:3000/uploads/${post.imageContents[0]}`}
                alt={post.userId}
                className="pickup-image"
              />
            </div>
          )}

          <div className="single-post-actions">
            <button
              className="single-post-button"
              onClick={() => handleAddCommentClick(post.id)}
            >
              Add Comment
            </button>
            <button className="single-post-button">Like</button>
            <button
              onClick={() => toggleComments(post.id)}
              className="single-post-button"
              disabled={!(commentCounts[post.id] > 0)}
              style={{
                cursor: !(commentCounts[post.id] > 0) ? 'not-allowed' : 'pointer',
                opacity: !(commentCounts[post.id] > 0) ? 0.6 : 1
              }}
            >
              {openComments[post.id] ? 'Hide Comments' : 'View Comments'} ({commentCounts[post.id] || 0})
            </button>
          </div>

          {addingCommentToPostId === post.id && (
            <AddComment
              postId={post.id}
              onCommentAdded={() => handleCommentAdded(post.id)}
              onCancel={handleCancelComment} // Pass the cancel handler
            />
          )}

          {openComments[post.id] && (
            <ViewComments postId={post.id} />
          )}
        </div>
      ))}
    </div>
  );
};

export default ViewPosts;


