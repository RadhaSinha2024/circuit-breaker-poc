const express = require("express");
const app = express();

app.get("/data", (req, res) => {
	// Simulate a random failure
	const params = req.query;
	if (params.value == "Error") {
		res.status(500).send("Internal Server Error");
	} else {
		res.send({ message: "Success from Responder" });
	}
});

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Service B running on http://localhost:${PORT}`);
});
