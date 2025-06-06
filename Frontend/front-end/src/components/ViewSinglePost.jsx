import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import './ViewSinglePost.css'; // Import the CSS file

const ViewSinglePost = () => {
    const [singlePost, setSinglePost] = useState("");
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [hasComments, setHasComments] = useState(false);
    const [commentCount, setCommentCount] = useState(0); // Add state for comment count

    useEffect(() => {
        async function fetchSinglePost() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        console.error('Unauthorized access to post details');
                        setError('Unauthorized access. Please log in.');
                        navigate('/');
                        return;
                    } else {
                        const errorMessage = await response.text();
                        console.error('Error fetching post:', errorMessage);
                        setError(`Failed to fetch post details: ${errorMessage}`);
                        return;
                    }
                }

                const result = await response.json();
                setSinglePost(result);
                setHasComments(false); // Initialize hasComments here

            } catch (error) {
                console.error('Error fetching post:', error);
                setError('Failed to fetch post details. Please check your network connection.');
            }
        }

        async function fetchCommentsCount() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3000/api/posts/${id}/comments/count`, { // Corrected endpoint
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setHasComments(data.commentCount > 0);
                    setCommentCount(data.commentCount); // Store the comment count
                } else if (response.status === 401 || response.status === 403) {
                    console.error('Unauthorized access to comments');
                } else {
                    const errorMessage = await response.text(); // Get error message
                    console.error('Error fetching comments count:', errorMessage);
                    setError(`Failed to fetch comment count: ${errorMessage}`); // set error
                }
            } catch (error) {
                console.error('Error fetching comments count:', error);
                setError('Failed to fetch comment count. Please check your network connection.'); // set error
            }
        }

        fetchSinglePost().then(() => {
            fetchCommentsCount();
        });
    }, [id, navigate]); // Removed location.key, added navigate

    if (error) { // Added error state
        return (
            <div className="single-post-container">
                <p className="error-message">{error}</p>
            </div>
        );
    }

    if (!singlePost) {
        return (
            <div className="single-post-container">
                <p>Loading post...</p>
            </div>
        );
    }

    return (
        <div className="single-post-container">

            {singlePost && (
                <div className="single-post-card">
                    <h3 className="single-post-header">
                        {singlePost.user?.firstName} {singlePost.user?.lastName} {/*Added ?. for safety */}
                    </h3>
                    <p className="single-post-date">{format(new Date(singlePost.createdAt), 'MMMM dd, yyyy hh:mm a')}</p> {/* corrected date format */}
                    <p className="single-post-text">{singlePost.textContent}</p>
                    {singlePost.imageContents && singlePost.imageContents.length > 0 && (
                        <div className="single-post-image-grid">
                            {singlePost.imageContents.map((imageName, index) => (
                                <div key={index} className="single-post-image-wrapper">
                                    <img
                                        src={`http://localhost:3000/uploads/${imageName}`}
                                        alt={`${singlePost.items}-${index}`}
                                        className="single-post-image"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="single-post-actions">
                        <button className="single-post-button">Add Comment</button>
                        <button className="single-post-button">Like</button>
                        <button
                            onClick={() => navigate(`/posts/${id}/comments`)}
                            className="single-post-button"
                            disabled={!hasComments}
                            style={{
                                cursor: !hasComments ? 'not-allowed' : 'pointer',
                                opacity: !hasComments ? 0.6 : 1
                            }}
                        >
                            View Comments ({commentCount}) {/* Display count here */}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewSinglePost;

