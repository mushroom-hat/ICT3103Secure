import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import logo from "../Assets/logo.png";
import { Link } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineFundProjectionScreen,
} from "react-icons/ai";
import { BiDonateHeart } from "react-icons/bi";
import { BsCreditCard } from "react-icons/bs";
import { LiaDonateSolid, LiaUsersCogSolid } from "react-icons/lia";
import { FaSignInAlt } from "react-icons/fa";
import { CgFileDocument } from "react-icons/cg";
import useAuth from "../hooks/useAuth";
import { useDispatch } from 'react-redux';
import { logOut } from '../features/auth/authSlice';
import { useSendLogoutMutation } from '../features/auth/authApiSlice'

function NavBar() {
  const { roles } = useAuth();
  console.log(roles);
  const [expand, updateExpanded] = useState(false);
  const [navColour, updateNavbar] = useState(false);
  const dispatch = useDispatch();

  function scrollHandler() {
    if (window.scrollY >= 20) {
      updateNavbar(true);
    } else {
      updateNavbar(false);
    }
  }

  const [sendLogout, {
    isLoading,
    isSuccess,
    isError,
    error
}] = useSendLogoutMutation()

const handleLogout = async () => {
  try {
    const { data, error } = await sendLogout(); // Call the logout mutation and destructure the result

    if (data) {
      dispatch(logOut()); // Dispatch the logOut action if the mutation is successful
      // Perform any additional logout-related actions, such as clearing cookies or redirecting the user
    } else if (error) {
      // Handle error, e.g., display an error message
      console.error('Error logging out:', error);
    }
  } catch (error) {
    // Handle any other errors that might occur during the logout process
    console.error('Error logging out:', error);
  }
};


  window.addEventListener("scroll", scrollHandler);

  return (
    <Navbar
      expanded={expand}
      fixed="top"
      expand="md"
      className={navColour ? "sticky" : "navbar"}
    >
      <Container>
        {roles === "" ? (
          <Navbar.Brand href="/" className="d-flex">
            <img
              src={logo}
              className="img-logo"
              alt="brand"
              style={{ width: "30%", height: "30%" }}
            />
          </Navbar.Brand>
        ) : (
          <Navbar.Brand href="/dash" className="d-flex">
            <img
              src={logo}
              className="img-logo"
              alt="brand"
              style={{ width: "30%", height: "30%" }}
            />
          </Navbar.Brand>
        )}
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => {
            updateExpanded(expand ? false : "expanded");
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto" defaultActiveKey="#home">
            <Nav.Item>
              <Nav.Link as={Link} to="/" onClick={() => updateExpanded(false)}>
                <AiOutlineHome style={{ marginBottom: "2px" }} /> Home
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                data-testid="organizations-link"
                as={Link}
                to="/organizations"
                onClick={() => updateExpanded(false)}
              >
                <AiOutlineFundProjectionScreen
                  style={{ marginBottom: "2px" }}
                />{" "}
                Organizations
              </Nav.Link>
            </Nav.Item>

            {roles === "Donator" && (
              <>
                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    to="/dash/cards"
                    onClick={() => updateExpanded(false)}
                  >
                    <BsCreditCard style={{ marginBottom: "2px" }} /> Cards
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    to="/dash/donations/new"
                    onClick={() => updateExpanded(false)}
                  >
                    <BiDonateHeart style={{ marginBottom: "2px" }} /> Donate
                  </Nav.Link>
                </Nav.Item>
              </>
            )}

            {roles === "Organization" && (
              <>
                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    to="/dash/spending"
                    onClick={() => updateExpanded(false)}
                  >
                    <LiaDonateSolid style={{ marginBottom: "2px" }} /> Spending
                  </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    to="/dash/articles/new"
                    onClick={() => updateExpanded(false)}
                  >
                    <CgFileDocument style={{ marginBottom: "2px" }} /> Publish
                  </Nav.Link>
                </Nav.Item>
              </>
            )}

            {roles === "Admin" && (
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to="/dash/users"
                  onClick={() => updateExpanded(false)}
                >
                  <LiaUsersCogSolid
                    style={{ marginBottom: "2px", color: "white" }}
                  />{" "}
                  Users
                </Nav.Link>
              </Nav.Item>
            )}

            {roles !== "" && (
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to="/dash/profile"
                  onClick={() => updateExpanded(false)}
                >
                  <AiOutlineUser style={{ marginBottom: "2px" }} /> Profile
                </Nav.Link>
              </Nav.Item>
            )}

            {roles === "" ? (
              <Nav.Item>
                <Nav.Link as={Link} to="/login">
                  <FaSignInAlt style={{ marginBottom: "2px" }} /> Login
                </Nav.Link>
              </Nav.Item>
            ) : (
              <Nav.Item>
                <Nav.Link as={Link} to="/" onClick = {() => handleLogout()}>
                  <FaSignInAlt style={{ marginBottom: "2px" }}/> Logout
                </Nav.Link>
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
