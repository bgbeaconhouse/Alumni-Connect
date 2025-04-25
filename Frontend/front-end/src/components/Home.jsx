import Logout from "./Logout";
import ViewPosts from "./ViewPosts";

const Home = () => {
   
    return ( 
        <>
        <button ><Logout></Logout></button>
        Home Page
        <ViewPosts></ViewPosts>
        </>
     );
}
 
export default Home;