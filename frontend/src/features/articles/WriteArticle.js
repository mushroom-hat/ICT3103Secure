import React, { useState } from 'react';
import { Container, Row, Col, Card, FormControl, Button, Form } from "react-bootstrap";
import Navbar from '../../components/Navbar';
import Particle from "../../components/Particle";
import articleImg from "../../Assets/Article/Article.png";

const WriteArticle = () => {
    const [article, setArticle] = useState({
        title: '',
        content: '',
        imageLink: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setArticle(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Article submitted:", article);
        // Here you can send the article to your backend server or handle as necessary
    };

    return (
        <Container fluid className="project-section">
            <Particle />
            <Navbar />
            <Container>
            <Card.Img 
                variant="top" 
                src={articleImg} 
                alt="card-img" 
                style={{
                    height: "30%", 
                    width: "30%", 
                    margin: "auto", 
                    display: "block"
                }} 
/>

                <h1 className="project-heading" style={{ textAlign: 'center' }}>
                    Write a New Article
                </h1>
            </Container>

            <section className="public">
                <Container>
                    <Row style={{ justifyContent: "center", padding: "10px" }}>
                        <Col sm={10} md={8} lg={6} className="project-card">
                            <Card className="article profile-update-card bg-dark text-white">
                                <Form onSubmit={handleSubmit}>
                                    <label style={{ marginTop: "20px", marginLeft: "10px", marginRight: "10px" }} htmlFor="title">Title:</label>
                                    <FormControl
                                        className="form__input"
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={article.title}
                                        onChange={handleInputChange}
                                        required
                                        style={{ marginLeft: "10px", marginRight: "10px", width: "-webkit-fill-available" }}
                                    />
                                    <label style={{ marginTop: "20px", marginLeft: "10px", marginRight: "10px" }} htmlFor="content">Content:</label>
                                    <FormControl
                                        className="form__input"
                                        as="textarea"
                                        id="content"
                                        name="content"
                                        value={article.content}
                                        onChange={handleInputChange}
                                        required
                                        style={{ marginLeft: "10px", marginRight: "10px", width: "-webkit-fill-available" }}
                                    />
                                    <label style={{ marginTop: "20px", marginLeft: "10px", marginRight: "10px" }} htmlFor="imageLink">Image Link (optional):</label>
                                    <FormControl
                                        className="form__input"
                                        type="text"
                                        id="imageLink"
                                        name="imageLink"
                                        value={article.imageLink}
                                        onChange={handleInputChange}
                                        style={{ marginLeft: "10px", marginRight: "10px", width: "-webkit-fill-available" }}
                                    />
                                    <Button
                                        className="form__submit-button btn btn-primary btn-block btn-lg"
                                        style={{
                                            display: 'block',
                                            marginTop: '10px',
                                            textAlign: 'center',
                                            marginBottom: '10px',
                                            marginLeft: 'auto',
                                            marginRight: 'auto',
                                            width: 'fit-content'
                                        }}
                                        type="submit"
                                    >
                                        Publish Article
                                    </Button>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Container>
    );
}

export default WriteArticle;
