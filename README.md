# stock_price:
## Stock Price Details Web Application

## Project Overview

The Stock Price Details web application is designed to provide users with up-to-date stock price information for various companies. This application allows users to sign up, log in, and check the stock prices of their chosen companies using real-time data. The project integrates various technologies and services, including Firebase for user authentication and data storage, and a third-party API for fetching stock price data.

## Key Features

1. *User Authentication*: Users can sign up for an account, log in, and access a personalized dashboard.
2. *Stock Price Data Retrieval*: The application fetches real-time stock price data from a third-party API.
3. *Informative Content*: Provides educational content about stock markets and investment tips.
4. *Responsive Design*: Ensures a seamless user experience across different devices.

## Technologies Used

- *Frontend*: HTML, CSS, EJS (Embedded JavaScript Templates)
- *Backend*: Node.js, Express.js
- *Database*: Firestore (Firebase)
- *Authentication*: Firebase Authentication
- *API Integration*: API Ninjas (for stock price data)
- *Session Management*: Express-session

## File Structure

### Frontend Files

#### home.ejs

- The home page of the application.
- Contains navigation links to other pages such as Login, Sign Up, and Dashboard.
- Features a hero section with an introduction to the application.
- Provides informative content about stock markets and investment tips.

#### signup.html

- Sign-up page for new users.
- Includes a form for entering username, email, and password.
- Validates password confirmation before submission.

#### login.html

- Login page for existing users.
- Includes a form for entering email and password.

#### dashboard.ejs

- Dashboard page accessible after user login.
- Displays a welcome message and user-specific information.
- Includes a form to search for stock prices by company symbol.
- Shows stock price data in a table format and indicates performance trends (UP or DOWN).

### Backend Files

#### server.js

- Main server file that initializes the Express application.
- Sets up middleware for body parsing, static file serving, and session management.
- Connects to Firebase using service account credentials.
- Defines routes for the home page, login, signup, and dashboard.
- Implements logic for user authentication and data retrieval.
- Fetches stock price data from the third-party API and processes it.

### Public Files

- Contains static assets such as CSS files and images used in the frontend.

## Routes and Endpoints

### GET /

- Renders the home page (home.ejs).

### POST /loginSubmit

- Handles user login.
- Validates user credentials against Firebase Firestore.
- Redirects to the dashboard upon successful login.

### POST /signupSubmit

- Handles user sign-up.
- Checks if the email already exists in the database.
- Adds new user data to Firebase Firestore.

### GET /dashboard

- Renders the dashboard page (dashboard.ejs).
- Requires user authentication.

### GET /getStockPrice

- Fetches stock price data for the specified company symbol using the API Ninjas.
- Processes the data and stores it in the session.
- Returns the stock price data in JSON format.

## How to Run the Project

1. *Clone the repository*:
   bash
   git clone https://github.com/your-username/stock-price-details.git
   cd stock-price-details
   

2. *Install dependencies*:
   bash
   npm install
   

3. *Set up Firebase*:
   - Obtain Firebase service account credentials and save the file as key.json in the project root.
   - Ensure Firebase Firestore is set up for user data storage.

4. *Set up Environment Variables*:
   - Create a .env file to store sensitive information such as API keys.

5. *Start the server*:
   bash
   node server.js
   

6. *Access the application*:
   - Open your browser and navigate to http://localhost:2000.
