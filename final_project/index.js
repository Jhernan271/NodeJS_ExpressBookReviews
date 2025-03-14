const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const new_users = require('./router/booksdb.js');

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    let token;

    // Check session for token
    if (req.session && req.session.authorization) {
        token = req.session.authorization['accessToken'];
    } else if (req.headers['authorization']) {
        // Check Authorization header for token
        if (req.headers['authorization'].startsWith("Bearer ")) {
            token = req.headers['authorization'].split(" ")[1]; // Extract token
        }
    }

    if (!token) {
        console.log("No token provided");
        return res.status(403).json({ message: "User not logged in" });
    }

    // Verify the token
    jwt.verify(token, "yourSecretKey", (err, user) => {
        if (!err) {
            console.log("Token verified successfully:", user);
            req.user = user; // Attach user information to the request
            next(); // Proceed to next middleware or route
        } else {
            console.log("JWT verification failed:", err.message);
            return res.status(403).json({ message: "User not authenticated" });
        }
    });
});
 
const PORT =4000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);


// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});