import { useState, useEffect } from 'react';
import MatchList from "./MatchList";
const Dashboard = () => {

    const [matches, setMatches] = useState([]);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        fetch('http://localhost:8000/get_user_league_games')
            .then(res => {
                return res.json();
            })
            .then(data => {
                setMatches(data);
            });
    }, [update]);

    return (  
        <div className="main-dashboard-container">
            <div className="dashboard-left-col">
            </div>
            <div className="dashboard-right-col">
                <MatchList gameTitle={"League of Legends"} matches={matches}/>
            </div>
        </div>
    );
}
 
export default Dashboard;