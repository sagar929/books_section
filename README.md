Book Review Website

This is a simple website where users can sign up and add books they like. Other people can see the books and write reviews on them.

What the project does

Users can create an account and log in

Add books with title, author, genre and description

Write reviews on books

View books added by other people

Edit or delete your own books and reviews

How to run this project
Requirements

Node.js installed

MongoDB (you can use local or MongoDB Atlas online)

Backend Setup

Open terminal

Go to server folder

cd server


Install packages

npm install


Create a .env file inside the server folder and add this:

MONGODB_URI=your_mongodb_url_here
JWT_SECRET=your_secret_key
PORT=5000


Start the backend

npm start

Frontend Setup

Open another terminal

Go to client folder

cd client


Install packages

npm install


Start frontend

npm run dev


Open browser and go to

http://localhost:5173

Tech Stack
Frontend

React

Tailwind CSS

Vite

Backend

Node.js

Express

MongoDB

JWT

Project Structure
client/ - frontend code
server/ - backend code
README.md - this file

Features

User login and signup

Add books

Edit and delete your own books

Write reviews

Simple and responsive design

Things to improve in future

Search for books

Filter books by genre

User profiles

Follow users

Email verification
