import Button from 'react-bootstrap/Button';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Accordion from "react-bootstrap/Accordion";
import { useState, useEffect} from 'react';

const CharityList = ({ charities, handleUpdate, selectedCharity }) => {

    return (  
        <Container className="charities-table centered">
            {charities.map(charity => (
                <Row className="charity-info" key = { charity.id }>
                    <Col xs={8} className="charity-primary-info"> 
                        <h2>{ charity.name }</h2> 
                        <p>{ charity.description }</p>
                    </Col>
                    <Col xs={3} className="charity-secondary-info"l>
                        <p>Founded { charity.year }</p>
                        <p>{ charity.location }</p>  
                    </Col>
                    <Col xs={1} className="select-charity-btn"> 
                        <Button variant={(charity.id === selectedCharity) ? "primary" : "warning"}
                                className="charity-btn"
                                onClick={() => {
                                    handleUpdate(charity.id);
                
                                }}>
                            {(charity.id === selectedCharity) ? "Selected" : "Select"}
                            </Button>
                    </Col>
                </Row>
            ))}
        </Container>
    );
};
 
export default CharityList;