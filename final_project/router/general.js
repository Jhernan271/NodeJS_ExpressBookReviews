//Routes a general user can access

const express = require('express');
const axios = require('axios')
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

// GET THE BOOK LIST AVAILABLE IN THE SHOP
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books));
});

// GET BOOK DETAILS BY ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn; 
  if (books[isbn]) {
    res.json(books[isbn])
  } else {
    res.status(404).json({ message: "Book not found" });
  }
 });
  
// GET BOOK DETAILS BY AUTHOR
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

// GET BOOKS BY TITLE
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

// GET BOOK REVIEW
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const book = books[isbn];

  if (book) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: "Book not found. Unable to find reviews."})
  }
});

// Fetch Book List with Axios
async function fetchBookListWithAxios() {
  try {
    const response = await axios.get('http://localhost:4000/');
    console.log("Books retrieved successfully with Async-Await:", response.data);
  } catch (error) {
    console.error("Error retrieving books with Async-Await:", error.message);
  }
}

// Fetch book details by ISBN with Axios
async function getBookDetails(isbn) {
  const apiUrl = `http://localhost:4000/isbn/${isbn}`;
  try {
      const response = await axios.get(apiUrl);
      console.log('Book Details:', response.data);
  } catch (error) {
      console.error('Error fetching book details:', error);
  }
}

// Function to get books by author
async function getBooksByAuthor(author) {
  const apiUrl = `http://localhost:4000/author/${author}`; 
  try {
      const response = await axios.get(apiUrl);
      console.log('Books by Author:', response.data); 
  } catch (error) {
      if (error.response) {
          console.error('Error Response:', error.response.data.message);
      } else if (error.request) {
          console.error('Error Request:', error.request);
      } else {
          console.error('Error Message:', error.message);
      }
  }
}

// Function to get a book by its title
async function getBookByTitle(title) {
  const apiUrl = `http://localhost:4000/title/${title}`;
  try {
      const response = await axios.get(apiUrl);
      console.log('Book Details:', response.data);
  } catch (error) {
      if (error.response) {
          console.error('Error Response:', error.response.data.message);
      } else if (error.request) {
          console.error('Error Request:', error.request);
      } else {
          console.error('Error Message:', error.message);
      }
  }
}

getBookByTitle('The Divine Comedy');



module.exports.general = public_users;
