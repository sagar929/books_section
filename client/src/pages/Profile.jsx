import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';
import BookCard from '../components/BookCard';
import ReviewCard from '../components/ReviewCard';
import { 
  User, 
  BookOpen, 
  MessageCircle, 
  Calendar,
  Plus,
  Star 
} from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [userBooks, setUserBooks] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('books');
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalReviews: 0,
    averageRating: 0
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = useCallback(async () => {
    try {
      const [booksResponse, reviewsResponse] = await Promise.all([
        api.get('/books/user/me'),
        api.get('/reviews/user/me')
      ]);

      if (booksResponse.data.success) {
        setUserBooks(booksResponse.data.books);
        setStats(prev => ({ ...prev, totalBooks: booksResponse.data.books.length }));
      }

      if (reviewsResponse.data.success) {
        setUserReviews(reviewsResponse.data.reviews);
        setStats(prev => ({ 
          ...prev, 
          totalReviews: reviewsResponse.data.reviews.length,
          averageRating: calculateAverageRating(reviewsResponse.data.reviews)
        }));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const handleBookUpdate = (updatedBook) => {
    setUserBooks(userBooks.map(book => 
      book._id === updatedBook._id ? updatedBook : book
    ));
  };

  const handleBookDelete = (bookId) => {
    setUserBooks(userBooks.filter(book => book._id !== bookId));
    setStats(prev => ({ ...prev, totalBooks: prev.totalBooks - 1 }));
    toast.success('Book deleted successfully!');
  };

  const handleReviewUpdate = (updatedReview) => {
    setUserReviews(userReviews.map(review => 
      review._id === updatedReview._id ? updatedReview : review
    ));
  };

  const handleReviewDelete = (reviewId) => {
    setUserReviews(userReviews.filter(review => review._id !== reviewId));
    setStats(prev => ({ 
      ...prev, 
      totalReviews: prev.totalReviews - 1,
      averageRating: calculateAverageRating(userReviews.filter(review => review._id !== reviewId))
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-6">
              <User className="h-12 w-12 text-white" />
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
              <p className="text-gray-600 mb-4">{user.email}</p>
              <div className="flex items-center text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Member since {formatDate(user.createdAt || new Date())}</span>
              </div>
            </div>

            {/* Add Book Button */}
            <Link
              to="/books/add"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Books Added</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBooks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reviews Written</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-full p-3">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating Given</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating}/5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('books')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'books'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Books ({stats.totalBooks})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Reviews ({stats.totalReviews})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Books Tab */}
            {activeTab === 'books' && (
              <div>
                {userBooks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userBooks.map((book) => (
                      <BookCard
                        key={book._id}
                        book={book}
                        onUpdate={handleBookUpdate}
                        onDelete={handleBookDelete}
                        showOwnerActions={true}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Books Added Yet</h3>
                    <p className="text-gray-600 mb-4">Share your favorite books with the community!</p>
                    <Link
                      to="/books/add"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Book
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                {userReviews.length > 0 ? (
                  <div className="space-y-6">
                    {userReviews.map((review) => (
                      <div key={review._id} className="border border-gray-200 rounded-lg p-4">
                        {/* Book Info */}
                        <div className="mb-4 pb-4 border-b border-gray-100">
                          <Link
                            to={`/books/${review.book._id}`}
                            className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                          >
                            {review.book.title}
                          </Link>
                          <p className="text-gray-600">by {review.book.author}</p>
                        </div>
                        
                        {/* Review */}
                        <ReviewCard
                          review={review}
                          onReviewUpdate={handleReviewUpdate}
                          onReviewDelete={handleReviewDelete}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Written Yet</h3>
                    <p className="text-gray-600 mb-4">Start reviewing books to share your thoughts with others!</p>
                    <Link
                      to="/"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Browse Books
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
