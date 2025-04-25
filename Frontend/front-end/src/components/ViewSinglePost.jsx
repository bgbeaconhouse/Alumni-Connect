import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import './ViewSinglePost.css'; // Import the CSS file

const ViewSinglePost = () => {
    const [singlePost, setSinglePost] = useState("");
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

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

            } catch (error) {
                console.error('Error fetching post:', error);
                setError('Failed to fetch post details. Please check your network connection.');
            }
        }
        fetchSinglePost();
    }, [id, navigate]);

    return (

        <div className="single-post-container">
            {singlePost && (
                <div className="single-post-card">
                    <h3 className="single-post-header">
                        {singlePost.user.firstName} {singlePost.user.lastName}
                    </h3>
                    <p className="single-post-date">{format(new Date(singlePost.createdAt), 'MMMM dd, yyyy hh:mm a')}</p>
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
                    </div>
                </div>
            )}
        </div>

    );
}

export default ViewSinglePost;
