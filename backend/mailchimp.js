// mailchimp.js

const API_KEY = process.env.MAILCHIMP_API_KEY;
const API_SERVER = process.env.MAILCHIMP_API_SERVER;
const LIST_ID = process.env.MAILCHIMP_AUDIENCE_ID;

async function subscribeToMailchimp(email) {
	const url = `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

	const body = {
		email_address: email,
		status: 'subscribed',
	};

	const response = await fetch(url, {
		method: 'POST',
		headers: { Authorization: `apikey ${API_KEY}`, 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});

	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.title);
	}
	return data;
}

module.exports = { subscribeToMailchimp };
