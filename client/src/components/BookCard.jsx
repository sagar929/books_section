import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Star } from 'lucide-react';
import StarRating from './StarRating';

const BookCard = ({ book }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {book.title}
            </h3>
            <p className="text-indigo-600 font-medium">by {book.author}</p>
          </div>
          <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {book.genre}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {book.description}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <StarRating rating={book.averageRating || 0} readonly />
          <span className="ml-2 text-sm text-gray-500">
            ({book.totalReviews || 0} reviews)
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{book.publishedYear}</span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{book.addedBy?.name || 'Unknown'}</span>
            </div>
          </div>
          
          <Link
            to={`/books/${book._id}`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;