const express = require('express');
const Book = require('../models/BookModel');
const auth = require('../middlewares/auth');

const router = express.Router();

// --- SPECIFIC ROUTES (MUST BE FIRST) ---

// GET all books
router.get("/all", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const books = await Book.find().populate('addedBy', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalBooks = await Book.countDocuments();
    const totalPages = Math.ceil(totalBooks / limit);
    res.status(200).json({ success: true, currentPage: page, totalPages, books });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching all books", error: error.message });
  }
});

// GET current user's books
router.get("/user/me", auth, async (req, res) => {
    try {
      const books = await Book.find({ addedBy: req.user.userId }).populate('addedBy', 'name').sort({ createdAt: -1 });
      res.status(200).json({ success: true, books });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching user books", error: error.message });
    }
});

// POST a new book
router.post("/add", auth, async (req, res) => {
  try {
    const { title, author, description, genre, publishedYear } = req.body;
    const newBook = new Book({ title, author, description, genre, publishedYear, addedBy: req.user.userId });
    await newBook.save();
    res.status(201).json({ success: true, message: "Book added", book: newBook });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding book", error: error.message });
  }
});

// PATCH (update) a book
router.patch("/edit/:id", auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });
    if (book.addedBy.toString() !== req.user.userId) return res.status(403).json({ success: false, message: "Not authorized" });
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, message: "Book updated", book: updatedBook });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating book", error: error.message });
  }
});

// DELETE a book
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });
    if (book.addedBy.toString() !== req.user.userId) return res.status(403).json({ success: false, message: "Not authorized" });
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting book", error: error.message });
  }
});

// --- GENERIC /:id ROUTE (MUST BE LAST) ---

// GET a single book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'name');
    if (!book) return res.status(404).json({ success: false, message: "Book not found" });
    res.status(200).json({ success: true, book: book });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching book", error: error.message });
  }
});

module.exports = router;