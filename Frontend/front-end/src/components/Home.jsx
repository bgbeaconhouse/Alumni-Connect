import Logout from "./Logout";
import ViewPosts from "./ViewPosts";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:3000/api/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserId(data.id);
          } else {
            console.error("Failed to fetch user ID");
            navigate('/'); // Or handle error appropriately
          }
        } catch (error) {
          console.error("Error fetching user ID:", error);
          navigate('/'); // Or handle error appropriately
        }
      } else {
        navigate('/');
      }
    };

    fetchUserId();
  }, [navigate]);

  return (
    <>
      <Logout />
      <button onClick={() => navigate("/createposts")}>Create Post</button>
      {userId && (
        <button onClick={() => navigate(`/profiles/${userId}`)}>My Profile</button>
      )}
      <button onClick={() => navigate('/profiles/')}>Profiles</button>
      <ViewPosts />
    </>
  );
};

export default Home;