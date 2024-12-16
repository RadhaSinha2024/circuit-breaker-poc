const express = require("express");
const router = express.Router();

// Define the GET /test route
router.get("/test", (req, res) => {
	throw new Error("god save me");
	res.json({ message: "Hello World" });
});

router.get("/test2", (req, res) => {
	//throw "god save me";
	res.json({ message: "Hello World2" });
});
module.exports = router;
