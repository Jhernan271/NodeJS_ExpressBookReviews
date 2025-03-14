//Routes a general user can access

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const new_users = require('./booksdb.js')


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password ) {
    return res.status(400).json({ message: "Username and password are required"});
  }

  if (new_users[username]) {
    return res.status(409).json({ message: "Username already exists" })
  }

  new_users[username] = { password };
  console.log("Registered users:", new_users)
  return res.status(201).json({ message: "User registered successfully" })
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn; 
  if (books[isbn]) {
    res.json(books[isbn])
  } else {
    res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorParam = req.params.author;
  const matchingBooks = []

  for (const key in books) {
    if (books[key].author === authorParam) {
      matchingBooks.push(books[key]);
    }
  }
  if (matchingBooks.length > 0) {
    res.json(matchingBooks)
  } else {
    res.status(404).json({ message: "No books found for the given author" })
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const titleParam = req.params.title;
  let matchingBook = null; 

  for (const key in books) {
      if (books[key].title === titleParam) {
          matchingBook = books[key]; 
          break;
      }
  }
  if (matchingBook) {
      res.json(matchingBook);
  } else {
      res.status(404).json({ message: "Book not found with the given title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const book = books[isbn];

  if (book) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: "Book not found. Unable to find reviews."})
  }
});

module.exports.general = public_users;
