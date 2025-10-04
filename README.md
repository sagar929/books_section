# Book Review Platform

A simple and clean book review website where people can share their favorite books and read what others think about them.

## What this project does

- Users can sign up and log in
- Add books they've read or want to recommend
- Write reviews and rate books
- Browse books added by other users
- Manage their own book collection and reviews

## How to run this locally

### What you need first
- Node.js installed on your computer
- MongoDB (you can use MongoDB Atlas for free online)

### Setting up the backend
1. Open terminal and go to the server folder:
   ```
   cd server
   ```
2. Install the required packages:
   ```
   npm install
   ```
3. Create a `.env` file in the server folder and add:
   ```
   MONGODB_URI=your_mongodb_connection_string_here
   JWT_SECRET=any_random_secret_key_here
   PORT=5000
   ```
4. Start the server:
   ```
   npm start
   ```

### Setting up the frontend
1. Open a new terminal and go to the client folder:
   ```
   cd client
   ```
2. Install the required packages:
   ```
   npm install
   ```
3. Start the frontend:
   ```
   npm run dev
   ```

Now open your browser and go to `http://localhost:5173` to see the website!

## What technologies I used

**Frontend:**
- React - for building the user interface
- Tailwind CSS - for styling and making it look good
- Vite - for fast development

**Backend:**
- Node.js and Express - for the server
- MongoDB - for storing all the data
- JWT - for user authentication

## Project structure

```
├── client/          # Frontend React app
├── server/          # Backend API
└── README.md       # This file
```

## Features

- Clean and responsive design that works on mobile
- User authentication with secure password hashing
- Add, edit, and delete your own books
- Write and manage reviews
- Browse all books with pagination
- User profile page

## Screenshots

[You can add screenshots of your website here]

## Future improvements

- Search functionality
- Book categories/genres filtering
- User following system
- Email notifications
- Book recommendations

---

Feel free to use this project as a learning resource or contribute to make it better!
