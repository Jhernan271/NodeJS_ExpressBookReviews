//Routes for authorized user

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const new_users = require('./booksdb.js')

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required"})
  }
  if (!new_users[username]) {
    return res.status(401).json({ message: "Username does not exist"})
  }
  if (new_users[username].password !== password) {
    return res.status(401).json({ message: "Invalid username or password"})
  }
  const secretKey = "yourSecretKey";
  const token = jwt.sign({ username }, secretKey, { expiresIn: "1h"});

  return res.status(200).json({ message: "Login successful", token })
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  console.log("Entering the /auth/review/:isbn endpoint");

  const isbn = req.params.isbn; // Retrieve ISBN from the URL
  const review = req.query.review; // Retrieve review from the query parameters

  if (!isbn) {
      return res.status(400).json({ message: "ISBN is required" });
  }

  const token = req.headers['authorization'];
  if (!token || !token.startsWith("Bearer ")) {
      console.log("No token or invalid format");
      return res.status(403).json({ message: "Unauthorized access" });
  }

  try {
      const extractedToken = token.split(" ")[1];
      const decoded = jwt.verify(extractedToken, "yourSecretKey");
      const username = decoded.username; // Extract username from the token payload

      console.log("Decoded token:", decoded);

      // Check if the book exists
      if (!books[isbn]) {
          console.log(`Book with ISBN ${isbn} not found`);
          return res.status(404).json({ message: "Book not found" });
      }

      // Check if a review was provided
      if (!review) {
          console.log("No review text provided");
          return res.status(400).json({ message: "Review text is required" });
      }

      // Add or update the review
      if (!books[isbn].reviews) {
          books[isbn].reviews = {};
      }
      books[isbn].reviews[username] = review; // Add or update the review

      console.log(`Review added/modified for ISBN ${isbn} by ${username}: ${review}`);

      return res.status(200).json({
          message: "Review added/modified successfully",
          reviews: books[isbn].reviews,
      });
  } catch (error) {
      console.log("Error verifying token:", error.message);
      return res.status(403).json({ message: "Invalid or expired token" });
  }
});


// Endpoint for deleting a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  console.log("Entering the /auth/review/:isbn DELETE endpoint");

  const isbn = req.params.isbn; 
  const token = req.headers['authorization']; 

  if (!token || !token.startsWith("Bearer ")) {
      console.log("No token or invalid format");
      return res.status(403).json({ message: "Unauthorized access" });
  }

  try {
      const extractedToken = token.split(" ")[1]; 
      const decoded = jwt.verify(extractedToken, "yourSecretKey"); 
      const username = decoded.username; 

      console.log("Decoded token:", decoded);

      if (!books[isbn]) {
          console.log(`Book with ISBN ${isbn} not found`);
          return res.status(404).json({ message: "Book not found" });
      }

      if (!books[isbn].reviews || !books[isbn].reviews[username]) {
          console.log(`No review found for user ${username} on book with ISBN ${isbn}`);
          return res.status(404).json({ message: "No review found to delete" });
      }

      delete books[isbn].reviews[username];
      console.log(`Review deleted for ISBN ${isbn} by user ${username}`);

      return res.status(200).json({
          message: "Review deleted successfully",
          reviews: books[isbn].reviews, // Return updated reviews for the book
      });

  } catch (error) {
      console.log("Error verifying token:", error.message);
      return res.status(403).json({ message: "Invalid or expired token" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
