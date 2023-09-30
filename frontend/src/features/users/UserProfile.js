import React, { useState } from 'react';
import Navbar from '../../components/Navbar';

const UserProfile = () => {
    // Mock state for user data
    const [user, setUser] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        location: 'Foo City, CA',
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <section className="user-profile">
            <Navbar />

            <header>
                <h1>User Profile</h1>
            </header>

            <main className="profile__main">
                <form>
                    <div className="form-group">
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Location:</label>
                        <input
                            type="text"
                            name="location"
                            value={user.location}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button type="submit">Save Changes</button>
                </form>
            </main>

            <footer>
                <p>© 2023 Donation Centre. All rights reserved.</p>
            </footer>
        </section>
    );
}

export default UserProfile;
