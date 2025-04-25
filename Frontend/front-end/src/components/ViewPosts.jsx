import { useState, useEffect } from "react";

const ViewPosts = () => {
   const [posts, setPosts] = useState([])
   const [error, setError] = useState(null);

   useEffect(() => {
    async function fetchPosts() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch("http://localhost:3000/api/posts", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                  },  
            })

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                  console.error('Unauthorized access to pickups');
                  setError('Unauthorized access. Please log in.');
                  navigate('/');
                  return;
                } else {
                  const errorMessage = await response.text();
                  console.error('Error fetching pickups:', errorMessage);
                  setError(`Failed to fetch pickups: ${errorMessage}`);
                  return;
                }
              }


            const result = await response.json()
            setPosts(result)


        } catch (error) {
            setError(error)
        }
    }
    fetchPosts()
   }, []);
   
   
   
   return ( 
      
        <div>
           {posts.map((post) => (
            <div key={post.id}>
                <h3>Post by: {post.user.firstName} {post.user.lastName}</h3>  
                <h3> {post.textContent}</h3>
                <img src={post.imageContent} alt="Post picture" />  
            </div>
           ))}
        </div>
       
     );
}
 
export default ViewPosts;