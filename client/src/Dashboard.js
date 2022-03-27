import { useState, useEffect } from 'react';
// import MatchList from "./MatchList";
import MatchList from "./MatchListTW";
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
        <div className="container flex w-screen m-auto">
            <div className="container flex-col w-2/5" >
                <div className="charity-stats-overview">CHARITY STATS GO HERE</div>
                <div className="leaderboard">LEADER BOARD GOES HERE </div>
            </div>
            <div className="container w-3/5 flex justify-center items-center mt-10">
                {/* <MatchList gameTitle={"League of Legends"} matches={matches}/> */}
                <MatchList gameTitle={"League of Legends"} matches={matches}/>
            </div>
        </div>
    );
}
 
export default Dashboard;