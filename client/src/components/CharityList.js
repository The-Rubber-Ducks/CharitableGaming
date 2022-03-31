import Button from 'react-bootstrap/Button';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const CharityList = ({ charities, handleUpdate, selectedCharity, searchTerm, handleSearch }) => {
    const inputElement = useRef("");
    const getSearchTerm = () => {
        handleSearch(inputElement.current.value);
    };

    return (  
        <Container className="charities-page-table mx-3">
                <InputGroup className="charity-filter mx-3 mt-3">
                    <Form.Control 
                        ref={ inputElement }
                        className="shadow-none"
                        type="text" 
                        placeholder="Search Charities" 
                        value={ searchTerm } 
                        onChange={ getSearchTerm }
                        aria-describedby="magnifying-glass"
                    />
                    <InputGroup.Text id="magnifiying-glass">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </InputGroup.Text>
                </InputGroup>

            { (charities.length === 0) && <Row className="justify-content-center pt-2 pb-3">No results found.</Row>}

            {/* Iterate through charities list and output to table */}
            {charities.map((charity) => (
                <Row className="charity-info" key = {charity.name}>
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
                                variant={(charity.name === selectedCharity) ? "primary" : "warning"}
                                className={(charity.name === selectedCharity) ? "selected" : ""}
                                onClick={() => {
                                    handleUpdate(charity.name);
                                }}>
                            {(charity.name === selectedCharity) ? "Selected" : "Select"}
                        </Button>                        
                    </Col>
                </Row>
            ))}
        </Container>
    );
};
 
export default CharityList;