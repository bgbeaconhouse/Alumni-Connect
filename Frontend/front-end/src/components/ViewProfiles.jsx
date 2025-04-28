import { useState, useEffect } from "react";

const ViewProfiles = () => {
    const [profiles, setProfiles] = useState([])
    const [error, setError] = useState(null)

useEffect(() => {
    async function fetchProfiles() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch("http://localhost:3000/api/profiles", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            const result = await response.json();
            setProfiles(result);
        } catch (error) {
            setError(error)
        }
    } fetchProfiles()
}, []);


    return ( 

        <>
        {profiles.map((profile) => (
            <div key={profile.id}> {profile.firstName}</div>
        ))}
        </>
     );
}
 
export default ViewProfiles;