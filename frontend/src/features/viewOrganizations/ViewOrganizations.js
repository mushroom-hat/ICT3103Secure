import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../../components/Particle";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { CgWebsite } from "react-icons/cg";
import hopfulImg from "../../Assets/Organisation/HopefulHeartsFoundation.png";
import greenEarthImg from "../../Assets/Organisation/GreenEarthAlliance.png";
import helpingHandsImg from "../../Assets/Organisation/HelpingHandsInitiative.png"; 
import youthEmpowermentImg from "../../Assets/Organisation/YouthEmpowerment.png";


const Categories = [
  { categoryName: "Healthcare", isChecked: false },
  { categoryName: "Community", isChecked: false },
  { categoryName: "Environment", isChecked: false },
  { categoryName: "Education", isChecked: false },
];

const OrganizationsData = [
  {
    organizationName: "Hopeful Hearts Foundation",
    description:
      "At Hopeful Hearts Foundation, our mission is to bring positive change to the lives of those in need and create a brighter future for our communities. We believe in the power of compassion, generosity, and unity to make the world a better place.",
    category: "Healthcare",
    imagePath: hopfulImg
  },
  {
    organizationName: "Helping Hands Initiative",
    description:
      "Helping Hands Initiative is dedicated to providing assistance and support to underserved communities around the world. Together, we can make a difference and build a more inclusive and equitable society.",
    category: "Community",
    imagePath: helpingHandsImg
  },
  {
    organizationName: "Green Earth Alliance",
    description:
      "The Green Earth Alliance is committed to environmental conservation and sustainable practices. Our goal is to protect our planet and promote eco-friendly solutions for a better future.",
    category: "Environment",
    imagePath: greenEarthImg
  },
  {
    organizationName: "Youth Empowerment Network",
    description:
      "The Youth Empowerment Network focuses on empowering young people by providing them with the resources and opportunities they need to thrive. Join us in shaping the leaders of tomorrow.",
    category: "Education",
    imagePath: youthEmpowermentImg
  },
];

const ViewOrganizations = () => {
  const [allCategories, setAllCategories] = useState(Categories);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleChange = (categoryName) => {
    console.log("Category Name:" + categoryName)
    // Change the corresponding isChecked in the list of all categories
    setAllCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.categoryName === categoryName
          ? { ...category, isChecked: !category.isChecked }
          : category
      )
    );
  }

  useEffect(() => {
    const selectedCategoryNames = allCategories
      .filter((category) => category.isChecked)
      .map((category) => category.categoryName);

    setSelectedCategories(selectedCategoryNames);
  }, [allCategories]);

  useEffect(() => {
    console.log("Selected Categories:", selectedCategories);
  }, [selectedCategories]);

  return (
    <Container fluid className="project-section">
      <Particle />
      <Navbar />
      <Container>
        <h1 className="project-heading" style={{ textAlign: "center" }}>
          Organizations
        </h1>
      </Container>
      <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
        <Col md={4} className="" style={{ color: "white" }}>
          <h2 className="filters-header">Search by category</h2>
          <div className="filters-list">
            {allCategories.map((category) => (
              <label key={category.categoryName} className="checkbox">
                <input
                  type="checkbox"
                  checked={category.isChecked}
                  onChange={() => handleChange(category.categoryName)}
                  style={{
                    zIndex: 1000, // make sure it's above other elements
                    position: 'relative', // set the positioning
                    width: '20px', // set a specific width
                    height: '20px' // set a specific height
                  }}
                />
                <span className="category-text" style={{ marginLeft: "10px", marginRight: "10px" }}>
                  {category.categoryName}
                </span>
              </label>
            ))}
          </div>
        </Col>
      </Row>

      <Row>
        {OrganizationsData.filter(
          (organization) =>
            selectedCategories.length === 0 ||
            selectedCategories.includes(organization.category)
        ).map((organization) => (
          <Col sm={10} md={4} lg={4} key={organization.organizationName}>
            <Card className="project-card-view organization-card">
              <Card.Img variant="top" src={organization.imagePath} alt="card-img" />
              <Card.Body>
                <Card.Title>{organization.organizationName}</Card.Title>
                <Card.Text style={{ textAlign: "justify" }}>
                  {organization.description}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>

  );
}

export default ViewOrganizations;
