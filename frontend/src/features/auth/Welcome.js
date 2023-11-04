import { Link } from 'react-router-dom';
import NavBar from '../../components/Navbar';
import { Container, Col, Card, Row } from 'react-bootstrap';
import technoteImg from '../../Assets/Welcome/tech_notes.png';
import userImg from '../../Assets/Welcome/users.png';
import spendingImg from '../../Assets/Welcome/spendings.png';
import Particle from '../../components/Particle';
import { useSelector } from 'react-redux';

const renderCard = (link, imgSrc, title, isVisible) => {
  if (!isVisible) return null;
  return (
    <Col sm={6} md={4} lg={4} key={title} style={{ padding: "20px" }}>
      <Link to={link} className="project-card-link">
        <Card className="project-card-view organization-card text-center">
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Card.Img variant="top" src={imgSrc} alt="card-img" style={{ maxWidth: "200px", maxHeight: "200px" }} />
          </div>
          <Card.Body>
            <Card.Title>{title}</Card.Title>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );
};

const Welcome = () => {
  const { username, roles } = useSelector(state => state.auth);

  console.log("Welcome: " + username + " (" + roles + ")");

  return (
    <>
      <NavBar />
      <Container fluid className="home-section" id="home">
        <Particle />
        <Container>
          <Row>
            <Col md={7} className="home-header">
              <h1 style={{ paddingBottom: 15, color: "white" }} className="heading">
                Welcome to main portal!
                <span className="wave" role="img" aria-labelledby="wave">👋🏻</span>
              </h1>
            </Col>
          </Row>
        </Container>
      </Container>
      <Container>
        <Row>
          {renderCard('/dash/users', userImg, 'Manage Users', roles === 'Admin')}
          {renderCard('/dash/cashflow', userImg, 'Manage Cashflow', roles === 'Organization')}
          {renderCard('/dash/articles/new', userImg, 'Write Article', roles === 'Organization')}
          {renderCard('/dash/donations/new', userImg, 'Donate Now!', roles === 'Donator')}
          {renderCard('/organizations', userImg, 'What Are They Up To?', roles === 'Donator')}
          {renderCard('/dash/spending', userImg, 'Organization Spending', roles === 'Donator' || roles === 'Organization')}

          {/* You can add more cards here if needed */}
        </Row>
      </Container>
    </>
  );
};

export default Welcome;
