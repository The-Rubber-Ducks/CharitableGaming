import Button from 'react-bootstrap/Button';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useState, useEffect, useRef } from 'react';

const CharityList = ({ charities, handleUpdate, selectedCharity, searchTerm, handleSearch }) => {
    const inputElement = useRef("");
    const getSearchTerm = () => {
        handleSearch(inputElement.current.value);
    };

    return (  
        <Container className="charities-table centered">
            <InputGroup>
            <Form.Control 
                ref={ inputElement }
                className="charity-filter mx-3 mt-3" 
                type="text" 
                placeholder="Search Charities" 
                value={ searchTerm } 
                onChange={ getSearchTerm }
            />
            </InputGroup>
            { (charities.length == 0) && <Row className="justify-content-center pt-2 pb-3">No results found.</Row>}

            {/* Iterate through charities list and output to table */}
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
                        <Button 
                                variant={(charity.id === selectedCharity) ? "primary" : "warning"}
                                className={(charity.id === selectedCharity) ? "selected" : ""}
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