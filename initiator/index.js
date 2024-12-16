const express = require("express");
const axios = require("axios");
const CircuitBreaker = require("opossum");

const app = express();

// Circuit Breaker options
const options = {
	timeout: 3000, // If the request takes longer than 3 seconds, trigger a failure
	errorThresholdPercentage: 50, // Break the circuit if 50% of requests fail
	resetTimeout: 500000, // After 5 seconds, try again
};

// Circuit Breaker logic
const circuitBreaker = new CircuitBreaker(async (params) => {
	const response = await axios.get("http://localhost:3001/data", { params });
	if (response.status >= 200 && response.status < 300) {
		return response.data;
	} else {
		// Throw an error for non-2xx responses
		throw new Error(`HTTP Error: ${response.status}`);
	}
}, options);

// Fallback function
circuitBreaker.fallback(() => ({
	message: "Fallback: Service B is unavailable. Please try again later.",
}));

app.get("/fetch-data", async (req, res) => {
	try {
		const params = req.query;
		const result = await circuitBreaker.fire(params);
		res.send(result);
	} catch (err) {
		res
			.status(500)
			.send({ message: "Circuit breaker error", error: err.message });
	}
});

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Service A running on http://localhost:${PORT}`);
});
