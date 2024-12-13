// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { subscribeToMailchimp } = require('./mailchimp');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.get('/', (req, res) => {
	res.send('Server is running!');
});

app.post('/subscribe', async (req, res) => {
	const { email } = req.body;

	// Validation
	var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
	if (!email || !email.match(validRegex)) {
		return res.status(400).json({ error: 'Invalid email address' });
	}

	// Subscribe to Mailchimp
	try {
		const result = await subscribeToMailchimp(email);
		if (result.status === 'subscribed') {
			return res.status(200).json({ message: 'Successfully subscribed to the waitlist!' });
		}
	} catch (error) {
		if (error == 'Error: Member Exists') {
			return res.status(400).json({ error: "Oops! You're already on the waitlist." });
		}
		console.log('An error occurred while subscribing to the waitlist:', error);
		return res.status(500).json({ error: 'An error occurred while subscribing to the waitlist.' });
	}
});

// Listen to the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
