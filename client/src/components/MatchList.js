import ListGroup from 'react-bootstrap/ListGroup';
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroupItem from 'react-bootstrap/esm/ListGroupItem';

const MatchList = ({ matches }) => {
    matches.forEach(match => {
        let factor;
        (match.win) ? factor = 2 : factor = 1; 
        match.charityPoints = factor*(2*match.kills + match.assists - match.deaths)
        if (match.charityPoints < 0) match.charityPoints = 0;
    })

    const imageSize = "30px";
    return (
      <ListGroup className="match-list-container">
          {matches.map((match, i) => ( 
            <ListGroup.Item key={i} className={match.win ? "victory" : "defeat"}>
                <Row>
                    <Col className="stat-container win-loss">
                        {match.win ? "VICTORY" : "DEFEAT"} 
                    </Col>
                    <Col className="stat-container">
                        <img 
                            src="kill.png" 
                            width={imageSize}
                            height={imageSize}
                            alt="Logo" 
                            className="stat-logo"
                        />
                        {match.kills} { (match.kills !== 1) ? "kills" : "kill"}
                    </Col>
                    <Col className="stat-container">
                        <img 
                                src="death.png" 
                                width={imageSize}
                                height={imageSize}
                                alt="Logo" 
                                className="stat-logo"
                        />
                        {match.deaths} { (match.deaths !== 1) ? "deaths" : "death"}
                        </Col>
                    <Col className="stat-container">
                        <img 
                            src="assist.png" 
                            width={imageSize}
                            height={imageSize}
                            alt="Logo" 
                            className="stat-logo"
                        />
                        {match.assists} { (match.assists !== 1) ? "assists" : "assist"}
                    </Col>
                    <Col className="stat-container">+ {match.charityPoints} CP</Col>
                </Row>

            </ListGroup.Item>
          ))}
      </ListGroup>
    )
  }
 
export default MatchList;