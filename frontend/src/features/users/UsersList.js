import { useGetUsersQuery } from "./usersApiSlice"
import User from './User'
import NavBar from "../../components/Navbar_logon"
import Particle from "../../components/Particle"
import { Container } from "react-bootstrap"
import { Col } from "react-bootstrap"
import { Row } from "react-bootstrap"

const UsersList = () => {

    const {
        data: users,
        isLoading,
        isSuccess,
        isError
    } = useGetUsersQuery(undefined, {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p>Not Currently Available</p>
    }

    if (isSuccess) {

        const { ids } = users

        const tableContent = ids?.length
            ? ids.map(userId => <User key={userId} userId={userId} />)
            : null

        content = (
            <><NavBar />
                <Container fluid className="home-section" id="home">
                    <Particle />
                    <Container>
                        <Row>
                            <Col md={7} className="home-header">
                                <h1 style={{ paddingBottom: 15, color: "white" }} className="heading">
                                    Users Management Section {" "}
                                </h1>
                            </Col>
                        </Row>
                    </Container>
                </Container>
                <Container>
                    {/* First Row */}
                    <Row className="justify-content-md-center">
                        <Col sm={10} md={10} lg={10} style={{ padding: "20px" }}>
                            <table className="table table--users">
                                <thead className="table__thead">
                                    <tr>
                                        <th scope="col" className="table__th user__username">Username</th>
                                        <th scope="col" className="table__th user__roles">Roles</th>
                                        <th scope="col" className="table__th user__edit">Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableContent}
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }

    return content
}
export default UsersList