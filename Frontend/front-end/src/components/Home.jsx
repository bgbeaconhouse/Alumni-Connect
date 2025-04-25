import Logout from "./Logout";
import ViewPosts from "./ViewPosts";
import { useNavigate } from "react-router-dom";
const Home = () => {
   const navigate = useNavigate();
    return ( 
        <>
        <button ><Logout></Logout></button>
       <button onClick={() => navigate("/posts")}>Create Post</button>
        Home Page
        <ViewPosts></ViewPosts>
        </>
     );
}
 
export default Home;