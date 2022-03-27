import ListGroup from 'react-bootstrap/ListGroup';
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const MatchList = ({ title, matches }) => {
    return (  
        <Container className="match-list-container">
            <ListGroup>
                {matches.map(match => (
                    <ListGroup.Item className="">
                        <div className="kills">
                            { match.kills }
                        </div>
                        <div className="deaths">
                            { match.deaths }
                        </div>
                        <div className="assists">
                            { match.assists }
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
}
 
export default MatchList;