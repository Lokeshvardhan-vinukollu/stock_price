const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');
const request = require('request');
const passwordHash = require('password-hash');
const session = require('express-session');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require('./key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();

app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

const stockPricesData = [
    { symbol: 'AAPL', price: 145.32 },
    { symbol: 'GOOGL', price: 2734.87 },
    { symbol: 'AMZN', price: 3335.55 }
];

app.set('view engine', 'ejs');

// Route to render the home page
app.get('/', (req, res) => {
    res.render('home');
});

// Login route
app.post('/loginSubmit', async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).send('Email and password are required.');
        }

        const usersData = await db.collection('users')
            .where('email', '==', email)
            .get();

        let verified = false;
        let user = null;

        usersData.forEach((doc) => {
            if (passwordHash.verify(password, doc.data().password)) {
                verified = true;
                user = doc.data();
            }
        });

        if (verified) {
            // Save user info in session
            req.session.user = user;
            // Redirect to dashboard upon successful login
            res.redirect('/dashboard');
        } else {
            res.send('Login failed...');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.send('Something went wrong...');
    }
});

// Signup route
app.post('/signupSubmit', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.send('Passwords do not match. Please try again.');
    }

    try {
        const usersData = await db.collection('users')
            .where('email', '==', email)
            .get();

        if (!usersData.empty) {
            return res.send('SORRY!!! This account already exists...');
        }

        await db.collection('users').add({
            userName: username,
            email: email,
            password: passwordHash.generate(password)
        });

        res.sendFile(path.join(__dirname, 'public', 'login.html'));
    } catch (error) {
        console.error('Error during signup:', error);
        res.send('Something went wrong...');
    }
});

// Dashboard route
app.get('/dashboard', (req, res) => {
    const username = req.query.username || 'User'; // Replace this with actual username fetching logic
    res.render('dashboard', { username: username, stockPrices: stockPricesData });
});


// Fetch Stock Price Data Route
app.get('/getStockPrice', (req, res) => {
    const symbol = req.query.symbol || 'AAPL'; // Default symbol is AAPL

    request.get({
        url: `https://api.api-ninjas.com/v1/stockprice?ticker=${symbol}`,
        headers: {
            'X-Api-Key': 'A+1NSkA69/hFfijtFTm/DQ==AOoAmZJZ2OVl0d9R'
        },
    }, function(error, response, body) {
        if (error) {
            console.error('Error fetching stock price data:', error);
            return res.status(500).json({ error: 'Request failed' });
        } else if (response.statusCode !== 200) {
            console.error('Error fetching stock price data:', response.statusCode);
            return res.status(response.statusCode).json({ error: 'Error fetching data' });
        } else {
            try {
                const stockData = JSON.parse(body);
                res.json(stockData);
            } catch (error) {
                console.error('Error parsing stock price data:', error);
                res.status(500).json({ error: 'Error parsing data' });
            }
        }
    });
});

app.listen(2000, () => {
    console.log('Server is running on port 2000');
});