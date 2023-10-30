import React, { useState } from "react";
import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User";
import NavBar from "../../components/Navbar_logon";
import Particle from "../../components/Particle";
import { Container, Col, Row, Pagination, Form } from "react-bootstrap";

const UsersList = () => {
    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
    } = useGetUsersQuery(undefined, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(9);

    let content;

    if (isLoading) content = <p>Loading...</p>;
    if (isError) content = <p>Not Currently Available</p>;

    if (isSuccess) {
        const { ids, entities } = users;
        const filteredIds = ids.filter((id) => {
            const user = entities[id];
            return (
                (user.username?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
                (user.email?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
                (user.name?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
                (user.roles?.toLowerCase() ?? "").includes(searchQuery.toLowerCase())
            );
        });

        const indexOfLastUser = currentPage * usersPerPage;
        const indexOfFirstUser = indexOfLastUser - usersPerPage;
        const currentUsers = filteredIds.slice(indexOfFirstUser, indexOfLastUser);

        const tableContent = currentUsers.map((userId) => (
            <User key={userId} userId={userId} />
        ));

        const totalPages = Math.ceil(filteredIds.length / usersPerPage);
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <Pagination.Item key={i} active={i === currentPage} onClick={() => setCurrentPage(i)}>
                    {i}
                </Pagination.Item>
            );
        }

        content = (
            <>
                <NavBar />
                <Container fluid className="home-section" id="home">
                    <Particle />
                    <Container>
                        <Row>
                            <Col md={7} className="home-header">
                                <h1
                                    style={{ paddingBottom: 15, color: "white" }}
                                    className="heading"
                                >
                                    Users Management Section
                                </h1>
                            </Col>
                        </Row>
                    </Container>
                </Container>
                <Container>
                    <Row className="justify-content-md-center">
                        <Col sm={10} md={10} lg={10} style={{ padding: "20px" }}>
                            <Form.Group controlId="searchQuery">
                                <Form.Control
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </Form.Group>
                            <div className="table-responsive" style={{ marginTop: "20px" }}>
                                <table className="table table--users">
                                    <thead className="table__thead">
                                        <tr>
                                            <th scope="col" className="table__th user__username">Username</th>
                                            <th scope="col" className="table__th user__email">Email</th>
                                            <th scope="col" className="table__th user__name">Name</th>
                                            <th scope="col" className="table__th user__roles">Roles</th>
                                            <th scope="col" className="table__th user__edit">Edit</th>
                                            <th scope="col" className="table__th user__delete">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>{tableContent}</tbody>
                                </table>
                            </div>
                            <Pagination>{pageNumbers}</Pagination>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }

    return content;
};

export default UsersList;
