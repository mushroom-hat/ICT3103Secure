import { Link } from 'react-router-dom'
import NavBar from '../../components/Navbar_logon'
import { Container } from 'react-bootstrap'
import technoteImg from '../../Assets/Welcome/tech_notes.png'
import userImg from '../../Assets/Welcome/users.png'
import spendingImg from '../../Assets/Welcome/spendings.png'
import { Col, Card } from 'react-bootstrap'
import { Row } from 'react-bootstrap'
import Particle from '../../components/Particle'


const Welcome = () => {

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    const content = (
        <><NavBar />
        <Container fluid className="home-section" id="home">
            <Particle />
            <Container>
                <Row>
                    <Col md={7} className="home-header">
                    <h1 style={{ paddingBottom: 15 , color: "white"}} className="heading">
                        Welcome to main portal!{" "}
                        <span className="wave" role="img" aria-labelledby="wave">
                        👋🏻
                        </span>
                    </h1>
                    </Col>
                </Row>
            </Container>
        </Container>
        
        <Container>
  {/* First Row */}
  <Row>
    <Col sm={6} md={4} lg={4} key="technote" style={{ padding: "20px" }}>
      <Card className="project-card-view organization-card text-center">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Card.Img variant="top" src={technoteImg} alt="card-img" style={{ maxWidth: "200px", maxHeight: "200px" }} />
        </div>
        <Card.Body>
          <Card.Title>Manage Tech Notes</Card.Title>
        </Card.Body>
      </Card>
    </Col>

    <Col sm={6} md={4} lg={4} key="technote" style={{ padding: "20px" }}>
      <Card className="project-card-view organization-card text-center">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Card.Img variant="top" src={userImg} alt="card-img" style={{ maxWidth: "200px", maxHeight: "200px" }} />
        </div>
        <Card.Body>
          <Card.Title>Manage Users</Card.Title>
        </Card.Body>
      </Card>
    </Col>

    <Col sm={6} md={4} lg={4} key="technote" style={{ padding: "20px" }}>
      <Card className="project-card-view organization-card text-center">
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Card.Img variant="top" src={spendingImg} alt="card-img" style={{ maxWidth: "200px", maxHeight: "200px" }} />
        </div>
        <Card.Body>
          <Card.Title>Manage Spendings</Card.Title>
        </Card.Body>
      </Card>
    </Col>
  </Row>

  {/* Second Row */}
  <Row>
    {/* Repeat the same structure for the second row */}
  </Row>

  {/* Third Row */}
  <Row>
    {/* Repeat the same structure for the third row */}
  </Row>

  {/* Add more rows as needed for additional cards */}
  
  <p><Link to="/dash/notes">View techNotes</Link></p>
  <p><Link to="/dash/notes/new">Add New techNote</Link></p>
  <p><Link to="/dash/users">View User Settings</Link></p>
  <p><Link to="/dash/users/new">Add New User</Link></p>
  <p><Link to="/dash/spending">View Spending</Link></p>
  <p><Link to="/dash/users">View Spending</Link></p>
  <p><Link to="/dash/spending/new">Add New Spending</Link></p>
</Container>
</>
    )

    return content
}
export default Welcome