// Set the test environment
process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Require the dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // Import the server object
chai.should();
chai.use(chaiHttp);

// Authentication & Authorization tests
describe("Authentication", () => {
  // Variables to store the token for authenticated requests
  let authToken;

  before((done) => {
    // Create a JWT token for authentication (you may need to customize this based on your app)
    authToken = jwt.sign({
      "UserInfo": {
          "username": "Tester",
          "roles": "Admin"
      }
    }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    done();
  });

  describe("Test Authentication Middleware", () => {
    it("It should return a 401 Unauthorized for requests without a token", (done) => {
      chai.request(server)
        .get("/users")
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it("It should allow access to protected routes with a valid token", (done) => {
      chai.request(server)
        .get("/users")
        .set("Authorization", `Bearer ${authToken}`)
        .end((err, res) => {
          res.should.have.status(202); 
          done();
        });
    });

    it("It should return a 403 Forbidden for requests with an invalid token", (done) => {
      const invalidToken = "invalid-token"; // Replace with an invalid token
      chai.request(server)
        .get("/users")
        .set("Authorization", `Bearer ${invalidToken}`)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });

    // Authorization Tests 
    describe("Get Users", () => {
      describe("Test GET route /users", () => {
        it("It should return all Users", (done) => {
          chai.request(server)
            .get("/users")
            .set("Authorization", `Bearer ${authToken}`)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
              done();
            });
        });
      });
    });
  });
});

after(() => {
  // Other cleanup tasks
  process.exit(); // Explicitly exit with the default exit code (0 for success)
});