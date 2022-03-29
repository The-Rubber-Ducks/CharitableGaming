import { useState, useEffect } from 'react';
import MatchList from "./MatchList";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
const Dashboard = () => {

    const [matches, setMatches] = useState([]);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        fetch('https://charitable-gaming-server.herokuapp.com/api/get_user_league_games')
            .then(res => {
                return res.json();
            })
            .then(data => {
                const stats = Object.values(data);
                setMatches(stats);
            });
    }, [update]);

    return (  
        <div className="main-dashboard-container">
            <div className="dashboard-left-col">
                <div className="charity-stats-overview"></div>
                <div className="leaderboard"></div>
            </div>
            <div className="dashboard-right-col">
                <MatchList gameTitle={"League of Legends"} matches={matches}/>
            </div>
        </div>

    );
}
 
export default Dashboard;