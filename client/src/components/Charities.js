import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import {useState, useEffect} from 'react';
import CharityList from './CharityList';

const Charities = () => {
    const [ searchTerm, setSearchTerm ] = useState("");
    const [ searchResults, setSearchResults ] = useState([]);

    // fetch list of all charities
    const [charities, setCharities] = useState(null);
    const [charitiesPending, setCharitiesPending] = useState(true);
    const [charitiesError, setCharitiesError] = useState(null);

    // user info
    const [selectedCharity, setSelectedCharity] = useState(null);

    useEffect(() => {
        fetch(`https://charitable-gaming-server.herokuapp.com/api/get_user_data`)
            .then(res => {
                if (!res.ok) throw("Error fetching data for user");
                return res.json();
            })
            .then(user => {
                setSelectedCharity(user.charity);
                setCharitiesPending(false);
                setCharitiesError(null);
            })
            .catch(err => {
                console.log("can't get user data")
                setCharitiesError(err.message);
                setCharitiesPending(false);
            })

        fetch("https://charitable-gaming-server.herokuapp.com/api/get_all_charities")
        .then(res => {
            return res.json();
        })
        .then(charities => {
            setCharities(charities);
            setSearchResults(charities);
        })
    }, []);

    const handleUpdate = (name) => {
        setSelectedCharity(name);
        fetch("https://charitable-gaming-server.herokuapp.com/api/set_charity", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "charity_name": name
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
        <Container fluid="lg" className="content mb-5">
            <Row className="mt-5 mb-3 text-center">
                <h2>Charities List</h2>
            </Row>
            { charitiesError && <div className="network-error-msg">{ charitiesError }</div> }
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
        </Container>
    );
}
 
export default Charities;