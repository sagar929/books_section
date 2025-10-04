const express = require('express');
const Review = require('../models/ReviewModel');
const Book = require('../models/BookModel');
const auth = require('../middlewares/auth');

const router = express.Router();


router.post("/book/:bookId", auth, async (req, res) => {
  const { rating, comment } = req.body;
  const bookId = req.params.bookId;

  try {
    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Create new review
    const newReview = new Review({
      bookId: bookId,
      userId: req.user.userId,
      rating: rating,
        reviewText: comment,
    });

    await newReview.save();
    // After saving review, update book's average rating
const reviews = await Review.find({ bookId });
const totalReviews = reviews.length;
const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

await Book.findByIdAndUpdate(bookId, {
  averageRating: avgRating,
  totalReviews: totalReviews
});

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: newReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding review",
      error: error.message
    });
  }
});

// Get reviews for a book
router.get("/book/:bookId", async (req, res) => {
  const bookId = req.params.bookId;

  try {
    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Get reviews for the book
    const reviews = await Review.find({ bookId: bookId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      reviews: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message
    });
  }
});

// Get user's own reviews - PROTECTED ROUTE
router.get("/user/me", auth, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.userId })
      .populate('bookId', 'title author')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      reviews
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user reviews",
      error: error.message
    });
  }
});

// Update review - PROTECTED ROUTE (Owner only)
router.put("/:id", auth, async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const reviewId = req.params.id;

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user.Id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this review"
      });
    }

    // Update the review
    review.comment = comment;
    review.rating = rating;
    await review.save();

    // Recalculate book's average rating
    // const book = await Book.findById(review.book);
    const reviews = await Review.find({ bookId: review.bookId });
    const avgRating = reviews.reduce((sum, rev) => sum + rev.rating, 0) / reviews.length;
    
    book.averageRating = avgRating;
    await book.save();

    // Populate user data for response
    await review.populate('user', 'name email');
    
    res.status(200).json({
      success: true,
      review,
      message: "Review updated successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating review",
      error: error.message
    });
  }
});

// Delete review - PROTECTED ROUTE (Owner only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const reviewId = req.params.id;

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review"
      });
    }

    const bookId = review.book;

    // Delete the review
    await Review.findByIdAndDelete(reviewId);

    // Recalculate book's average rating
    const book = await Book.findById(bookId);
    const remainingReviews = await Review.find({ book: bookId });
    
    if (remainingReviews.length > 0) {
      const avgRating = remainingReviews.reduce((sum, rev) => sum + rev.rating, 0) / remainingReviews.length;
      book.averageRating = avgRating;
    } else {
      book.averageRating = 0;
    }
    
    await book.save();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error.message
    });
  }
});

module.exports = router;