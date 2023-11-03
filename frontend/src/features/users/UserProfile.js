import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { useGetUserByUsernameQuery, useUpdateUserMutation } from './usersApiSlice';

const UserProfile = () => {
  const { id, username } = useAuth();
  const { data: user, error, isLoading } = useGetUserByUsernameQuery(username);
  const [updateUser] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    pwd: '',
  });

  useEffect(() => {
    if (user) {
      // If user data is available, set the form data
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        pwd: '', // Add other fields as needed
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
      console.error('Update error:', error);
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
    <div>
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
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
          <label htmlFor="username">Username:</label>
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
          <label htmlFor="email">Email:</label>
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
          <label htmlFor="pwd">Password:</label>
          <input
            type="password"
            id="pwd"
            name="pwd"
            value={formData.pwd}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UserProfile;
