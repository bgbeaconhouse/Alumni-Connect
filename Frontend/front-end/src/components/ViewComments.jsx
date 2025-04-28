import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


const ViewComments = () => {
    const {id} = useParams();
    const [comments, setComments] = useState([])

    useEffect(() => {
        async function fetchComments() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3000/api/posts/${id}/comments`,{
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                }
                )

                const result = await response.json();
                setComments(result);
            } catch (error) {
                
            }
        } fetchComments();
    }, []);
    
    return ( 
        <>
        <div>
            {comments.map((comment) => (
                <div key={comment.id}>
                   <h3>
                    Comment By: {comment.user.username}
                   </h3>
                   
                    <h3>
                       Comment:  {comment.textContent}
                    </h3>
                </div>
            ))}
        </div>
     
        </>
     );
}
 
export default ViewComments;