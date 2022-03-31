import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import Container from "react-bootstrap/Container";

const Footer = () => {
  return (  
    <footer className="footer">
      <Container className="footer-container">
        <div className="logo-container">
          <img className="logo" src="logo-footer.svg" alt="logo" />
        </div>
        <div className="copyright">
          <div className="copyright-container">
            <p>
              Copyright© CharitableGaming
            </p>
            <a href="https://github.com/The-Rubber-Ducks/CharitableGaming" target="_blank">
              <FontAwesomeIcon icon={faGithub} />
            </a>
          </div>
        </div>
        <div className="temp"></div>
      </Container>

    </footer>
  );
}
 
export default Footer;