
# URL Shortening Service

This is a URL shortening service built with Node.js, Express, MongoDB, and Redis. It provides functionalities for users to shorten URLs, generate QR codes for shortened URLs, view analytics on their shortened URLs, and access their URL shortening history.

## Features

- **User Registration & Authentication:** Users can register and log in to the service.
- **URL Shortening:** Authenticated users can shorten URLs and generate custom URLs.
- **QR Code Generation:** Users can generate QR codes for their shortened URLs.
- **URL Analytics:** Users can track the number of clicks their shortened URLs have received.
- **History:** Users can view a history of the URLs they have shortened.
- **Redis Caching:** Shortened URLs are cached in Redis for quick access.

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express** - Web framework for Node.js
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling tool
- **Redis** - In-memory data structure store, used as a cache
- **TypeScript** - Typed superset of JavaScript
- **Jest** - JavaScript testing framework
- **bcryptjs** - Password hashing
- **jsonwebtoken** - Token-based authentication

## Prerequisites

- **Node.js**: Ensure that you have Node.js installed. You can download it from [here](https://nodejs.org/).
- **MongoDB**: A MongoDB instance is required. You can use a local instance or a cloud-based service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- **Redis**: Redis should be installed and running. You can download it from [here](https://redis.io/download).

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/lovedayikegbulam/url-shortener.git
cd url-shortener
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and configure the following environment variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/urlshortener
JWT_SECRET=your_secret_key
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
DOMAIN_NAME=http://localhost:3000/
```

- `PORT`: The port on which the server will run.
- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for JWT token generation.
- `REDIS_HOST`: Redis server host.
- `REDIS_PORT`: Redis server port.
- `DOMAIN_NAME`: The base domain name for your service.

Check .env.example file for more env variables

### 4. Start the Application

```bash
npm run dev
```

The application should now be running on `http://localhost:3000/`.

### 5. Running Tests

The application includes test cases written using Jest. To run the tests, use the following command:

```bash
npm run test
```

### 6. API Endpoints

#### User Authentication

- **Register User**

  - `POST /api/auth/register`
  - Request Body:
    ```json
    {
      "username": "johndoe",
      "email": "johndoe@example.com",
      "password": "password123"
    }
    ```
  - Response: Returns a JWT token on successful registration.

- **Login User**

  - `POST /api/auth/login`
  - Request Body:
    ```json
    {
      "email": "johndoe@example.com",
      "password": "password123"
    }
    ```
  - Response: Returns a JWT token on successful login.

#### URL Shortening

- **Shorten URL**

  - `POST /api/shorten`
  - Headers: `Authorization: Bearer <token>`
  - Request Body:
    ```json
    {
      "longUrl": "https://example.com",
      "customUrl": "custom"
    }
    ```
  - Response: Returns the shortened URL.

- **Redirect to Long URL**

  - `GET /:id`
  - Example: `GET /abc123`
  - Response: Redirects to the original long URL.

#### QR Code Generation

- **Generate QR Code**

  - `POST /api/generate-qr`
  - Headers: `Authorization: Bearer <token>`
  - Request Body:
    ```json
    {
      "shortUrl": "http://localhost:3000/abc123"
    }
    ```
  - Response: Returns the URL of the generated QR code.

#### Analytics

- **Get Link Analytics**

  - `GET /api/analytics`
  - Headers: `Authorization: Bearer <token>`
  - Request Body:
    ```json
    {
      "shortUrl": "http://localhost:3000/abc123"
    }
    ```
  - Response: Returns the number of clicks the shortened URL has received.

#### URL History

- **Get Link History**

  - `GET /api/history`
  - Headers: `Authorization: Bearer <token>`
  - Response: Returns a list of URLs shortened by the authenticated user.

  #### Delete

- **Delete Short Url**

  - `Delete /api/delete`
  - Headers: `Authorization: Bearer <token>`
  - Request Body:
    ```json
    {
      "message": "URL deleted successfully"
    }
    ```
  - Response: Returns that the Url have been deleted successfully.


## Additional Notes

- **Middleware:** The authentication middleware checks if a user is logged in by verifying the JWT token. This middleware should be applied to all routes that require authentication.
- **Error Handling:** The controllers handle various errors such as validation errors, server errors, and custom errors like "User already exists" or "Invalid credentials."
- **Security:** Passwords are hashed using `bcryptjs`, and JWT tokens are used for secure authentication.
- **Testing:** Test cases cover key functionalities, including user registration, login, URL shortening, and analytics retrieval. Jest is used as the testing framework.

## Conclusion

This URL Shortening Service provides a robust and scalable solution for creating and managing shortened URLs, complete with user authentication, QR code generation, analytics, and history tracking. It's built with modern web technologies, making it suitable for production deployment with further enhancements and scaling options.

Feel free to contribute to the project or report any issues you encounter!
