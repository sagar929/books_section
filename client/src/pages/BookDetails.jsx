import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';
import StarRating from '../components/StarRating';
import ReviewCard from '../components/ReviewCard';
import { 
  BookOpen, 
  User, 
  Calendar, 
  Tag, 
  Edit, 
  Trash2, 
  Plus,
  Star,
  MessageCircle 
} from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ comment: '', rating: 5 });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    fetchBookDetails();
    fetchReviews();
  }, [id]);

  const fetchBookDetails = useCallback(async () => {
    try {
      const response = await api.get(`/books/${id}`);
      if (response.data.success) {
        setBook(response.data.book);
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
      toast.error('Failed to load book details');
      navigate('/');
    }
  }, [id, navigate]);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await api.get(`/reviews/book/${id}`);
      if (response.data.success) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const handleDeleteBook = async () => {
    if (!window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await api.delete(`/books/delete/${id}`);
      if (response.data.success) {
        toast.success('Book deleted successfully!');
        navigate('/');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error(error.response?.data?.message || 'Failed to delete book');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!newReview.comment.trim()) {
      toast.error('Please enter a review comment');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const response = await api.post(`/reviews/book/${id}`, {
        comment: newReview.comment,
        rating: newReview.rating
      });

      if (response.data.success) {
        setReviews([response.data.review, ...reviews]);
        setNewReview({ comment: '', rating: 5 });
        setShowReviewForm(false);
        toast.success('Review added successfully!');
        
        // Refresh book data to get updated average rating
        fetchBookDetails();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleReviewUpdate = (updatedReview) => {
    setReviews(reviews.map(review => 
      review._id === updatedReview._id ? updatedReview : review
    ));
    // Refresh book data to get updated average rating
    fetchBookDetails();
  };

  const handleReviewDelete = (reviewId) => {
    setReviews(reviews.filter(review => review._id !== reviewId));
    // Refresh book data to get updated average rating
    fetchBookDetails();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Book Not Found</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-800">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const userHasReviewed = reviews.some(review => review.user?._id === user?.id);
  const isBookOwner = user && user.id === book.createdBy?._id;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Book Details Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="md:flex">
            {/* Book Cover */}
            <div className="md:w-1/3 bg-gradient-to-br from-blue-400 to-purple-600 p-8 flex items-center justify-center">
              <div className="text-center text-white">
                <BookOpen className="h-24 w-24 mx-auto mb-4" />
                <p className="text-lg font-medium">Book Cover</p>
              </div>
            </div>

            {/* Book Information */}
            <div className="md:w-2/3 p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                  <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
                </div>
                
                {/* Action Buttons for Book Owner */}
                {isBookOwner && (
                  <div className="flex space-x-2">
                    <Link
                      to={`/books/${id}/edit`}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                    <button
                      onClick={handleDeleteBook}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Book Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <Tag className="h-5 w-5 mr-2" />
                    <span className="font-medium">Genre:</span>
                    <span className="ml-2">{book.genre}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span className="font-medium">Added:</span>
                    <span className="ml-2">{formatDate(book.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <User className="h-5 w-5 mr-2" />
                    <span className="font-medium">Added by:</span>
                    <span className="ml-2">{book.createdBy?.name || 'Unknown User'}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-yellow-400" />
                    <span className="font-medium text-gray-600">Average Rating:</span>
                    <div className="ml-2 flex items-center">
                      <StarRating rating={book.averageRating || 0} interactive={false} />
                      <span className="ml-2 text-gray-600">
                        ({book.averageRating ? book.averageRating.toFixed(1) : '0'}/5)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">Reviews:</span>
                    <span className="ml-2">{reviews.length}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {book.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{book.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
            
            {/* Add Review Button */}
            {user && !userHasReviewed && !isBookOwner && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Review
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <StarRating
                  rating={newReview.rating}
                  onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
                  interactive={true}
                  size="lg"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  placeholder="Write your review..."
                  required
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  onReviewUpdate={handleReviewUpdate}
                  onReviewDelete={handleReviewDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
              <p className="text-gray-600">Be the first to review this book!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
