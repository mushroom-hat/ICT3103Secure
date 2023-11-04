import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import {
  useGetUserByUsernameQuery,
  useUpdateUserMutation,
} from "./usersApiSlice";
import Particle from "../../components/Particle";
import { Container } from "react-bootstrap";
import NavBar from "../../components/Navbar";

const UserProfile = () => {
  const { id, username } = useAuth();
  const { data: user, error, isLoading } = useGetUserByUsernameQuery(username);
  const [updateUser] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    pwd: "",
  });

  useEffect(() => {
    if (user) {
      // If user data is available, set the form data
      setFormData({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        pwd: "", // Add other fields as needed
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateUser({
        id,
        ...formData,
      });
      // You can handle success or show a success message here
    } catch (error) {
      // Handle the error
      console.error("Update error:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <Container fluid className="project-section">
      <Particle />
      <NavBar />
      <Container>
        <h1 className="project-heading">View Your Profile</h1>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gridGap: "0.5rem",
            zIndex: 1,
            position: "relative",
          }}
        >
          <div>
            <label htmlFor="name" style={{ color: "white" }}>
              Name:
            </label>
          </div>
          <div>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="username" style={{ color: "white" }}>
              Username:
            </label>
          </div>
          <div>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email" style={{ color: "white" }}>
              Email:
            </label>
          </div>
          <div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="pwd" style={{ color: "white" }}>
              Password:
            </label>
          </div>
          <div>
            <input
              type="password"
              id="pwd"
              name="pwd"
              value={formData.pwd}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="rounded-button">
            Update Profile
          </button>
        </form>
      </Container>
    </Container>
  );
};

export default UserProfile;
