import Logout from "./Logout";
import ViewPosts from "./ViewPosts";
import { useNavigate } from "react-router-dom";
const Home = () => {
   const navigate = useNavigate();
    return ( 
        <>
        <Logout></Logout>
       <button onClick={() => navigate("/posts")}>Create Post</button>
        
        <ViewPosts></ViewPosts>
        </>
     );
}
 
export default Home;