import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/Authcontext';
import StarRating from './StarRating';
import { Edit, Trash2, User } from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const ReviewCard = ({ review, onReviewUpdate, onReviewDelete }) => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(review.comment);
  const [editRating, setEditRating] = useState(review.rating);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateReview = async () => {
    if (!editText.trim()) {
      toast.error('Please enter a review comment');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.put(`/reviews/${review._id}`, {
        comment: editText,
        rating: editRating
      });

      if (response.data.success) {
        onReviewUpdate(response.data.review);
        setIsEditing(false);
        toast.success('Review updated successfully!');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error(error.response?.data?.message || 'Failed to update review');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.delete(`/reviews/${review._id}`);
      
      if (response.data.success) {
        onReviewDelete(review._id);
        toast.success('Review deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error(error.response?.data?.message || 'Failed to delete review');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* User Info Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-2">
            <User className="h-4 w-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              {review.user?.name || 'Anonymous User'}
            </h4>
            <p className="text-sm text-gray-500">
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>
        
        {/* Action Buttons for Review Owner */}
        {user && user.id === review.user?._id && (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              disabled={isLoading}
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={handleDeleteReview}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Rating */}
      {isEditing ? (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <StarRating
            rating={editRating}
            onRatingChange={setEditRating}
            interactive={true}
            size="lg"
          />
        </div>
      ) : (
        <div className="flex items-center mb-4">
          <StarRating rating={review.rating} interactive={false} />
          <span className="ml-2 text-sm text-gray-600">
            {review.rating}/5
          </span>
        </div>
      )}

      {/* Review Content */}
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review
            </label>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              placeholder="Write your review..."
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleUpdateReview}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Updating...' : 'Update Review'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditText(review.comment);
                setEditRating(review.rating);
              }}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="text-gray-700 leading-relaxed">
          {review.comment}
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
