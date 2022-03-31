import { useState, useEffect } from 'react';
import MatchList from "./MatchList";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
const Dashboard = () => {

    const [matches, setMatches] = useState([]);
    const [userData, setUserData] = useState([]);
    const [leaders, setLeaders] = useState([]);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        fetch('https://charitable-gaming-server.herokuapp.com/api/get_user_league_games')
            .then(res => {
                return res.json();
            })
            .then(data => {
                const stats = Object.values(data);
                setMatches(stats);
            })
            .catch(error => {
                console.log("Error getting match data.")
            });

            fetch('https://charitable-gaming-server.herokuapp.com/api/get_user_data')
            .then(res => {
                return res.json();
            })
            .then(data => {
                setUserData(data);    
            })
            .catch(error => {
                console.log("Error getting user data.")
            });

        fetch('https://charitable-gaming-server.herokuapp.com/api/get_leaderboard?game=League_of_Legends&num_of_choices=mini')
            .then(res => {
                return res.json();
            })
            .then(data => {
                setUserData(data);    
            })  
            .catch(error => {
                console.log("Error getting leaderboard data.")
            })
        }, []);

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