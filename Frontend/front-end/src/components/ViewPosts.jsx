import React, { useState, useEffect } from "react";
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import './ViewPosts.css'; // Import the CSS file

const ViewPosts = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
            } catch (error) {
                setError(error);
            }
        }
        fetchPosts();
    }, [navigate]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="posts-container">
            {posts.map((post) => (
                <div key={post.id} className="post-container">
                    <h3 className="post-header"> {post.user.firstName} {post.user.lastName}</h3>
                    <h3 className="post-date">{format(new Date(post.createdAt), 'MMMM dd, yyyy')}</h3>
                    <p className="post-text">{post.textContent}</p>
                    {post.imageContent && <img src={post.imageContent} alt="Post picture" className="post-image" />}
                    <div><button>Add Comment</button></div>
                    <div><button>Like</button></div>
                </div>
                
            ))}
           
        </div>
    );
};

export default ViewPosts;
