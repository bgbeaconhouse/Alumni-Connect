import { useEffect, useState } from "react";
import {useParams, useNavigate} from 'react-router-dom';


const ViewOwnProfile = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null)
  const {id} = useParams();
  const [ownProfile, setOwnProfile] = useState([])

useEffect(() => {
    async function fetchOwnProfile() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/api/profiles/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    console.error('Unauthorized access to view profile');
                    setError('Unauthorized access. Please log in.');
                    navigate('/');
                    return;
                } else {
                    const errorMessage = await response.text();
                    console.error('Error fetching profile:', errorMessage);
                    setError(`Failed to fetch your profile: ${errorMessage}`);
                    return;
                }
            }

            const result = await response.json();
            setOwnProfile(result);

        } catch (error) {
            console.error('Error fetching profile:', error);
                setError('Failed to fetch profile. Please check your network connection.');
        }
    }
    fetchOwnProfile();
}, [id, navigate ]);



    return ( 
      <div>
        {ownProfile && (
            <div>
                <h3>
                    {ownProfile.firstName} {ownProfile.lastName}
                </h3>
                <h4>
                    {ownProfile.email}
                </h4>
                <h4>
                  Year Graduated:  {ownProfile.yearGraduated}
                </h4>
                <h4>
                    Username: {ownProfile.username}
                </h4>
            </div>
        )}
      </div>
     );
}
 
export default ViewOwnProfile;