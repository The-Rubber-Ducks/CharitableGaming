import {useState, useEffect} from 'react';
import CharityList from './CharityList';
import useFetch from './useFetch';
const Charities = () => {
    const currentUserID = 1;
    const { data: charities, isPending, error } = useFetch('http://localhost:8000/charities');
    const [ userID, setUserID ] = useState(null);
    const [ username, setUsername ] = useState(null);
    const [ profilePicture, setProfilePicture] = useState(null);
    const [ createdAt, setCreatedAt ] = useState(null); 
    const [ charityPoints, setCharityPoints ] = useState(null);
    const [ userRegion, setUserRegion ] = useState(null);
    const [ selectedCharity, setSelectedCharity ] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8000/users/${currentUserID}`)
            .then(res => {
                return res.json();
            })
            .then(user => {
                setUserID(user.id);
                setUsername(user.username);
                setProfilePicture(user.profile_picture);
                setCreatedAt(user.created_at);
                setCharityPoints(user.charity_points);
                setUserRegion(user.user_region);
                setSelectedCharity(user.charity);
            })
    }, []);


    const handleUpdate = (id) => {
        setSelectedCharity(id);
        fetch(`http://localhost:8000/users/${currentUserID}`, {
            method: 'PUT',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "id": userID,
                "username": username,
                "profile_picture": profilePicture,
                "created_at": createdAt,
                "charity_points": charityPoints,
                "user_region": userRegion,
                "charity": id
            })
        })
    };

    return (  
        <div className="content">
            <h2>Our Patrons</h2>
            { error && <div className="">{ error }</div> }
            { isPending && <div className="">Loading...</div> }
            { selectedCharity && charities && <CharityList charities={ charities } 
                title="Our Patrons" handleUpdate={handleUpdate} selectedCharity={selectedCharity}/> }
        </div>
    );
}
 
export default Charities;