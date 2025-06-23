# Threads Web

[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/Blast2003/Threads_Web)

A full-stack web application inspired by Meta's Threads, built with the MERN stack (MongoDB, Express, React, Node.js) and featuring real-time communication with Socket.IO.

## ✨ Features

- **User Authentication**: Secure signup, login, and logout functionality using JWT and cookies.
- **Profile Management**: Users can create, view, and update their profiles with a name, username, bio, and profile picture.
- **Post Creation & Interaction**: Create text-based posts, optionally with images. Like/unlike and reply to posts.
- **Personalized Feed**: The home page displays a feed of posts from users you follow, sorted chronologically.
- **Follow/Unfollow System**: Users can follow and unfollow other users to customize their feed.
- **User Suggestions**: A "Suggested Users" component helps users discover new people to follow.
- **Real-Time Chat**:
  - One-on-one private conversations.
  - Real-time messaging using Socket.IO.
  - Online status indicators for users.
  - "Seen" status for messages.
  - Supports sending images in chats.
- **Image Uploads**: Cloudinary integration for handling profile pictures and post images.
- **Account Management**: Ability to "freeze" an account, which makes the profile inaccessible until the next login.
- **Responsive Design**: A clean, responsive UI built with Chakra UI that works across devices.

## 🛠️ Tech Stack

| Category      | Technology                                                                                                                                                                                                                                                                                    |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**  | [React](https://react.dev/), [Vite](https://vitejs.dev/), [Chakra UI](https://chakra-ui.com/), [Recoil](https://recoiljs.org/), [React Router](https://reactrouter.com/), [Socket.IO Client](https://socket.io/docs/v4/client-api/)                                                           |
| **Backend**   | [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [MongoDB](https://www.mongodb.com/), [Mongoose](https://mongoosejs.com/), [Socket.IO](https://socket.io/), [JWT](https://jwt.io/), [Cloudinary](https://cloudinary.com/), [bcryptjs](https://github.com/dcodeIO/bcrypt.js) |
| **Dev Tools** | [Nodemon](https://nodemon.io/), [ESLint](https://eslint.org/)                                                                                                                                                                                                                                 |

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18.x or later)
- npm
- MongoDB instance (local or a cloud service like MongoDB Atlas)

### Installation & Setup

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/blast2003/Threads_Web.git
    cd Threads_Web
    ```

2.  **Install backend dependencies:**

    ```sh
    npm install
    ```

3.  **Install frontend dependencies:**

    ```sh
    npm install --prefix frontend
    ```

4.  **Set up environment variables:**

    Create a `.env` file in the root of the `/backend` directory and add the following variables. Replace the placeholder values with your own keys.

    ```env
    PORT=5010
    MONGO_URL=your_mongodb_connection_string
    JWT_SECRET_KEY=your_jwt_secret_key

    # Cloudinary Credentials for image uploads
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    COLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

### Running the Application

1.  **Start the backend server (development mode):**

    From the root project directory, run:

    ```sh
    npm run dev
    ```

    This will start the backend server with `nodemon` on the port specified in your `.env` file (defaults to `5010`).

2.  **Start the frontend development server:**

    In a new terminal, navigate to the `frontend` directory and run:

    ```sh
    cd frontend
    npm run dev
    ```

    The frontend React application will be available at `http://localhost:3000`. The Vite server is configured to proxy API requests from `/api` to the backend server.

## 📂 Project Structure

The repository is structured as a monorepo with two main directories:

```
.
├── backend/            # Contains all the server-side code
│   ├── src/
│   │   ├── config/     # Database connection and environment variables
│   │   ├── controllers/ # Request handling logic for each route
│   │   ├── middlewares/ # Express middlewares (e.g., authentication)
│   │   ├── models/     # Mongoose schemas for DB collections
│   │   ├── routes/     # API route definitions
│   │   ├── socket/     # Socket.IO connection and event handling
│   │   └── utils/      # Utility functions (e.g., token generation)
│   └── server.js       # The main entry point for the backend server
│
├── frontend/           # Contains all the client-side React code
│   ├── src/
│   │   ├── atoms/      # Recoil atoms for state management
│   │   ├── components/ # Reusable React components
│   │   ├── context/    # React context providers (e.g., Socket.IO)
│   │   ├── hooks/      # Custom React hooks for reusable logic
│   │   ├── pages/      # Page-level components
│   │   └── App.jsx     # Main application component with routing
│   └── vite.config.js  # Vite configuration (including proxy setup)
│
└── package.json        # Root package file for managing backend scripts
```

## 🔐 API Endpoints

The backend exposes the following REST API routes:

### User Routes (`/api/user`)

- `POST /signup`: Register a new user.
- `POST /login`: Log in an existing user.
- `POST /logout`: Log out the current user.
- `POST /follow/:id`: Follow or unfollow a user.
- `PUT /update/:id`: Update the profile of the current user.
- `PUT /freeze`: Freeze the current user's account.
- `GET /profile/:query`: Get a user's profile by username or ID.
- `GET /suggested`: Get a list of suggested users to follow.

### Post Routes (`/api/post`)

- `POST /create`: Create a new post.
- `GET /feed/post`: Get the feed of posts from followed users.
- `GET /:id`: Get a specific post by its ID.
- `GET /user/:username`: Get all posts by a specific user.
- `DELETE /delete/:postId`: Delete a post.
- `PUT /like/:id`: Like or unlike a post.
- `PUT /reply/:id`: Reply to a post.

### Message Routes (`/api/message`)

- `GET /`: Get all conversations for the current user.
- `POST /`: Send a new message.
- `GET /:otherUserId`: Get messages in a conversation with another user.
