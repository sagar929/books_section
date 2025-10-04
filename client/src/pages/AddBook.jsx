// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/Authcontext';
// import { BookOpen, ArrowLeft } from 'lucide-react';
// import { api } from '../services/api';
// import toast from 'react-hot-toast';

// const AddBook = () => {
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);
  
//   const [formData, setFormData] = useState({
//     title: '',
//     author: '',
//     genre: '',
//     description: ''
    
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   const genres = [
//     'Fiction',
//     'Non-Fiction',
//     'Mystery',
//     'Romance',
//     'Science Fiction',
//     'Fantasy',
//     'Biography',
//     'History',
//     'Self-Help',
//     'Business',
//     'Technology',
//     'Health',
//     'Travel',
//     'Cooking',
//     'Art',
//     'Religion',
//     'Politics',
//     'Philosophy',
//     'Poetry',
//     'Drama',
//     'Horror',
//     'Thriller',
//     'Adventure',
//     'Children',
//     'Young Adult',
//     'Other'
//   ];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!formData.title.trim() || !formData.author.trim() || !formData.genre) {
//       toast.error('Please fill in all required fields');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await api.post('/books/add', formData);
      
//       if (response.data.success) {
//         toast.success('Book added successfully!');
//         navigate(`/books/${response.data.book._id}`);
//       }
//     } catch (error) {
//       console.error('Error adding book:', error.message);
//       toast.error(error.response?.data?.message || 'Failed to add book');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
//           <p className="text-gray-600 mb-4">Please log in to add a book.</p>
//           <button
//             onClick={() => navigate('/login')}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => navigate(-1)}
//             className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
//           >
//             <ArrowLeft className="h-5 w-5 mr-2" />
//             Back
//           </button>
          
//           <div className="text-center">
//             <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-4 w-16 h-16 mx-auto mb-4">
//               <BookOpen className="h-8 w-8 text-white" />
//             </div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Book</h1>
//             <p className="text-gray-600">Share a great book with the community</p>
//           </div>
//         </div>

//         {/* Form */}
//         <div className="bg-white rounded-lg shadow-lg p-8">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Title */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Book Title <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter the book title"
//                 required
//               />
//             </div>

//             {/* Author */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Author <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="author"
//                 value={formData.author}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter the author's name"
//                 required
//               />
//             </div>

//             {/* Genre */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Genre <span className="text-red-500">*</span>
//               </label>
//               <select
//                 name="genre"
//                 value={formData.genre}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 required
//               >
//                 <option value="">Select a genre</option>
//                 {genres.map((genre) => (
//                   <option key={genre} value={genre}>
//                     {genre}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Description */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows="5"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Enter a brief description of the book (optional)"
//               />
//               <p className="mt-1 text-sm text-gray-500">
//                 This will help other users understand what the book is about.
//               </p>
//             </div>

//             {/* Submit Buttons */}
//             <div className="flex space-x-4 pt-6">
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//               >
//                 {isLoading ? (
//                   <div className="flex items-center justify-center">
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                     Adding Book...
//                   </div>
//                 ) : (
//                   'Add Book'
//                 )}
//               </button>
              
//               <button
//                 type="button"
//                 onClick={() => navigate(-1)}
//                 disabled={isLoading}
//                 className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Tips Section */}
//         <div className="mt-8 bg-blue-50 rounded-lg p-6">
//           <h3 className="text-lg font-semibold text-blue-900 mb-3">Tips for Adding Books</h3>
//           <ul className="space-y-2 text-blue-800">
//             <li className="flex items-start">
//               <span className="flex-shrink-0 h-2 w-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
//               Make sure the book title and author are spelled correctly
//             </li>
//             <li className="flex items-start">
//               <span className="flex-shrink-0 h-2 w-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
//               Choose the most appropriate genre for the book
//             </li>
//             <li className="flex items-start">
//               <span className="flex-shrink-0 h-2 w-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
//               Write a compelling description to help others discover the book
//             </li>
//             <li className="flex items-start">
//               <span className="flex-shrink-0 h-2 w-2 bg-blue-600 rounded-full mt-2 mr-3"></span>
//               Check if the book already exists before adding a duplicate
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddBook;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Book, User, Type, Calendar, FileText } from 'lucide-react';

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: 'Fiction', // Default genre
    publishedYear: '', // Added publishedYear
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const genres = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy',
    'Biography', 'History', 'Self-Help', 'Other'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.publishedYear) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setIsLoading(true);
    try {
      await bookAPI.create(formData);
      toast.success('Book added successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error adding book:', error);
      toast.error(error.response?.data?.message || 'Failed to add book');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Add a New Book</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <div className="relative">
            <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="e.g., The Great Gatsby" />
          </div>
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input type="text" name="author" value={formData.author} onChange={handleChange} required className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="e.g., F. Scott Fitzgerald" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Genre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select name="genre" value={formData.genre} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 appearance-none bg-white">
                {genres.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Published Year - ADDED THIS BLOCK */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Published Year</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input type="number" name="publishedYear" value={formData.publishedYear} onChange={handleChange} required className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="e.g., 1925" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <div className="relative">
            <FileText className="absolute left-3 top-4 text-gray-400 h-5 w-5" />
            <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="A short summary of the book..."></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? 'Adding Book...' : 'Add Book'}
        </button>
      </form>
    </div>
  );
};

export default AddBook;