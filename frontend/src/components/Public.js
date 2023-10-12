import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Article from './Article';  // Importing the Article component

const Public = () => {
    return (
        <section className="public">
            <Navbar />

            <header>
                <h1>Welcome to <span className="nowrap">Donation Centre!</span></h1>
            </header>

            <main className="public__main">
                <p>Located in Beautiful Downtown Foo City, our Donation Centre connects generous donors with organizations in need. Make a difference today!</p>

                {/* Using the Article component */}
                <section className="articles">
                    <h2>Latest Activities!</h2>

                    <Article title="Article Title 1" content="FUCKING HELL Lorem ipsum dolor sit, amet consectetur adipisicing elit. Doloribus, at." />
                    <Article title="Article Title 2" content="Quod possimus rerum doloremque ullam sapiente ea libero tempora maxime!" />
                    <Article title="Article Title 3" content="Numquam deserunt exercitationem iusto sit asperiores officia a veniam amet." />
                </section>

            </main>

            <footer>
                <p>© 2023 Donation Centre. All rights reserved.</p>
            </footer>
        </section>
    );
}

export default Public;
