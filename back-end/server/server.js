const express = require('express');
const cors = require('cors');
require('dotenv').config();
//Next two lines are for user routes
const {body, validationRes} = require('express-validator');
const User = require('../models/user.js');

const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();

const PORT = 4000;

app.use(cors());
app.use(express.json());

app.post('/getDirections', async (req, res) => {
    const body = req.body;
    const response = await fetch(`https://api.openrouteservice.org/v2/directions/${body.transportation}/geojson`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
            'Authorization': process.env.ORS_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            coordinates: body.coordinates,
            geometry: 'true',
        })
    });

    const data = await response.json();
    res.json({ data });

});

app.post('/optimize', async(req, res) => {
    const body = req.body;
    const response = await fetch(`https://api.openrouteservice.org/v2/directions/${body.transportation}/geojson`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
            'Authorization': process.env.ORS_API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            coordinates: body.coordinates,
            geometry: 'true',
        })
    });

    const data = await response.json();
    res.json({ data });
});

//POST for /register
app.post(
    '/register',
    [
        body('username').notEmpty().withMessage('Username is required.'),
        body('email').isEmail().withMessage('Invalid email format.'),
        body('googleId').notEmpty().withMessage('Google ID is required.'),
    ],
    async (req, res) => {
        const errors = validationRes(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, email, googleId } = req.body;
        try {
            const newUser = await User.create({ username, email, googleId });
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                res.status(409).json({ error: 'Google ID, email, or username already exists.' });
            } else {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }
);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
