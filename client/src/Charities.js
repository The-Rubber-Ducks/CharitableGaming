import {useState, useEffect} from 'react';
import CharityList from './CharityList';
const Charities = () => {
    const [ searchTerm, setSearchTerm ] = useState("");
    const [ searchResults, setSearchResults ] = useState([]);

    // fetch list of all charities
    // const { data: charities, isPending, error } = useFetch('http://localhost:8000/charities');
    const [charities, setCharities] = useState(null);
    const [charitiesPending, setCharitiesPending] = useState(true);
    const [charitiesError, setCharitiesError] = useState(null);

    // user info
    const currentUserID = 1; // dummy data
    const [userID, setUserID] = useState(null);
    const [username, setUsername] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [createdAt, setCreatedAt] = useState(null); 
    const [charityPoints, setCharityPoints] = useState(null);
    const [userRegion, setUserRegion] = useState(null);
    const [selectedCharity, setSelectedCharity] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8000/users/${currentUserID}`)
            .then(res => {
                if (!res.ok) throw("Error fetching data for charities");
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
                setCharitiesPending(false);
                setCharitiesError(null);
            })
            .catch(err => {
                setCharitiesError(err.message);
                setCharitiesPending(false);
            })

        fetch('http://localhost:8000/charities')
        .then(res => {
            return res.json();
        })
        .then(charities => {
            setCharities(charities);
            setSearchResults(charities);
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

    const handleSearch = (searchTerm) => {
        setSearchTerm(searchTerm);
        if (searchTerm !== "") {
            const newCharityList = charities.filter((charity) => {
                return charity.name.toLowerCase().includes(searchTerm.toLowerCase());
            });
            setSearchResults(newCharityList);
            
        } else {
            setSearchResults(charities);
        }
    };

    return (  
        <div className="content">
            <h2>Charities List</h2>
            { charitiesError && <div className="">{ charitiesError }</div> }
            { charitiesPending && <div className="">Loading...</div> }
            { selectedCharity && charities && 
            <CharityList 
                // charities={ (searchResults.length < 1) ? charities : searchResults } 
                charities={ searchResults }
                handleUpdate={ handleUpdate }  
                selectedCharity={ selectedCharity } 
                searchTerm={ searchTerm } 
                handleSearch={ handleSearch }
            /> }
        </div>
    );
}
 
export default Charities;