// server/models/bookModel.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true,
    enum: [
      'Fiction',
      'Non-Fiction', 
      'Mystery',
      'Romance',
      'Science Fiction',
      'Fantasy',
      'Biography',
      'History',
      'Self-Help',
      'Business',
      'Technology',
      'Health',
      'Travel',
      'Cooking',
      'Art',
      'Religion',
      'Politics',
      'Philosophy',
      'Poetry',
      'Drama',
      'Horror',
      'Thriller',
      'Adventure',
      'Children',
      'Young Adult',
      'Other'
    ]
  },
  publishedYear: {
    type: Number,
    required: true,
    min: 1000,
    max: new Date().getFullYear()
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);